import { NextResponse } from "next/server";
import History from "@/models/historySeen";
import { connectMongoDB } from "@/lib/mongodb";

export async function DELETE(req) {
  try {
    const { historyID } = await req.json();

    console.log("Received request to delete history with ID:", historyID);

    await connectMongoDB();

    const filter = { _id: historyID };

    const result = await History.deleteOne(filter);

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "history deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "history not found or not deleted" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Gặp lỗi khi đang thực hiện request:", error);
    return NextResponse.json(
      { message: "Xảy ra lỗi khi xóa history." },
      { status: 500 }
    );
  }
}
