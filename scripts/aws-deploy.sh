#!/bin/bash
# VergeSnag live deploy: single EC2 + Docker Compose (app + Postgres + Caddy).
# Run from the repo root on the internal-VergeSnag branch. Reuses the same
# AWS CLI credentials as GoVerge (aws sts get-caller-identity to verify).
#
#   ./scripts/aws-deploy.sh
#   DOMAIN=snag.example.com ./scripts/aws-deploy.sh   # HTTPS via Caddy
#   REMOTE_BUILD=1 ./scripts/aws-deploy.sh            # compile on EC2 (slow)
#
# Without DOMAIN the app serves plain HTTP on the Elastic IP.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REGION="${AWS_REGION:-us-east-1}"
NAME_TAG="${NAME_TAG:-vergesnag-app}"
INSTANCE_TYPE="${INSTANCE_TYPE:-t4g.small}"
VOLUME_GB="${VOLUME_GB:-40}"
KEY_NAME="${KEY_NAME:-vergesnag-deploy}"
SG_NAME="${SG_NAME:-vergesnag-app-sg}"
DOMAIN="${DOMAIN:-}"
REMOTE_BUILD="${REMOTE_BUILD:-0}"
REMOTE_DIR="\$HOME/vergesnag"
KEY_FILE="$HOME/.ssh/${KEY_NAME}.pem"
ENV_FILE="$ROOT/deploy/.secrets/app.env"

log() { printf '\n==> %s\n' "$*"; }
need() { command -v "$1" >/dev/null || { echo "Missing: $1"; exit 1; }; }
need aws
need ssh
need scp

# --- SSH key ---
if [[ ! -f "$KEY_FILE" ]]; then
  log "Creating key pair $KEY_NAME"
  aws ec2 create-key-pair --region "$REGION" --key-name "$KEY_NAME" \
    --query KeyMaterial --output text >"$KEY_FILE"
  chmod 600 "$KEY_FILE"
fi

# --- VPC + security group ---
VPC_ID="$(aws ec2 describe-vpcs --region "$REGION" \
  --filters Name=isDefault,Values=true \
  --query 'Vpcs[0].VpcId' --output text)"
SG_ID="$(aws ec2 describe-security-groups --region "$REGION" \
  --filters "Name=group-name,Values=$SG_NAME" \
  --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)"
if [[ -z "$SG_ID" || "$SG_ID" == "None" ]]; then
  log "Creating security group $SG_NAME"
  SG_ID="$(aws ec2 create-security-group --region "$REGION" \
    --group-name "$SG_NAME" --description "VergeSnag app HTTP/SSH" \
    --vpc-id "$VPC_ID" --query GroupId --output text)"
  aws ec2 authorize-security-group-ingress --region "$REGION" --group-id "$SG_ID" \
    --ip-permissions \
    'IpProtocol=tcp,FromPort=22,ToPort=22,IpRanges=[{CidrIp=0.0.0.0/0,Description=SSH}]' \
    'IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0,Description=HTTP}]' \
    'IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0,Description=HTTPS}]' \
    >/dev/null
fi

# --- AMI (Amazon Linux 2023 ARM64) ---
AMI="$(aws ec2 describe-images --region "$REGION" --owners amazon \
  --filters 'Name=name,Values=al2023-ami-2023*-kernel-6.1-arm64' \
    'Name=state,Values=available' \
  --query 'sort_by(Images,&CreationDate)[-1].ImageId' --output text)"

# --- Instance (reuse by Name tag) ---
INSTANCE_ID="$(aws ec2 describe-instances --region "$REGION" \
  --filters "Name=tag:Name,Values=$NAME_TAG" \
    "Name=instance-state-name,Values=pending,running" \
  --query 'Reservations[0].Instances[0].InstanceId' --output text 2>/dev/null || true)"
if [[ -z "$INSTANCE_ID" || "$INSTANCE_ID" == "None" ]]; then
  log "Launching EC2 $INSTANCE_TYPE"
  USER_DATA="$(cat <<'EOF'
#!/bin/bash
set -eux
dnf update -y
dnf install -y docker
systemctl enable --now docker
usermod -aG docker ec2-user
if [[ ! -f /swapfile ]]; then
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
fi
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-$(uname -m)" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
EOF
)"
  INSTANCE_ID="$(aws ec2 run-instances --region "$REGION" \
    --image-id "$AMI" --instance-type "$INSTANCE_TYPE" --key-name "$KEY_NAME" \
    --security-group-ids "$SG_ID" --user-data "$USER_DATA" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$NAME_TAG}]" \
    --block-device-mappings "[{\"DeviceName\":\"/dev/xvda\",\"Ebs\":{\"VolumeSize\":${VOLUME_GB},\"VolumeType\":\"gp3\"}}]" \
    --query 'Instances[0].InstanceId' --output text)"
  aws ec2 wait instance-running --region "$REGION" --instance-ids "$INSTANCE_ID"
fi

# --- Elastic IP (reuse by tag) ---
ALLOC_ID="$(aws ec2 describe-addresses --region "$REGION" \
  --filters "Name=tag:Name,Values=$NAME_TAG" \
  --query 'Addresses[0].AllocationId' --output text 2>/dev/null || true)"
if [[ -z "$ALLOC_ID" || "$ALLOC_ID" == "None" ]]; then
  log "Allocating Elastic IP"
  ALLOC_ID="$(aws ec2 allocate-address --region "$REGION" --domain vpc \
    --query AllocationId --output text)"
  aws ec2 create-tags --region "$REGION" --resources "$ALLOC_ID" \
    --tags "Key=Name,Value=$NAME_TAG"
