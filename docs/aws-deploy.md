# VergeCare live deploy (internal branch only)

Single EC2 box runs Docker Compose: Postgres + Next.js app + Caddy.
Same IAM user and deploy pattern already in use, smaller
script: `scripts/aws-deploy.sh`.

```
Internet → Elastic IP → Caddy :80/:443 → app :3002 + Postgres (localhost only)
```

This whole `deploy/` tree plus `Dockerfile` exists only on the local
`internal-VergeSnag` branch — never pushed.

## Prereqs (one-time)

- AWS CLI configured (existing AWS creds). Verify: `aws sts get-caller-identity`
- Docker Desktop running (for the fast local-build path)
- Meta key in `.env.local` as `META_MODEL_API_KEY` (copied into the box env)

## Deploy

```bash
git checkout internal-VergeSnag
chmod +x scripts/aws-deploy.sh
./scripts/aws-deploy.sh
```

First run launches a **t4g.small** (~$15/mo), attaches an Elastic IP, writes
`deploy/.secrets/app.env` (gitignored), builds the `linux/arm64` image,
starts the stack, and pushes the schema. Re-run to redeploy (reuses the box
+ secrets + IP).

With a domain (HTTPS via Caddy auto-provision):

```bash
DOMAIN=demo-vergesnag.goverge.app ./scripts/aws-deploy.sh
# Point an A record for demo-vergesnag.goverge.app at the printed Elastic IP.
# Hostinger name: demo-vergesnag. Caddy issues HTTPS after that record resolves.
```

Magic-link mail uses SES. In `deploy/.secrets/app.env` (never commit it) set:

- `APP_URL` and `NEXT_PUBLIC_APP_URL` to `https://demo-vergesnag.goverge.app`
- `SES_FROM_EMAIL` — a verified `goverge.app` sender (GoVerge uses `SES_FROM_EMAIL`)
- `SES_FROM_NAME=VergeCare`
- `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` — existing AWS credentials
- `SES_CONFIGURATION_SET` — optional, same configuration set as GoVerge if you already use one

Leave `SES_FROM_EMAIL` empty and the app still opens boards; it reports that nothing was sent.

Without Docker running: `REMOTE_BUILD=1 ./scripts/aws-deploy.sh` (slow).

## Day-2

```bash
ssh -i ~/.ssh/vergesnag-deploy.pem ec2-user@<elastic-ip>
cd ~/vergesnag && sudo docker compose -f deploy/docker-compose.prod.yml logs -f app

# stop billing when idle (keeps disk + IP)
aws ec2 stop-instances --instance-ids <id>
aws ec2 start-instances --instance-ids <id>
```

Seed demo data on the box (optional — live check-ins are the real demo):

```bash
ssh -i ~/.ssh/vergesnag-deploy.pem ec2-user@<elastic-ip>
# from your Mac with a tunnel, or add a seed step once schema is stable
```

## Branch workflow

- `internal-VergeSnag` (local only): full code + this deploy tree. Do all
  work here, including the hidden modules (board, Meta prompt).
- `main` (pushed): public build with mocks. Move safe changes across with
  `git checkout main && git cherry-pick <sha>` — never merge internal into
  main, and never `git push origin internal-VergeSnag`.
