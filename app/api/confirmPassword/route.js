import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { email, password } = await req.json();

    // Tìm kiếm người dùng dựa trên email
    const user = await User.findOne({ email }).select("_id password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // So sánh mật khẩu
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Trả về thông tin người dùng
    return NextResponse.json({ user: { _id: user._id } });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
