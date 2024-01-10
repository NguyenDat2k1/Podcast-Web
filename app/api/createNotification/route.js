import { NextResponse } from "next/server";
import NotiSub from "@/models/notiSub"; // Assuming you have a Quizz model
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    // Destructure the required properties from the request body
    const { email, notification } = await req.json();

    // Log the received quizz data for debugging (optional)
    console.log("Received NotiSub data:", {
      email,
      notification,
    });

    // Connect to MongoDB
    await connectMongoDB();

    // Create a new Quizz record
    await NotiSub.create({
      email,
      notification,
    });

    // Return a success response
    return NextResponse.json({ message: "NotiSub added" }, { status: 201 });
  } catch (error) {
    // Handle errors and return an error response
    console.error("Error while processing the request add NotiSub:", error);
    return NextResponse.json(
      { message: "An error occurred while adding the NotiSub." },
      { status: 500 }
    );
  }
}
