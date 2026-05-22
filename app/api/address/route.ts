import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/app/lib/authHelper";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const user = await User.findById(auth.userId).select("addresses");
    return NextResponse.json({ addresses: user?.addresses || [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const address = await req.json();
    await dbConnect();
    const user = await User.findById(auth.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.addresses) user.addresses = [];
    if (user.addresses.length === 0) address.isDefault = true;
    if (address.isDefault === true) {
      user.addresses.forEach((addr: any) => { addr.isDefault = false; });
    }

    user.addresses.push(address);
    await user.save();
    return NextResponse.json({ success: true, addresses: user.addresses });
  } catch (err: any) {
    console.error("POST ADDRESS ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { addressId, ...updates } = await req.json();
    await dbConnect();
    const user = await User.findById(auth.userId);
    const address = user.addresses.id(addressId);
    if (!address) return NextResponse.json({ error: "Address not found" }, { status: 404 });

    if (updates.isDefault) {
      user.addresses.forEach((addr: any) => { addr.isDefault = false; });
    }
    Object.assign(address, updates);
    await user.save();
    return NextResponse.json({ success: true, addresses: user.addresses });
  } catch {
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("id");
    await dbConnect();
    const user = await User.findById(auth.userId);
    user.addresses.pull(addressId);
    await user.save();
    return NextResponse.json({ success: true, addresses: user.addresses });
  } catch {
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}