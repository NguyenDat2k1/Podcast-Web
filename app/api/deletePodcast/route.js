import { NextResponse } from "next/server";
import Podcast from "@/models/podcast";
import { connectMongoDB } from "@/lib/mongodb";

export async function DELETE(req) {
  try {
    const { podcastID } = await req.json();

    console.log("Received request to delete podcast with ID:", podcastID);

    await connectMongoDB();

    const filter = { _id: podcastID };

    const result = await Podcast.deleteOne(filter);

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "Podcast deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Podcast not found or not deleted" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error while processing the request:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the podcast." },
      { status: 500 }
    );
  }
}
