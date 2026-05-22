import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/app/lib/authHelper";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email." },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 },
      );
    }

    const token = signToken(user._id);
    const response = NextResponse.json({
      success: true,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
