import { connectMongoDB } from "@/lib/mongodb";
import Favourite from "@/models/favourite";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const Favourites = await Favourite.find(); // Lấy tất cả các bản ghi trong collection
    console.log("Favourites: ", Favourites);
    return NextResponse.json(Favourites);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.error("Internal Server Error", 500);
  }
}
