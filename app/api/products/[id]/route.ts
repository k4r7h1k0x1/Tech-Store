import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Product from "@/models/Product";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const p = product as any;
    return NextResponse.json({
      product: {
        id:            p._id.toString(),
        name:          p.name,
        category:      p.category,
        categoryId:    p.categoryId,
        price:         p.price,
        originalPrice: p.originalPrice ?? null,
        description:   p.description ?? "",
        image:         p.image,
        badge:         p.badge ?? "",
        badgeColor:    p.badgeColor ?? "",
        inStock:       p.inStock,
        rating:        p.rating,
        reviews:       p.reviews,
        sellerId:      p.sellerId ?? "",
        sellerName:    p.sellerName ?? "TechStore",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}