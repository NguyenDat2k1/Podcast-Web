import { NextResponse } from "next/server";
import Podcast from "@/models/podcast";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { name, level, audioPath, transcriptPath, ytbPath } =
      await req.json();
    const levelValue = (await Array.isArray(level)) ? level[0] : level;
    console.log("Received podcast data:", {
      name,
      level,
      audioPath,
      transcriptPath,
      ytbPath,
    });
    await connectMongoDB();
    await Podcast.create({
      name,
      level: levelValue,
      audioPath,
      transcriptPath,
      ytbPath,
    });

    return NextResponse.json({ message: "podcast added" }, { status: 201 });
  } catch (error) {
    console.error("Error while processing the request:", error);
    return NextResponse.json(
      { message: "An error occurred while adding the podcast." },
      { status: 500 }
    );
  }
}
