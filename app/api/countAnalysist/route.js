// Import các thư viện và models cần thiết
import { NextResponse } from "next/server";
import Analysist from "@/models/analysist";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { type, id_podcast, datE } = await req.json();

    console.log(
      "nhận request to update count for analysist with type, id_podcast and datE:",
      type,
      id_podcast,
      datE
    );

    await connectMongoDB();

    // Tìm bản ghi có id_podcast và datE tương ứng
    const filter = { id_podcast, datE };
    const update = {
      $inc: { counT: 1 },
      $setOnInsert: { type, id_podcast, datE },
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const result = await Analysist.findOneAndUpdate(filter, update, options);

    if (result) {
      return NextResponse.json(
        { message: "Count updated trong analysist thành công" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "không tìm thấy bản ghi hoặc k cập nhật dc" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("lỗi trong khi thực hiện request:", error);
    return NextResponse.json(
      { message: "lỗi xảy ra khi cập nhật count." },
      { status: 500 }
    );
  }
}
