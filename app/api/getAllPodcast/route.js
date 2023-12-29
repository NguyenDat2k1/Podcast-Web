// import { connectMongoDB } from "@/lib/mongodb";
// import Podcast from "@/models/podcast";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectMongoDB();
//     const podcasts = await Podcast.find(); // Lấy tất cả các bản ghi trong collection
//     console.log("podcasts: ", podcasts);
//     return NextResponse.json(podcasts);
//   } catch (error) {
//     console.error("Error fetching podcasts:", error);
//     return NextResponse.error("Internal Server Error", 500);
//   }
// }

import { connectMongoDB } from "@/lib/mongodb";
import Podcast from "@/models/podcast";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    // Sử dụng Mongoose để lấy tất cả các bản ghi và sắp xếp theo chiều giảm dần của createdAt
    const podcasts = await Podcast.find().sort({ createdAt: -1 });

    console.log("podcasts: ", podcasts);
    return NextResponse.json(podcasts);
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.error("Internal Server Error", 500);
  }
}
