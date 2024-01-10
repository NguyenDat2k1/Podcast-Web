import { connectMongoDB } from "@/lib/mongodb";
import NotiSub from "@/models/notiSub";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const notiSub = await NotiSub.find().sort({ createdAt: -1 });
    // Lấy tất cả các bản ghi trong collection
    console.log("NotiSub: ", notiSub);
    return NextResponse.json(notiSub);
  } catch (error) {
    console.error("Error fetching NotiSub:", error);
    return NextResponse.error("Internal Server Error", 500);
  }
}
