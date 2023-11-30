import { NextResponse } from "next/server";
import Podcast from "@/models/podcast";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET() {
  try {
    console.log(
      "Received request to get the sum of audioDowload and scriptDowload."
    );

    await connectMongoDB();

    // Sử dụng Mongoose để tính tổng của hai trường và lấy trường "name"
    const result = await Podcast.aggregate([
      {
        $project: {
          _id: 0, // Loại bỏ trường _id khỏi kết quả
          name: 1, // Bao gồm trường "name" trong kết quả
          totalDownloads: { $add: ["$audioDowload", "$scriptDowload"] },
        },
      },
    ]);

    // Kết quả trả về là một mảng với đối tượng có trường "name" và "totalDownloads"
    console.log("Result:", result);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error while processing the request:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the sum of downloads." },
      { status: 500 }
    );
  }
}
