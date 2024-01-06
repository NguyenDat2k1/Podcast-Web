import { connectMongoDB } from "@/lib/mongodb";
import Activity from "@/models/activityUser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    // Sử dụng Mongoose để lấy tất cả các bản ghi và sắp xếp theo chiều giảm dần của createdAt
    const activities = await Activity.find().sort({ createdAt: -1 });

    console.log("activities: ", activities);
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.error("Internal Server Error", 500);
  }
}
