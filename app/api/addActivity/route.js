import { NextResponse } from "next/server";
import Activity from "@/models/activityUser";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { email, activity } = await req.json();
    console.log("Đã lấy được dữ liệu email, activity : ", { email, activity });

    // Kết nối MongoDB
    await connectMongoDB();

    // Tạo bản ghi mới
    const newActivity = await Activity.create({ user: email, activity });

    return NextResponse.json(
      {
        message: "tạo bản ghi hoạt động thành công",
        newActivity: newActivity.toJSON(), // Trả về thông tin về bản ghi mới nếu cần
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi thêm bản ghi hoạt động." },
      { status: 500 }
    );
  }
}
