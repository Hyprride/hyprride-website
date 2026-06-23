"use server";

import { getCurrentUser } from "@/features/auth/queries";
import { getCustomerDetail, type CustomerDetail } from "./customers-queries";

/** Client-callable loader for the customer detail drawer. */
export async function loadCustomerDetail(
  id: string,
): Promise<CustomerDetail | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return getCustomerDetail(id);
}
