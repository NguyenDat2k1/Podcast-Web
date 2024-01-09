import { connectMongoDB } from "@/lib/mongodb";
import Subscriber from "@/models/subscriber";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email, type, flg } = await req.json();

    // Kiểm tra xem biến flg có giá trị là 0 hay 1 không
    if (flg !== 0 && flg !== 1) {
      return NextResponse.json(
        { error: "Invalid flg value. It must be 0 or 1." },
        { status: 400 }
      );
    }

    // Nếu flg là 0, tìm và xóa bản ghi có email và sub trùng giá trị
    if (flg === 0) {
      await Subscriber.findOneAndDelete({ email, type });
      return NextResponse.json({ message: "Record deleted successfully." });
    }

    // Nếu flg là 1, tạo một bản ghi mới với email và sub
    const newSubscriber = new Subscriber({ email, type: type });
    const savedSubscriber = await newSubscriber.save();

    return NextResponse.json({ subscriber: savedSubscriber });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
