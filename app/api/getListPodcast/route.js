import { connectMongoDB } from "@/lib/mongodb";
import Podcast from "@/models/podcast";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { level } = await req.json();
    const podcasts = await Podcast.find({ level });
    console.log("podcasts: ", podcasts);
    return NextResponse.json(podcasts);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.error("Internal Server Error", 500);
  }
}
