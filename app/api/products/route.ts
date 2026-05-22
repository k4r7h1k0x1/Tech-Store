import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Product from "@/models/Product";
import { getAuthUser } from "@/app/lib/authHelper";
import User from "@/models/User";

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    const serialized = products.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      categoryId: p.categoryId,
      price: p.price,
      originalPrice: p.originalPrice ?? null,
      description: p.description ?? "",
      image: p.image,
      badge: p.badge ?? "",
      badgeColor: p.badgeColor ?? "",
      inStock: p.inStock,
      rating: p.rating,
      reviews: p.reviews,
      sellerId: p.sellerId ?? "",
      sellerName: p.sellerName ?? "TechStore",
      createdAt: new Date(p.createdAt).toISOString(),
    }));

    return NextResponse.json({ products: serialized });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json(
        { error: "You must be logged in to list a product." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const {
      name,
      category,
      categoryId,
      price,
      originalPrice,
      description,
      image,
      badge,
      badgeColor,
      inStock,
    } = body;

    if (!name || !category || !categoryId || !price || !image) {
      return NextResponse.json(
        { error: "Name, category, price, and image are required." },
        { status: 400 },
      );
    }
    if (Number(price) <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0." },
        { status: 400 },
        
      );
    }

    if (!image.startsWith("http") && !image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Image must be a valid URL or uploaded image." },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await (User.findById(auth.userId) as any)
      .select("name")
      .lean();
    const sellerName = (user as any)?.name ?? "Unknown Seller";

    const product = await Product.create({
      name: stripHtml(name.trim()),
      category: stripHtml(category.trim()).toUpperCase(),
      categoryId: stripHtml(categoryId.trim()).toLowerCase(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description: stripHtml(description?.trim() ?? ""),
      image: image.trim(),
      badge: stripHtml(badge?.trim() ?? ""),
      badgeColor: badgeColor ?? "",
      inStock: inStock ?? true,
      rating: 0,
      reviews: 0,
      sellerId: auth.userId,
      sellerName,
    });

    return NextResponse.json({
      success: true,
      product: {
        id: product._id.toString(),
        name: product.name,
        category: product.category,
        categoryId: product.categoryId,
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        description: product.description,
        image: product.image,
        badge: product.badge,
        badgeColor: product.badgeColor,
        inStock: product.inStock,
        rating: product.rating,
        reviews: product.reviews,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
      },
    });
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { error: "Failed to list product. Please try again." },
      { status: 500 },
    );
  }
}
