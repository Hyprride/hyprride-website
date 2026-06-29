"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  ShieldCheck,
  Sparkles,
  Save,
  Wallet,
  FileCheck,
  Smartphone,
  Check,
  Gift,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BOOKING_RULES,
  EXTRA_KM_CHARGE,
  GST_RATE_PERCENT,
  SECURITY_DEPOSIT,
  SLAB_HOURS,
} from "@/lib/constants/booking";
import {
  combineDateTime,
  getDuration,
  isWeekendRate,
  toDateInputValue,
  toTimeInputValue,
  todayISODate,
} from "@/lib/utils/datetime";
import { formatCurrency, formatIndianPhone } from "@/lib/utils/format";
import {
  estimateForDuration,
  fleet,
  kmForDuration,
  unlimitedKmPriceForDuration,
} from "@/lib/data";
import { createBooking } from "../actions";
import { useBookingForm } from "../hooks/use-booking-form";
import { useBookingDraft } from "../hooks/use-booking-draft";
import { FloatingField } from "./floating-field";
import { TimeField } from "./time-field";
import { TextareaField } from "./textarea-field";
import { FormSection } from "./form-section";
import { ProgressIndicator } from "./progress-indicator";
import { DurationSummary } from "./duration-summary";
import { SuccessScreen } from "./success-screen";

