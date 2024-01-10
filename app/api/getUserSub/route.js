import { NextResponse } from "next/server";
import Subscriber from "@/models/subscriber"; // Assuming you have a NotiSub model
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { type } = await req.json();

    await connectMongoDB();

    // Find all NotiSub records with matching type
    const subscribers = await Subscriber.find({ type });

    // Extract emails from the found records
    const emails = subscribers.map((subscriber) => subscriber.email);

    // Return the list of emails
    return NextResponse.json(emails, { status: 200 });
  } catch (error) {
    console.error("Error while processing the request to get emails:", error);
    return NextResponse.json(
      { message: "An error occurred while retrieving emails." },
      { status: 500 }
    );
  }
}