fi
ASSOC="$(aws ec2 describe-addresses --region "$REGION" \
  --allocation-ids "$ALLOC_ID" --query 'Addresses[0].InstanceId' --output text)"
if [[ "$ASSOC" != "$INSTANCE_ID" ]]; then
  aws ec2 associate-address --region "$REGION" --instance-id "$INSTANCE_ID" \
    --allocation-id "$ALLOC_ID" >/dev/null
fi
PUBLIC_IP="$(aws ec2 describe-addresses --region "$REGION" \
  --allocation-ids "$ALLOC_ID" --query 'Addresses[0].PublicIp' --output text)"
log "Public IP $PUBLIC_IP"

# --- Secrets (local file, never committed) ---
mkdir -p "$(dirname "$ENV_FILE")"
if [[ ! -f "$ENV_FILE" ]]; then
  POSTGRES_PASSWORD="$(openssl rand -base64 24 | tr -d '=+/')x"
  if [[ -n "$DOMAIN" ]]; then
    APP_URL="https://$DOMAIN"
  else
    APP_URL="http://$PUBLIC_IP"
  fi
  META_KEY=""
  if [[ -f "$ROOT/.env.local" ]]; then
    META_KEY="$(grep -E '^META_MODEL_API_KEY=' "$ROOT/.env.local" | cut -d= -f2- | tr -d '"' || true)"
  fi
  cat >"$ENV_FILE" <<EOF
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
DOMAIN=${DOMAIN}
NEXT_PUBLIC_APP_URL=${APP_URL}
META_MODEL_API_KEY=${META_KEY}
EOF
  chmod 600 "$ENV_FILE"
  log "Wrote secrets to $ENV_FILE (edit NEXT_PUBLIC_APP_URL when DNS lands)"
else
  log "Reusing secrets in $ENV_FILE"
fi
# shellcheck disable=SC1090
source "$ENV_FILE"
if [[ -n "$DOMAIN" && "${NEXT_PUBLIC_APP_URL:-}" != "https://$DOMAIN" ]]; then
  echo "Note: DOMAIN=$DOMAIN but NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL — rebuild after DNS moves."
fi

SSH="ssh -i $KEY_FILE -o StrictHostKeyChecking=accept-new ec2-user@$PUBLIC_IP"
SCP="scp -i $KEY_FILE -o StrictHostKeyChecking=accept-new"

# --- Ship code ---
log "Shipping compose files"
$SSH "mkdir -p $REMOTE_DIR/deploy"
$SCP "$ROOT/deploy/docker-compose.prod.yml" "$ROOT/deploy/Caddyfile" "ec2-user@$PUBLIC_IP:$REMOTE_DIR/deploy/"
$SCP "$ENV_FILE" "ec2-user@$PUBLIC_IP:$REMOTE_DIR/.env"

if [[ "$REMOTE_BUILD" == "1" ]]; then
  log "Remote build (slow)"
  tar -czf /tmp/vergesnag-src.tgz --exclude='node_modules' --exclude='.next*' \
    --exclude='uploads' --exclude='.git' --exclude='deploy/.secrets' -C "$ROOT" .
  $SCP /tmp/vergesnag-src.tgz "ec2-user@$PUBLIC_IP:$REMOTE_DIR/src.tgz"
  rm -f /tmp/vergesnag-src.tgz
  $SSH "cd $REMOTE_DIR && tar -xzf src.tgz && rm -f src.tgz && \
    sudo docker compose -f deploy/docker-compose.prod.yml --env-file .env up -d --build"
else
  need docker
  docker info >/dev/null 2>&1 || { echo "Start Docker Desktop or re-run with REMOTE_BUILD=1"; exit 1; }
  log "Building linux/arm64 image locally"
  (cd "$ROOT" && docker buildx build --platform linux/arm64 \
    --build-arg "NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL" \
    -t vergesnag-app:latest --load .)
  docker save vergesnag-app:latest | gzip > /tmp/vergesnag-app.tgz
  $SCP /tmp/vergesnag-app.tgz "ec2-user@$PUBLIC_IP:$REMOTE_DIR/app.tgz"
  rm -f /tmp/vergesnag-app.tgz
  $SSH "cd $REMOTE_DIR && sudo docker load -i app.tgz >/dev/null && rm -f app.tgz && \
    sudo docker compose -f deploy/docker-compose.prod.yml --env-file .env up -d"
fi

# --- Schema push via SSH tunnel ---
log "Pushing schema"
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=accept-new -f -N -L 5544:localhost:5432 "ec2-user@$PUBLIC_IP"
sleep 2
if DATABASE_URL="postgres://postgres:${POSTGRES_PASSWORD}@localhost:5544/vergefield" \
    pnpm --dir "$ROOT" db:push </dev/null; then
  log "Schema pushed"
else
  echo "Automatic push failed — run it by hand while the tunnel above is open:"
  echo "  DATABASE_URL=postgres://postgres:<from $ENV_FILE>@localhost:5544/vergefield pnpm db:push"
fi
pkill -f "ssh.*5544:localhost:5432.*$PUBLIC_IP" 2>/dev/null || true

if [[ -n "${NEXT_PUBLIC_APP_URL:-}" ]]; then
  APP_URL="$NEXT_PUBLIC_APP_URL"
else
  APP_URL="http://$PUBLIC_IP"
fi
log "Live at $APP_URL"
log "Health: $APP_URL/api/health"
echo "SSH: ssh -i $KEY_FILE ec2-user@$PUBLIC_IP"
if [[ -z "$DOMAIN" ]]; then
  echo "Optional: point a domain A record at $PUBLIC_IP, set DOMAIN + NEXT_PUBLIC_APP_URL in $ENV_FILE, re-run."
fi
