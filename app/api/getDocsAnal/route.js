import { connectMongoDB } from "@/lib/mongodb";
import Analysist from "@/models/analysist";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const analysist = await Analysist.find(); // Lấy tất cả các bản ghi trong collection
    console.log("Analysist: ", analysist);
    return NextResponse.json(analysist);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.error("Internal Server Error", 500);
  }
}
