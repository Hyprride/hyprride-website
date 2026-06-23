import { Suspense } from "react";

import { Card } from "@/components/ui/card";
import {
  getBookings,
  parseBookingsParams,
} from "@/features/dashboard/bookings-queries";
import { BookingsFilters } from "@/features/dashboard/components/bookings/bookings-filters";
import { BookingsTable } from "@/features/dashboard/components/bookings/bookings-table";
import { DataPagination } from "@/features/dashboard/components/data-pagination";
import { BookingsTableSkeleton } from "@/features/dashboard/components/bookings/table-skeleton";

export const metadata = { title: "Bookings" };
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const params = parseBookingsParams(resolved);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Bookings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review, confirm and manage every rental request.
        </p>
      </div>

      <BookingsFilters />

      <Suspense
        key={JSON.stringify(params)}
        fallback={<BookingsTableSkeleton />}
      >
        <BookingsTableSection params={params} />
      </Suspense>
    </div>
  );
}

async function BookingsTableSection({
  params,
}: {
  params: ReturnType<typeof parseBookingsParams>;
}) {
  const result = await getBookings(params);

  return (
    <Card className="overflow-hidden p-0">
      <BookingsTable rows={result.rows} />
      <DataPagination
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        pageSize={result.pageSize}
        label="bookings"
      />
    </Card>
  );
}
