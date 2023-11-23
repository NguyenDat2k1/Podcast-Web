import { connectMongoDB } from "@/lib/mongodb";
import Podcast from "@/models/podcast";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { id } = await req.json();
    console.log(id);

    // Sử dụng findById để lấy bản ghi dựa trên id
    const podcast = await Podcast.findById(id);

    console.log("podcast in detail page: ", podcast);
    return NextResponse.json(podcast);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.error("Internal Server Error", 500);
  }
}
