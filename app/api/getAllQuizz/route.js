import { connectMongoDB } from "@/lib/mongodb";
import Quizz from "@/models/quizz";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const quizz = await Quizz.find(); // Lấy tất cả các bản ghi trong collection
    console.log("quizz: ", quizz);
    return NextResponse.json(quizz);
  } catch (error) {
    console.error("Error fetching quizz:", error);
    return NextResponse.error("Internal Server Error", 500);
  }
}
