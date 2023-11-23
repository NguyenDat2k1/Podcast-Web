import { NextResponse } from "next/server";
import Podcast from "@/models/podcast";
import { connectMongoDB } from "@/lib/mongodb";

export async function PUT(req) {
  try {
    const {
      podcastID,
      name,
      level,
      type,
      audioPath,
      transcriptPath,
      describe,
      ytbPath,
    } = await req.json();
    const levelValue = Array.isArray(level) ? level[0] : level;

    console.log("Received updated podcast data:", {
      podcastID,
      name,
      level,
      type,
      audioPath,
      transcriptPath,
      describe,
      ytbPath,
    });

    await connectMongoDB();

    const filter = { _id: podcastID };
    const update = {
      $set: {
        name,
        level: levelValue,
        type,
        audioPath,
        transcriptPath,
        describe,
        ytbPath,
      },
    };

    const result = await Podcast.updateOne(filter, update);

    if (result.modifiedCount === 1) {
      return NextResponse.json(
        { message: "Podcast updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Podcast not found or not updated" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error while processing the request:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the podcast." },
      { status: 500 }
    );
  }
}
