import { COUNTRY_CODES, PHONE } from "@/lib/constants/booking";

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

/** Keep digits only (no spaces/symbols), capped to `max` length. */
export function digitsOnly(input: string, max = 15): string {
  return input.replace(/\D/g, "").slice(0, max);
}

/**
 * Combine a dial code (e.g. "+91") with a national number into E.164
 * ("+919876543210"). Returns "" when there are no digits.
 */
export function toE164(dialCode: string, national: string): string {
  const digits = national.replace(/\D/g, "");
  return digits ? `${dialCode}${digits}` : "";
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

/**
 * Display an E.164 phone as "dial-code national-number" with NO gap between
 * the digits, e.g. "+91 6464646464". Splits the longest matching country dial
 * code so non-Indian numbers render correctly too.
 */
export function formatPhoneWithCode(input: string): string {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("+")) {
    const code = COUNTRY_CODES.map((c) => c.code)
      .sort((a, b) => b.length - a.length)
      .find((c) => trimmed.startsWith(c));
    if (code) {
      const national = trimmed.slice(code.length);
      return national ? `${code} ${national}` : code;
    }
    return trimmed;
  }
  // Legacy bare digits — assume the default dial code.
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `${PHONE.countryCode} ${digits}` : "";
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
