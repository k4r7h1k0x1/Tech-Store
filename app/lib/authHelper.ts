import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface AuthPayload {
  userId: string;
}

export function signToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not defined");
  return jwt.sign({ userId: userId.toString() }, secret, { expiresIn: "30d" });
}

export async function getAuthUser(): Promise<AuthPayload | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not defined");
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, secret) as AuthPayload;
    return decoded;
  } catch {
    return null;
  }
}