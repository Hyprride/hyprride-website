"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { BOOKING_STATUS_HEX } from "@/lib/constants/booking";
import type { StatusSlice } from "../../queries";

export function StatusDonutChart({ data }: { data: StatusSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const slices = data.filter((d) => d.count > 0);

  if (total === 0) {
    return (
      <div className="grid h-[220px] place-items-center text-sm text-muted-foreground">
        No bookings yet
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="count"
              nameKey="status"
              innerRadius={56}
              outerRadius={84}
              paddingAngle={2}
              stroke="none"
            >
              {slices.map((slice) => (
                <Cell
                  key={slice.status}
                  fill={BOOKING_STATUS_HEX[slice.status]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                fontSize: 12,
              }}
              formatter={(value: number, name) => [`${value}`, name as string]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="text-2xl font-semibold text-foreground">{total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-2 sm:grid-cols-1">
        {data.map((slice) => (
          <li
            key={slice.status}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className="size-2.5 rounded-full"
              style={{ background: BOOKING_STATUS_HEX[slice.status] }}
            />
            <span className="flex-1 text-muted-foreground">{slice.status}</span>
            <span className="font-medium tabular-nums text-foreground">
              {slice.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
