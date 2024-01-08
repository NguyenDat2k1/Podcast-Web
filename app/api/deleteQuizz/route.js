import { NextResponse } from "next/server";
import Quizz from "@/models/quizz";
import { connectMongoDB } from "@/lib/mongodb";

export async function DELETE(req) {
  try {
    const { quizzID } = await req.json();

    console.log("Received request to delete quizz with ID:", quizzID);

    await connectMongoDB();

    const filter = { _id: quizzID };

    const result = await Quizz.deleteOne(filter);

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "Quizz deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Quizz not found or not deleted" },
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
