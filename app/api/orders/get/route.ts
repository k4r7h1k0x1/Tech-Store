import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongodb";
import Order from "@/models/Order";
import { getAuthUser } from "@/app/lib/authHelper";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find({
      userId: new mongoose.Types.ObjectId(auth.userId),
    })
      .sort({ createdAt: -1 })
      .lean();

    const serialized = orders.map((o: any) => ({
      id:               o._id.toString(),
      items:            o.items || [],
      total:            o.total || 0,
      subtotal:         o.subtotal || 0,
      tax:              o.tax || 0,
      shippingCost:     o.shippingCost || 0,
      status:           o.status || "pending",
      paymentMethod:    o.paymentMethod || "cod",
      trackingNumber:   o.trackingNumber || "",
      estimatedDelivery:o.estimatedDelivery
        ? new Date(o.estimatedDelivery).toISOString()
        : null,
      shippingAddress:  o.shippingAddress || null,
      createdAt:        new Date(o.createdAt).toISOString(),
    }));

    return NextResponse.json({ orders: serialized });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}