export function BookingForm() {
  const form = useBookingForm();
  const { values, setField, setMany, blur, visibleError, reset } = form;

  const [isPending, startTransition] = React.useTransition();
  const [success, setSuccess] = React.useState<string | null>(null);

  const { clearDraft } = useBookingDraft({
    values,
    onRestore: (draft) => {
      setMany(draft);
      toast("Welcome back", {
        description: "We restored your saved booking details.",
        icon: <Save className="size-4" />,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    if (!form.validateAll()) {
      toast.error("Almost there", {
        description: "Please fix the highlighted fields and try again.",
      });
      const first = form.firstErrorField;
      if (first) {
        const el = document.getElementById(first);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus({ preventScroll: true });
      }
      return;
    }

    startTransition(async () => {
      const result = await createBooking(values);
      if (result.status === "success") {
        clearDraft();
        setSuccess(result.reference);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (result.status === "error") {
        if (result.fieldErrors) form.setServerErrors(result.fieldErrors);
        toast.error("Couldn't submit booking", {
          description: result.message,
        });
      }
    });
  };

  const handleBookAnother = () => {
    reset();
    setSuccess(null);
  };

  // Ride breakdown from the actual selected duration: included km, unlimited-km
  // fee, hourly price and the total estimate (GST shown separately, not added).
  // Declared before the early return below so hook order stays stable.
  const ride = React.useMemo(() => {
    const start = combineDateTime(values.startDate, values.startTime);
    const end = combineDateTime(values.endDate, values.endTime);
    if (!start || !end || end <= start) return null;
    const { totalHours } = getDuration(start, end);
    const unlimited = values.unlimitedKm === "true";
    const km = kmForDuration(totalHours);
    const unlimitedFee = unlimitedKmPriceForDuration(totalHours);
    const hourly = values.vehicleInterest
      ? estimateForDuration(values.vehicleInterest, totalHours, isWeekendRate(start))
      : null;
    const total = hourly != null ? hourly + (unlimited ? unlimitedFee : 0) : null;
    return { km, unlimited, unlimitedFee, hourly, total };
  }, [
    values.vehicleInterest,
    values.unlimitedKm,
    values.startDate,
    values.startTime,
    values.endDate,
    values.endTime,
  ]);

  if (success) {
    return <SuccessScreen reference={success} onBookAnother={handleBookAnother} />;
  }

  const startMin = todayISODate();
  const endMin = values.startDate || startMin;

  const slabSelected = Boolean(values.slabHours);

  // Given a start + slab (hours), the resulting end date/time fields.
  const endFromSlab = (startDate: string, startTime: string, slab: string) => {
    const start = combineDateTime(startDate, startTime);
    if (!start || !slab) return {};
    const end = new Date(start.getTime() + Number(slab) * 3_600_000);
    return { endDate: toDateInputValue(end), endTime: toTimeInputValue(end) };
  };

  // Pick a slab: default start to "now" if empty, then set end = start + slab.
  const handleSlabChange = (v: string) => {
    if (v === "custom") {
      setMany({ slabHours: "" });
      return;
    }
    const now = new Date();
    const startDate = values.startDate || toDateInputValue(now);
    const startTime = values.startTime || toTimeInputValue(now);
    setMany({
      slabHours: v,
      startDate,
      startTime,
      ...endFromSlab(startDate, startTime, v),
    });
  };

  // Edit start: keep end in sync when a slab is driving the duration.
  const updateStart = (patch: { startDate?: string; startTime?: string }) => {
    if (patch.startDate !== undefined) setField("startDate", patch.startDate);
    if (patch.startTime !== undefined) setField("startTime", patch.startTime);
    if (slabSelected) {
      const startDate = patch.startDate ?? values.startDate;
      const startTime = patch.startTime ?? values.startTime;
      setMany(endFromSlab(startDate, startTime, values.slabHours));
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* 1 — Your ride & schedule */}
        <FormSection
          step={1}
          title="Your ride"
          description="Pick your bike and when you need it — we'll show an instant estimate."
          complete={form.sections[0].complete}
        >
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="vehicleInterest"
                  className="text-sm text-muted-foreground"
                >
                  Bike (optional)
                </label>
                <Select
                  value={values.vehicleInterest || undefined}
                  onValueChange={(v) => setField("vehicleInterest", v)}
                >
                  <SelectTrigger id="vehicleInterest">
                    <SelectValue placeholder="Choose a bike (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {fleet.map((b) => (
                      <SelectItem key={b.slug} value={b.slug}>
                        {b.name} {b.model} · {b.engine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="slabHours"
                  className="text-sm text-muted-foreground"
                >
                  Duration
                </label>
                <Select
                  value={values.slabHours || "custom"}
                  onValueChange={handleSlabChange}
                >
                  <SelectTrigger id="slabHours">
                    <SelectValue placeholder="Choose duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom (set end manually)</SelectItem>
                    {SLAB_HOURS.map((h) => (
                      <SelectItem key={h} value={String(h)}>
                        {h} {h === 1 ? "Hour" : "Hours"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingField
                id="startDate"
                label="Start date"
                type="date"
                min={startMin}
                value={values.startDate}
                onValueChange={(v) => updateStart({ startDate: v })}
                onBlur={() => blur("startDate")}
                error={visibleError("startDate")}
              />
              <TimeField
                id="startTime"
                label="Start time"
                value={values.startTime}
                onValueChange={(v) => updateStart({ startTime: v })}
                onBlur={() => blur("startTime")}
                error={visibleError("startTime")}
              />
              <FloatingField
                id="endDate"
                label="End date"
                type="date"
                min={endMin}
                value={values.endDate}
                onValueChange={(v) => setField("endDate", v)}
                onBlur={() => blur("endDate")}
                error={visibleError("endDate")}
                disabled={slabSelected}
              />
              <TimeField
                id="endTime"
                label="End time"
                value={values.endTime}
                onValueChange={(v) => setField("endTime", v)}
                onBlur={() => blur("endTime")}
                error={visibleError("endTime")}
                disabled={slabSelected}
              />
            </div>

            {slabSelected && (
              <p className="-mt-1 px-1 text-xs text-muted-foreground">
                End time is set automatically from your {values.slabHours}-hour
                duration. Adjust the start time and it follows.
              </p>
            )}

            <DurationSummary values={values} />

            {/* Included km + unlimited-km unlock (shown once a duration is set) */}
            {ride && (
              <button
                type="button"
                onClick={() =>
                  setField("unlimitedKm", ride.unlimited ? "" : "true")
                }
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-4 text-left transition-colors hover:border-foreground/20"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {ride.unlimited ? "Unlimited kilometres" : "Unlock unlimited km"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {ride.unlimited
                      ? "No distance cap on this ride"
                      : `Included: ${ride.km} km · ${formatCurrency(EXTRA_KM_CHARGE)}/km beyond · go unlimited for +${formatCurrency(ride.unlimitedFee)}`}
                  </p>
                </div>
                <span
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    ride.unlimited ? "bg-brand" : "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
                      ride.unlimited ? "translate-x-[1.375rem]" : "translate-x-0.5",
                    )}
                  />
                </span>
              </button>
            )}

            {ride?.total != null && (
              <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4">
                <p className="text-xs text-muted-foreground">Estimated rental</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {formatCurrency(ride.total)}{" "}
                  <span className="text-sm font-medium text-muted-foreground">
                    (+{GST_RATE_PERCENT}% GST)
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatCurrency(ride.hourly!)} rental
                  {ride.unlimited
                    ? ` + ${formatCurrency(ride.unlimitedFee)} unlimited km`
                    : ` · ${ride.km} km included · ${formatCurrency(EXTRA_KM_CHARGE)}/km beyond`}{" "}
                  · indicative, confirmed at pickup
                </p>
              </div>
            )}
          </div>
        </FormSection>

        {/* 2 — Documents & deposit (info only) */}
        <FormSection
          step={2}
          title="Documents & deposit"
          description="What to keep ready for a smooth, quick pickup."
        >
          <div className="space-y-4">
            {/* Security deposit */}
            <div className="rounded-2xl border border-border bg-card/60 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Wallet className="size-4 text-brand" />
                Refundable security deposit
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Within Hyderabad limits</dt>
                  <dd className="font-semibold text-foreground">
                    {formatCurrency(SECURITY_DEPOSIT.withinHyd)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Outside Hyderabad</dt>
                  <dd className="font-semibold text-foreground">
                    {formatCurrency(SECURITY_DEPOSIT.outsideHyd)}
                  </dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-muted-foreground">
                Fully refunded after the bike is returned in good condition.
              </p>
            </div>

            {/* Documents required */}
            <div className="rounded-2xl border border-border bg-card/60 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileCheck className="size-4 text-brand" />
                Documents to carry
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  Valid Driving Licence
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  Aadhaar card (masked — only the last 4 digits visible)
                </li>
              </ul>
              <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                <Smartphone className="mt-0.5 size-3.5 shrink-0 text-brand" />
                <span>
                  Physical copies or government-verified apps — DigiLocker,
                  mAadhaar or m-wallet — are all accepted.
                </span>
              </p>
            </div>
          </div>
        </FormSection>

        {/* 3 — Personal details */}
        <FormSection
          step={3}
          title="Personal details"
          description="Tell us who's riding."
          complete={form.sections[1].complete}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FloatingField
              id="fullName"
              label="Full name"
              value={values.fullName}
              onValueChange={(v) => setField("fullName", v)}
              onBlur={() => blur("fullName")}
              error={visibleError("fullName")}
              autoComplete="name"
              maxLength={BOOKING_RULES.limits.name}
              showCounter
              className="sm:col-span-2"
            />
            <FloatingField
              id="phone"
              label="Phone number"
              type="tel"
              prefix="+91"
              value={values.phone}
              onValueChange={(v) => setField("phone", v)}
              onBlur={() => blur("phone")}
              error={visibleError("phone")}
              format={formatIndianPhone}
              inputMode="tel"
              autoComplete="tel-national"
              maxLength={11}
            />
            <FloatingField
              id="email"
              label="Email"
              type="email"
              value={values.email}
              onValueChange={(v) => setField("email", v)}
              onBlur={() => blur("email")}
              error={visibleError("email")}
              inputMode="email"
              autoComplete="email"
            />
            <FloatingField
              id="address"
              label="Address"
              value={values.address}
              onValueChange={(v) => setField("address", v)}
              onBlur={() => blur("address")}
              error={visibleError("address")}
              autoComplete="street-address"
              maxLength={BOOKING_RULES.limits.address}
              showCounter
              className="sm:col-span-2"
            />
          </div>
        </FormSection>

        {/* 4 — Emergency contact */}
        <FormSection
          step={4}
          title="Emergency contact"
          description="Someone we can reach in case of an emergency."
          complete={form.sections[2].complete}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FloatingField
              id="emergencyName"
              label="Contact name"
              value={values.emergencyName}
              onValueChange={(v) => setField("emergencyName", v)}
              onBlur={() => blur("emergencyName")}
              error={visibleError("emergencyName")}
              autoComplete="name"
              maxLength={BOOKING_RULES.limits.emergencyName}
            />
            <FloatingField
              id="emergencyPhone"
              label="Contact phone"
              type="tel"
              prefix="+91"
              value={values.emergencyPhone}
              onValueChange={(v) => setField("emergencyPhone", v)}
              onBlur={() => blur("emergencyPhone")}
              error={visibleError("emergencyPhone")}
              format={formatIndianPhone}
              inputMode="tel"
              maxLength={11}
            />
          </div>
        </FormSection>

        {/* 5 — Additional notes */}
        <FormSection
          step={5}
          title="Additional notes"
          description="Optional — anything that helps us prepare your ride."
        >
          <TextareaField
            id="notes"
            label="Notes (optional)"
            value={values.notes}
            onValueChange={(v) => setField("notes", v)}
            onBlur={() => blur("notes")}
            error={visibleError("notes")}
            hint="e.g. Need a helmet, prefer the TVS Ntorq, please deliver to my address."
            maxLength={BOOKING_RULES.limits.notes}
            rows={4}
          />
        </FormSection>

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-brand" />
            Your details are private and used only to manage your booking.
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Request booking
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Sidebar */}
      <aside className="space-y-4 lg:sticky lg:top-24">
        <ProgressIndicator sections={form.sections} progress={form.progress} />

        <AnimatePresence>
          {form.progress > 0 && form.progress < 100 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground"
            >
              <Save className="size-3.5" />
              Draft saved automatically on this device.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="rounded-2xl border border-border bg-card/60 p-4 text-sm">
          <p className="flex items-center gap-1.5 font-medium text-foreground">
            <Gift className="size-4 text-brand" />
            Complimentary with every ride
          </p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            {[
              "Freshly sanitised helmet",
              "Hygiene kit — face mask, hair cap & wet wipes",
              "Rain coat for sudden showers",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            All on us — no add-on charges.
          </p>
        </div>
      </aside>
    </div>
  );
}
