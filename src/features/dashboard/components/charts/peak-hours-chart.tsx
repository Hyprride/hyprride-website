"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BRAND_HEX } from "@/lib/constants/booking";
import type { PeakHour } from "../../analytics-queries";

export function PeakHoursChart({ data }: { data: PeakHour[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10, fill: "currentColor" }}
          className="text-muted-foreground"
          interval={2}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          width={32}
          tick={{ fontSize: 11, fill: "currentColor" }}
          className="text-muted-foreground"
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
            fontSize: 12,
          }}
          formatter={(value: number) => [`${value}`, "Bookings"]}
          labelFormatter={(label) => `Start time ${label}`}
        />
        <Bar dataKey="count" fill={BRAND_HEX} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
