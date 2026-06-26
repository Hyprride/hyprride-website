"use client";

import * as React from "react";
import {
  Activity,
  Calendar,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  StickyNote,
  User,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/dashboard/components/status-badge";
import { loadBookingDetail } from "@/features/dashboard/bookings-actions";
import { useBookingMutations } from "./use-booking-mutations";
import { BOOKING_STATUSES } from "@/lib/constants/booking";
import { formatDateTime, formatRelative, getDuration } from "@/lib/utils/datetime";
import { formatPhoneWithCode } from "@/lib/utils/format";
import type { BookingDetail } from "@/types/booking";

export function BookingDetailDrawer({
  bookingId,
  open,
  onOpenChange,
}: {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [detail, setDetail] = React.useState<BookingDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { changeStatus, pending } = useBookingMutations();

  const load = React.useCallback(async () => {
    setLoading(true);
    const data = await loadBookingDetail(bookingId);
    setDetail(data);
    setLoading(false);
  }, [bookingId]);

  React.useEffect(() => {
    if (open) load();
  }, [open, load]);

  const customer = detail?.customer ?? null;
  const duration =
    detail &&
    getDuration(
      new Date(detail.start_datetime),
      new Date(detail.end_datetime),
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent side="right" className="p-0">
        <DialogHeader className="border-b border-border p-6">
          <div className="flex items-center gap-3">
            <DialogTitle className="font-mono">
              {detail?.reference ?? "Booking"}
            </DialogTitle>
            {detail && <StatusBadge status={detail.status} />}
          </div>
          <DialogDescription>
            {detail
              ? `Created ${formatRelative(detail.created_at)}`
              : "Loading booking details…"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {loading || !detail ? (
            <DrawerSkeleton />
          ) : (
            <>
              {/* Customer */}
              <Section icon={<User className="size-4" />} title="Customer">
                <Field label="Name" value={customer?.name ?? "—"} />
                <Field
                  icon={<Mail className="size-3.5" />}
                  label="Email"
                  value={customer?.email ?? "—"}
                />
                <Field
                  icon={<Phone className="size-3.5" />}
                  label="Phone"
                  value={
                    customer ? formatPhoneWithCode(customer.phone) : "—"
                  }
                />
                <Field
                  icon={<MapPin className="size-3.5" />}
                  label="Address"
                  value={customer?.address ?? "—"}
                />
              </Section>

              {/* Emergency */}
              {customer?.emergency_contacts?.length ? (
                <Section
                  icon={<ShieldAlert className="size-4" />}
                  title="Emergency contact"
                >
                  {customer.emergency_contacts.map((c) => (
                    <div key={c.id}>
                      <Field label="Name" value={c.contact_name} />
                      <Field
                        icon={<Phone className="size-3.5" />}
                        label="Phone"
                        value={formatPhoneWithCode(c.contact_phone)}
                      />
                    </div>
                  ))}
                </Section>
              ) : null}

              {/* Schedule */}
              <Section icon={<Calendar className="size-4" />} title="Schedule">
                <Field label="Start" value={formatDateTime(detail.start_datetime)} />
                <Field label="End" value={formatDateTime(detail.end_datetime)} />
                <Field
                  label="Duration"
                  value={`${duration?.label} · ${duration?.totalHours} hrs`}
                />
              </Section>

              {/* Notes */}
              {detail.special_notes && (
                <Section
                  icon={<StickyNote className="size-4" />}
                  title="Notes"
                >
                  <p className="text-sm text-foreground">
                    {detail.special_notes}
                  </p>
                </Section>
              )}

              {/* Status actions */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Update status
                </p>
                <div className="flex flex-wrap gap-2">
                  {BOOKING_STATUSES.filter((s) => s !== detail.status).map(
                    (s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() => changeStatus(detail.id, s, load)}
                      >
                        {s}
                      </Button>
                    ),
                  )}
                </div>
              </div>

              {/* Activity */}
              <Section icon={<Activity className="size-4" />} title="Activity">
                <ol className="space-y-3">
                  {detail.activity_logs.map((log) => (
                    <li key={log.id} className="flex gap-3 text-sm">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                      <div>
                        <p className="text-foreground">
                          {describeLog(log.action, log.metadata)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.actor} · {formatRelative(log.created_at)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function describeLog(action: string, metadata: unknown): string {
  const m = (metadata ?? {}) as Record<string, unknown>;
  if (action === "created") return "Booking request created";
  if (action === "status_changed")
    return `Status changed ${String(m.from ?? "")} → ${String(m.to ?? "")}`;
  return action.replace(/_/g, " ");
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-brand">{icon}</span>
        {title}
      </div>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="max-w-[60%] text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
