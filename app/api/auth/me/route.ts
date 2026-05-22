import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/app/lib/authHelper";

export async function GET() {
    try {
        const auth = await getAuthUser();
        if (!auth) {
            return NextResponse.json({ user: null }, { status: 200 });
        }
        await dbConnect();
        const user = await User.findById(auth.userId).select("-password");
        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });

        }

        return NextResponse.json({
            user: { id: user._id.toString(), name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("/api/auth/me error:", err);
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
