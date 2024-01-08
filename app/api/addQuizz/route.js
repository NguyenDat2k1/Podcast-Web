import { NextResponse } from "next/server";
import Quizz from "@/models/quizz"; // Assuming you have a Quizz model
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    // Destructure the required properties from the request body
    const { ques } = await req.json();

    // Log the received quizz data for debugging (optional)
    console.log("Received quizz data:", {
      ques,
    });

    // Connect to MongoDB
    await connectMongoDB();

    // Create a new Quizz record
    await Quizz.create({
      ques,
    });

    // Return a success response
    return NextResponse.json({ message: "Quizz added" }, { status: 201 });
  } catch (error) {
    // Handle errors and return an error response
    console.error("Error while processing the request add quizz:", error);
    return NextResponse.json(
      { message: "An error occurred while adding the quizz." },
      { status: 500 }
    );
  }
}
