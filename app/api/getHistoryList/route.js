import { connectMongoDB } from "@/lib/mongodb";
import History from "@/models/historySeen";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const HistoryList = await History.find(); // Lấy tất cả các bản ghi trong collection
    console.log("HistoryList: ", HistoryList);
    return NextResponse.json(HistoryList);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.error("Internal Server Error", 500);
  }
}
