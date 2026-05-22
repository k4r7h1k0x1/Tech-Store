import { redirect } from "next/navigation";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import { getAuthUser } from "@/app/lib/authHelper";
import OrdersClient from "@/app/OrdersClient";
import Link from "next/link";

async function getOrders(userId: string) {
  try {
    await dbConnect();
    const orders = await Order.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(
      JSON.stringify(
        (orders as any[]).map((o) => ({
          id:                o._id.toString(),
          userId:            o.userId.toString(),
          items:             o.items || [],
          total:             o.total || 0,
          subtotal:          o.subtotal || 0,
          tax:               o.tax || 0,
          shippingCost:      o.shippingCost || 0,
          status:            o.status || "pending",
          paymentMethod:     o.paymentMethod || "cod",
          paymentStatus:     o.paymentStatus || "pending",
          trackingNumber:    o.trackingNumber || "",
          estimatedDelivery: o.estimatedDelivery
            ? new Date(o.estimatedDelivery).toISOString()
            : null,
          shippingAddress: o.shippingAddress || null,
          createdAt:       new Date(o.createdAt).toISOString(),
          updatedAt:       new Date(o.updatedAt).toISOString(),
        }))
      )
    );
  } catch (err) {
    console.error("Error fetching orders:", err);
    return [];
  }
}

export default async function OrdersPage() {
  const auth = await getAuthUser();

  if (!auth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your orders</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home &amp; Login
          </Link>
        </div>
      </div>
    );
  }

  await dbConnect();
  const user = await (User.findById(auth.userId) as any).select("name").lean();
  const userName = (user as any)?.name ?? "User";
  const orders = await getOrders(auth.userId);

  return <OrdersClient initialOrders={orders} userName={userName} />;
}