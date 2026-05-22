import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/app/lib/authHelper";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById(auth.userId).select("wishlist");
    return NextResponse.json({ wishlist: user?.wishlist || [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    await dbConnect();
    const user = await User.findById(auth.userId);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    return NextResponse.json({ success: true, wishlist: user.wishlist });
  } catch {
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    await dbConnect();
    const user = await User.findById(auth.userId);
    user.wishlist = user.wishlist.filter((id: any) => String(id) !== productId);
    await user.save();
    return NextResponse.json({ success: true, wishlist: user.wishlist });
  } catch {
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}