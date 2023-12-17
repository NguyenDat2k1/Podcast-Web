import { NextResponse } from "next/server";
import History from "@/models/historySeen";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { podcast_ID, user_ID, podcast_Name, podcast_Level } =
      await req.json();
    console.log("đã lấy được data: ", {
      podcast_ID,
      user_ID,
      podcast_Name,
      podcast_Level,
    });
    await connectMongoDB();
    await History.create({ podcast_ID, user_ID, podcast_Name, podcast_Level });

    return NextResponse.json(
      { message: "cập nhật lịch sử xem thành công" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "cập nhật lịch sử xem chưa thành công." },
      { status: 500 }
    );
  }
}
