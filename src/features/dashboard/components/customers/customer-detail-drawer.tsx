"use client";

import * as React from "react";
import { Mail, MapPin, Phone, ShieldAlert } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/features/dashboard/components/status-badge";
import { loadCustomerDetail } from "@/features/dashboard/customers-actions";
import {
  formatDateShort,
  formatRelative,
} from "@/lib/utils/datetime";
import { formatCurrency, formatPhoneWithCode, getInitials } from "@/lib/utils/format";
import type { CustomerDetail } from "@/features/dashboard/customers-queries";

export function CustomerDetailDrawer({
  customerId,
  open,
  onOpenChange,
}: {
  customerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [detail, setDetail] = React.useState<CustomerDetail | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open || !customerId) return;
    let active = true;
    setLoading(true);
    setDetail(null);
    loadCustomerDetail(customerId).then((data) => {
      if (active) {
        setDetail(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [open, customerId]);

  const c = detail?.customer;
  const stats = detail?.stats;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent side="right" className="p-0">
        <DialogHeader className="border-b border-border p-6">
          <div className="flex items-center gap-3">
            <Avatar className="size-11">
              <AvatarFallback>{getInitials(c?.name ?? "?")}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>{c?.name ?? "Customer"}</DialogTitle>
              <DialogDescription>
                {c ? `Member since ${formatDateShort(c.created_at)}` : "Loading…"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {loading || !detail || !c || !stats ? (
            <DrawerSkeleton />
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Rentals" value={String(stats.totalRentals)} />
                <Stat label="Completed" value={String(stats.completedRentals)} />
                <Stat
                  label="Lifetime value"
                  value={formatCurrency(stats.lifetimeValue)}
                />
              </div>

              {/* Contact */}
              <section className="space-y-2.5">
                <ContactRow
                  icon={<Mail className="size-4" />}
                  value={c.email ?? "—"}
                />
                <ContactRow
                  icon={<Phone className="size-4" />}
                  value={formatPhoneWithCode(c.phone)}
                />
                <ContactRow
                  icon={<MapPin className="size-4" />}
                  value={c.address}
                />
              </section>

              {/* Emergency contacts */}
              {detail.emergencyContacts.length > 0 && (
                <section>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ShieldAlert className="size-4 text-brand" />
                    Emergency contacts
                  </h3>
                  <div className="space-y-2">
                    {detail.emergencyContacts.map((ec) => (
                      <div
                        key={ec.id}
                        className="flex items-center justify-between rounded-xl border border-border px-3.5 py-2.5 text-sm"
                      >
                        <span className="font-medium text-foreground">
                          {ec.contact_name}
                        </span>
                        <span className="text-muted-foreground">
                          {formatPhoneWithCode(ec.contact_phone)}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Booking history */}
              <section>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Booking history
                </h3>
                {detail.bookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No bookings yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {detail.bookings.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-medium text-foreground">
                            {b.reference}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateShort(b.start_datetime)} ·{" "}
                            {formatRelative(b.created_at)}
                          </p>
                        </div>
                        <StatusBadge status={b.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3 text-center">
      <p className="truncate text-lg font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ContactRow({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 text-brand">{icon}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}
