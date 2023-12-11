import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { id, isActive } = await req.json();

    // Kiểm tra nếu isActive không phải là 'active' hoặc 'unactive', trả về lỗi
    if (!["active", "unactive"].includes(isActive)) {
      return NextResponse.json(
        { error: "Invalid isActive value" },
        { status: 400 }
      );
    }

    // Cập nhật trường isActive dựa trên giá trị mới
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: isActive === "active" ? "unactive" : "active" },
      { new: true }
    ).select("_id isActive");

    console.log("updatedUser: ", updatedUser);
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
