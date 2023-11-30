// Import các thư viện và models cần thiết
import { NextResponse } from "next/server";
import Podcast from "@/models/podcast";
import Favourite from "@/models/favourite";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET() {
  try {
    console.log("Received request to get podcast details from favourites.");

    await connectMongoDB();

    // Lấy danh sách các podcast từ bảng Podcast
    const podcastRecords = await Podcast.find({}, { _id: 0, podcastId: 1 });

    // Tính tổng số lượt like cho mỗi podcastId và lấy tên từ bảng Podcast
    const totalLikes = await Promise.all(
      podcastRecords.map(async (podcast) => {
        const { podcastId } = podcast;
        const totalLike = await Favourite.countDocuments({ podcastId });
        const podcastDetails = await Podcast.findOne(
          { podcastId },
          { _id: 0, name: 1 }
        );
        const name = podcastDetails ? podcastDetails.name : "Unknown";
        return { name, totalLike };
      })
    );

    // Kết quả trả về là mảng với đối tượng có trường "podcastId", "totalLike", và "name"
    console.log("Total likes:", totalLikes);

    return NextResponse.json(totalLikes, { status: 200 });
  } catch (error) {
    console.error("Error while processing the request:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching podcast details." },
      { status: 500 }
    );
  }
}
