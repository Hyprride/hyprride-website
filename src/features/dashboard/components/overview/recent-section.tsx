import Link from "next/link";
import { ArrowRight, Activity } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatRelative } from "@/lib/utils/datetime";
import { getInitials } from "@/lib/utils/format";
import {
  getRecentActivity,
  getRecentCustomers,
  type RecentActivity,
} from "../../queries";

function describeActivity(item: RecentActivity): string {
  if (item.action === "created") return "New booking request";
  if (item.action === "status_changed") {
    const from = String(item.metadata?.from ?? "");
    const to = String(item.metadata?.to ?? "");
    return `Status changed ${from} → ${to}`;
  }
  return item.action.replace(/_/g, " ");
}

export async function RecentSection() {
  const [customers, activity] = await Promise.all([
    getRecentCustomers(5),
    getRecentActivity(6),
  ]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Recent customers</CardTitle>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No customers yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {customers.map((c) => (
                <li key={c.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(c.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {c.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.email}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelative(c.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No activity yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {activity.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                    <Activity className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {describeActivity(item)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.reference ? `${item.reference} · ` : ""}
                      {formatRelative(item.created_at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
