import { Suspense } from "react";

import { StatsSection } from "@/features/dashboard/components/overview/stats-section";
import { ChartsSection } from "@/features/dashboard/components/overview/charts-section";
import { RecentSection } from "@/features/dashboard/components/overview/recent-section";
import {
  StatsSkeleton,
  ChartsSkeleton,
  RecentSkeleton,
} from "@/features/dashboard/components/overview/skeletons";

export const metadata = { title: "Overview" };

// Always reflect the latest leads.
export const dynamic = "force-dynamic";

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with HYPRRIDE today.
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<ChartsSkeleton />}>
        <ChartsSection />
      </Suspense>

      <Suspense fallback={<RecentSkeleton />}>
        <RecentSection />
      </Suspense>
    </div>
  );
}
