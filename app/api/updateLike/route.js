import { NextResponse } from "next/server";
import Favourite from "@/models/favourite";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { podcast_ID, user_ID } = await req.json();
    console.log("đã lấy được data: ", { podcast_ID, user_ID });
    await connectMongoDB();
    await Favourite.create({ podcast_ID, user_ID });

    return NextResponse.json({ message: "like thành công" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while liek podcast." },
      { status: 500 }
    );
  }
}
