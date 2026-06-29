import { PHONE } from "@/lib/constants/booking";

/**
 * Strip everything except digits, dropping a leading 91 country code or 0.
 * Returns at most `PHONE.nationalLength` digits.
 */
export function normalizeIndianPhone(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length > PHONE.nationalLength) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = digits.replace(/^0+/, "");
  }
  return digits.slice(0, PHONE.nationalLength);
}

/**
 * Canonical storage form the booking service expects: "+919876543210"
 * (regex `^\+91[6-9]\d{9}$`). Use this at the persistence boundary; keep
 * {@link normalizeIndianPhone} / {@link formatIndianPhone} for display.
 * Returns "" when the input isn't a complete national number.
 */
export function toE164IndianPhone(input: string): string {
  const digits = normalizeIndianPhone(input);
  return digits.length === PHONE.nationalLength
    ? `${PHONE.countryCode}${digits}`
    : "";
}

/**
 * Live, human-readable formatting for an Indian mobile number as the user
 * types: "98765 43210". Pure display helper — store the normalized digits.
 */
export function formatIndianPhone(input: string): string {
  const digits = normalizeIndianPhone(input);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** Full E.164-ish display form: "+91 98765 43210". */
export function formatPhoneWithCode(input: string): string {
  const formatted = formatIndianPhone(input);
  return formatted ? `${PHONE.countryCode} ${formatted}` : "";
}

/** Indian Rupee currency, no decimals by default. */
export function formatCurrency(amount: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(amount);
}

/** Two-letter initials from a full name ("Jane Doe" → "JD"). */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
