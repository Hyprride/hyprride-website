"use client";

import * as React from "react";
import { UsersRound } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/utils/datetime";
import { formatPhoneWithCode, getInitials } from "@/lib/utils/format";
import type { CustomerListRow } from "@/features/dashboard/customers-queries";
import { CustomerDetailDrawer } from "./customer-detail-drawer";

export function CustomersTable({ rows }: { rows: CustomerListRow[] }) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  const view = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  if (rows.length === 0) {
    return (
      <div className="grid place-items-center gap-3 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <UsersRound className="size-6" />
        </span>
        <div>
          <p className="font-medium text-foreground">No customers found</p>
          <p className="text-sm text-muted-foreground">
            New customers appear here after their first booking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((c) => (
            <TableRow
              key={c.id}
              onClick={() => view(c.id)}
              className="cursor-pointer"
            >
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-[11px]">
                      {getInitials(c.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {c.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatPhoneWithCode(c.phone)}
              </TableCell>
              <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">
                {c.address}
              </TableCell>
              <TableCell>
                <Badge variant="brand">{c.bookingCount}</Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {formatRelative(c.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomerDetailDrawer
        customerId={selectedId}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
