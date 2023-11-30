// Import các thư viện và models cần thiết
import { NextResponse } from "next/server";
import Podcast from "@/models/podcast";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("Received request to get the number of Podcast records.");

    await connectMongoDB();

    const podcastCount = await Podcast.countDocuments();
    console.log(" the number of podcast records : ", podcastCount);
    return NextResponse.json({ podcastCount: podcastCount }, { status: 200 });
  } catch (error) {
    console.error("Error while processing the request:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the user count." },
      { status: 500 }
    );
  }
}
