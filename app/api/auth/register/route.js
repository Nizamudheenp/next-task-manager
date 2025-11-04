import bcrypt from "bcryptjs";
import User from "@/models/User";
import { generateToken } from "@/utils/jwt";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json({ message: "User already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = generateToken(user._id);
    return NextResponse.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
