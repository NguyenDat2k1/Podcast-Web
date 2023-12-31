// pages/api/updatePassword.js

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { email, newPassword } = await req.json();

    // Tìm kiếm người dùng dựa trên email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu trong cơ sở dữ liệu
    await User.updateOne({ email }, { $set: { password: hashedNewPassword } });

    // Trả về thông báo cập nhật thành công
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
