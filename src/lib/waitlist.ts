import { z } from "zod";

const emailSchema = z.email();

const waitlistFields = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  businessName: z
    .string()
    .trim()
    .min(1, "Enter your business name")
    .max(160),
  address: z.string().trim().min(1, "Enter your address").max(400),
  contact: z
    .string()
    .trim()
    .min(1, "Enter an email or phone number")
    .max(160),
});

export type WaitlistSignup = {
  name: string;
  businessName: string;
  address: string;
  contact: string;
};

/** Emails are lowercased. Phones collapse to digits so formatting does not matter. */
export function normalizeContact(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (emailSchema.safeParse(trimmed).success) {
    return trimmed.toLowerCase();
  }
  const compact = trimmed.replace(/[\s().-]/g, "");
  if (!/^\+?\d+$/.test(compact)) return null;
  const digits = compact.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return digits;
}

export function parseWaitlist(
  input: unknown,
): { ok: true; data: WaitlistSignup } | { ok: false; error: string } {
  const parsed = waitlistFields.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Check the form and try again.",
    };
  }
  const contact = normalizeContact(parsed.data.contact);
  if (!contact) {
    return { ok: false, error: "Enter a valid email or phone number." };
  }
  return {
    ok: true,
    data: {
      name: parsed.data.name,
      businessName: parsed.data.businessName,
      address: parsed.data.address,
      contact,
    },
  };
}
