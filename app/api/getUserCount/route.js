// Import các thư viện và models cần thiết
import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("Received request to get the number of user records.");

    await connectMongoDB();

    const userCount = await User.countDocuments();
    console.log(" the number of user records : ", userCount);
    return NextResponse.json({ userCount: userCount }, { status: 200 });
  } catch (error) {
    console.error("Error while processing the request:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the user count." },
      { status: 500 }
    );
  }
}
