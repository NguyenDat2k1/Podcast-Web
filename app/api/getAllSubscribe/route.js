import { connectMongoDB } from "@/lib/mongodb";
import Subscriber from "@/models/subscriber";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const subscriber = await Subscriber.find(); // Lấy tất cả các bản ghi trong collection
    console.log("subscriber: ", subscriber);
    return NextResponse.json(subscriber);
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    return NextResponse.error("Internal Server Error", 500);
  }
}
