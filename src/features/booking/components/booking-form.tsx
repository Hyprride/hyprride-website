"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ShieldCheck, Sparkles, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { BOOKING_RULES } from "@/lib/constants/booking";
import { todayISODate } from "@/lib/utils/datetime";
import { formatIndianPhone } from "@/lib/utils/format";
import { createBooking } from "../actions";
import { useBookingForm } from "../hooks/use-booking-form";
import { useBookingDraft } from "../hooks/use-booking-draft";
import { FloatingField } from "./floating-field";
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

  if (success) {
    return <SuccessScreen reference={success} onBookAnother={handleBookAnother} />;
  }

  const startMin = todayISODate();
  const endMin = values.startDate || startMin;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* 1 — Personal details */}
        <FormSection
          step={1}
          title="Personal details"
          description="Tell us who's riding."
          complete={form.sections[0].complete}
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

        {/* 2 — Emergency contact */}
        <FormSection
          step={2}
          title="Emergency contact"
          description="Someone we can reach in case of an emergency."
          complete={form.sections[1].complete}
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

        {/* 3 — Additional notes */}
        <FormSection
          step={3}
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

        {/* 4 — Booking duration */}
        <FormSection
          step={4}
          title="Booking duration"
          description="When do you need the bike?"
          complete={form.sections[2].complete}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FloatingField
              id="startDate"
              label="Start date"
              type="date"
              min={startMin}
              value={values.startDate}
              onValueChange={(v) => setField("startDate", v)}
              onBlur={() => blur("startDate")}
              error={visibleError("startDate")}
            />
            <FloatingField
              id="startTime"
              label="Start time"
              type="time"
              value={values.startTime}
              onValueChange={(v) => setField("startTime", v)}
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
            />
            <FloatingField
              id="endTime"
              label="End time"
              type="time"
              value={values.endTime}
              onValueChange={(v) => setField("endTime", v)}
              onBlur={() => blur("endTime")}
              error={visibleError("endTime")}
            />
          </div>
          <DurationSummary values={values} />
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
          <p className="font-medium text-foreground">Why riders choose us</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            {[
              "Sanitised helmet included",
              "Transparent, no-surprise pricing",
              "Serviced, ready-to-ride bikes",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
