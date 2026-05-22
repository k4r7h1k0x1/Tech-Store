import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongodb";
import Order from "@/models/Order";
import { getAuthUser } from "@/app/lib/authHelper";

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "You must be logged in to checkout." }, { status: 401 });
    }

    const { items, shippingAddress, paymentMethod } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }
    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required." }, { status: 400 });
    }

    await dbConnect();

    const subtotal     = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const tax          = subtotal * 0.18;
    const shippingCost = subtotal > 1000 ? 0 : 50;
    const total        = subtotal + tax + shippingCost;

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId(auth.userId),
      items:  items.map((item: any) => ({
        productId: item.id,
        name:      item.name,
        price:     item.price,
        quantity:  item.quantity,
        image:     item.image,
        category:  item.category || "",
      })),
      subtotal,
      tax,
      shippingCost,
      total,
      shippingAddress,
      paymentMethod:  paymentMethod || "cod",
      paymentStatus:  paymentMethod === "cod" ? "pending" : "paid",
      status:         "confirmed",
      estimatedDelivery,
      trackingNumber: `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`,
    });

    return NextResponse.json({
      success: true,
      order: {
        id:               order._id.toString(),
        items:            order.items,
        total:            order.total,
        subtotal:         order.subtotal,
        tax:              order.tax,
        shippingCost:     order.shippingCost,
        status:           order.status,
        trackingNumber:   order.trackingNumber,
        estimatedDelivery:order.estimatedDelivery,
        createdAt:        order.createdAt,
      },
    });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({
      error:   "Failed to process order. Please try again.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    }, { status: 500 });
  }
}