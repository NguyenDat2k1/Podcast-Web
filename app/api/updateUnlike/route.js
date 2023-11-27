import { NextResponse } from "next/server";
import Favourite from "@/models/favourite";
import { connectMongoDB } from "@/lib/mongodb";

export async function DELETE(req) {
  try {
    const { podcastID, userID } = await req.json();

    console.log(
      "Received request to delete podcast with ID:",
      podcastID,
      "for user ID:",
      userID
    );

    await connectMongoDB();

    const filter = { podcast_ID: podcastID, user_ID: userID };

    const result = await Favourite.deleteOne(filter);

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
