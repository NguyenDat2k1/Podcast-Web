import { NextResponse } from "next/server";
import Quizz from "@/models/quizz";
import { connectMongoDB } from "@/lib/mongodb";

export async function PUT(req) {
  try {
    const { quizzID, detail } = await req.json();

    console.log("Received updated quizz:", {
      quizzID,
      detail,
    });

    await connectMongoDB();

    const filter = { _id: quizzID };
    const update = {
      $set: {
        ques: detail,
      },
    };

    const result = await Quizz.updateOne(filter, update);

    if (result.modifiedCount === 1) {
      return NextResponse.json(
        { message: "Quizz updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Quizz not found or not updated" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error while processing the request updated Quizz:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the Quizz." },
      { status: 500 }
    );
  }
}
