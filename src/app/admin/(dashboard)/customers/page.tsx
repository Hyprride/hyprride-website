import { Suspense } from "react";

import { Card } from "@/components/ui/card";
import {
  getCustomers,
  parseCustomersParams,
} from "@/features/dashboard/customers-queries";
import { CustomersFilters } from "@/features/dashboard/components/customers/customers-filters";
import { CustomersTable } from "@/features/dashboard/components/customers/customers-table";
import { DataPagination } from "@/features/dashboard/components/data-pagination";
import { BookingsTableSkeleton } from "@/features/dashboard/components/bookings/table-skeleton";

export const metadata = { title: "Customers" };
export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolved = await searchParams;
  const params = parseCustomersParams(resolved);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Customers
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Profiles, booking history and lifetime value.
        </p>
      </div>

      <CustomersFilters />

      <Suspense key={JSON.stringify(params)} fallback={<BookingsTableSkeleton />}>
        <CustomersTableSection params={params} />
      </Suspense>
    </div>
  );
}

async function CustomersTableSection({
  params,
}: {
  params: ReturnType<typeof parseCustomersParams>;
}) {
  const result = await getCustomers(params);

  return (
    <Card className="overflow-hidden p-0">
      <CustomersTable rows={result.rows} />
      <DataPagination
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        pageSize={result.pageSize}
        label="customers"
      />
    </Card>
  );
}
