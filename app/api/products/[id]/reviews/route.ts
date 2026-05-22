import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import mongoose, { Model } from "mongoose";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { getAuthUser } from "@/app/lib/authHelper";
import User from "@/models/User";

const ReviewModel = Review as Model<any>;
const ProductModel = Product as Model<any>;
const UserModel = User as Model<any>;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const reviews = await ReviewModel.find({ productId: id })
      .sort({ createdAt: -1 })
      .lean<any[]>();

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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { rating, comment } = await req.json();

    if (!rating) {
      return NextResponse.json({ error: "Rating required" }, { status: 400 });
    }

    await dbConnect();

    const user = await UserModel.findById(auth.userId).select("name").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existing = await ReviewModel.findOne({
      productId: id,
      userId: auth.userId,
    }).lean();

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this product." },
        { status: 409 }
      );
    }

    const review = await ReviewModel.create({
      productId: id,
      userId:    auth.userId,
      userName:  (user as any).name,
      rating,
      comment:   comment || "",
    });

    const all = await ReviewModel.find({ productId: id }).lean<any[]>();
    const numReviews = all.length;
    const avg = all.reduce((s: number, r: any) => s + r.rating, 0) / numReviews;

    await ProductModel.findByIdAndUpdate(id, {
      rating:  Math.round(avg * 10) / 10,
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
      rating:     Math.round(avg * 10) / 10,
      numReviews,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "You have already reviewed this product." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    await ReviewModel.findOneAndDelete({
      productId: id,
      userId:    auth.userId,
    });

    const remaining = await ReviewModel.find({ productId: id }).lean<any[]>();
    const numReviews = remaining.length;
    const avg =
      numReviews > 0
        ? remaining.reduce((s: number, r: any) => s + r.rating, 0) / numReviews
        : 0;

    await ProductModel.findByIdAndUpdate(id, {
      rating:  Math.round(avg * 10) / 10,
      reviews: numReviews,
    });

    return NextResponse.json({ success: true, rating: avg, numReviews });
  } catch {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}