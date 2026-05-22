export async function getUserOrders() {
  const res  = await fetch("/api/orders/get");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
  return data.orders;
}
