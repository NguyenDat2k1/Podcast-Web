// Import các thư viện và models cần thiết
import { NextResponse } from "next/server";
import Podcast from "@/models/podcast";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { podcastID } = await req.json();

    console.log(
      "Received request to update audioCount for podcast with ID:",
      podcastID
    );

    await connectMongoDB();

    const filter = { _id: podcastID };
    const update = { $inc: { scriptDowload: 1 } };

    const result = await Podcast.updateOne(filter, update);

    if (result.modifiedCount === 1) {
      return NextResponse.json(
        { message: "Audio count updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Podcast not found or audio count not updated" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error while processing the request:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the audio count." },
      { status: 500 }
    );
  }
}
