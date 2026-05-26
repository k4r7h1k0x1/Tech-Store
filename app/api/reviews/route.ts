import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { getAuthUser } from "@/app/lib/authHelper";
import User from "@/models/User";
import { Model } from "mongoose";


const ReviewModel = Review as Model<any>;
const ProductModel = Product as Model<any>;
const UserModel = User as Model<any>;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }
    await dbConnect();
    const reviews = await ReviewModel.find({ productId }).sort({ createdAt: -1 }).lean();

    const numReviews = reviews.length;
    const rating =
      numReviews > 0
        ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / numReviews
        : 0;

    return NextResponse.json({
      reviews: reviews.map((r: any) => ({
        _id:       r._id.toString(),
        userId:    r.userId,
        userName:  r.userName,
        rating:    r.rating,
        comment:   r.comment,
        createdAt: r.createdAt,
      })),
      rating:     Math.round(rating * 10) / 10,
      numReviews,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();
    if (!productId || !rating) {
      return NextResponse.json({ error: "productId and rating required" }, { status: 400 });
    }

    await dbConnect();

    const user = await UserModel.findById(auth.userId).select("name").lean() as any;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await ReviewModel.findOne({ productId, userId: auth.userId });
    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 });
    }

    const review = await ReviewModel.create({
      productId,
      userId:   auth.userId,
      userName: user.name,
      rating,
      comment:  comment || "",
    });

    const allReviews = await ReviewModel.find({ productId }).lean() as any[];
    const numReviews = allReviews.length;
    const avgRating  = allReviews.reduce((s, r) => s + r.rating, 0) / numReviews;

    await ProductModel.findByIdAndUpdate(productId, {
      rating:  Math.round(avgRating * 10) / 10,
      reviews: numReviews,
    });

    return NextResponse.json({
      review: {
        _id:       review._id.toString(),
        userId:    review.userId,
        userName:  review.userName,
        rating:    review.rating,
        comment:   review.comment,
        createdAt: review.createdAt,
      },
      rating:     Math.round(avgRating * 10) / 10,
      numReviews,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    await dbConnect();
    await ReviewModel.findOneAndDelete({ productId, userId: auth.userId });
    const remaining = await ReviewModel.find({ productId }).lean() as any[];
    const numReviews = remaining.length;
    const avgRating  =
      numReviews > 0
        ? remaining.reduce((s, r) => s + r.rating, 0) / numReviews
        : 0;

    await ProductModel.findByIdAndUpdate(productId, {
      rating:  Math.round(avgRating * 10) / 10,
      reviews: numReviews,
    });

    return NextResponse.json({ success: true, rating: avgRating, numReviews });
  } catch {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}