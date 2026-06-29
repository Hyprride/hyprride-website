import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/features/auth/queries";
import { getCustomersForExport } from "@/features/dashboard/customers-queries";

/** Escapes a value for CSV (quotes wrap + double-quote escaping). */
function csvCell(value: string | number | null | undefined): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const rows = await getCustomersForExport(search);

  const header = [
    "Name",
    "Email",
    "Phone",
    "Address",
    "Total bookings",
    "Joined",
  ];
  const lines = [
    header.join(","),
    ...rows.map((r) =>
      [
        csvCell(r.name),
        csvCell(r.email),
        csvCell(`+91 ${r.phone}`),
        csvCell(r.address),
        csvCell(r.bookingCount),
        csvCell(new Date(r.created_at).toISOString().slice(0, 10)),
      ].join(","),
    ),
  ];

  const csv = "﻿" + lines.join("\r\n"); // BOM for Excel
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hyprride-customers-${date}.csv"`,
    },
  });
}
