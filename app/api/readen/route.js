import { NextResponse } from "next/server";
import NotiSub from "@/models/notiSub"; // Assuming you have a NotiSub model
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectMongoDB();

    // Find all Subscriber records with matching email
    const notiSub = await NotiSub.find({ email });

    // Update the isRead field to 1 for the found records
    await NotiSub.updateMany({ email }, { $set: { isRead: 1 } });

    // If there are more than 5 records with the same email, delete the oldest ones
    const MAX_RECORDS = 5;
    if (notiSub.length > MAX_RECORDS) {
      // Sort the subscribers by createdAt in ascending order (oldest first)
      const sortedNotiSub = notiSub.sort((a, b) => a.createdAt - b.createdAt);

      // Calculate the number of records to delete
      const recordsToDelete = sortedNotiSub.length - MAX_RECORDS;

      // Get the emails of the records to delete
      const emailsToDelete = sortedSubscribers
        .slice(0, recordsToDelete)
        .map((subscriber) => subscriber.email);

      // Delete the oldest records
      await Subscriber.deleteMany({
        email,
        createdAt: { $in: emailsToDelete },
      });
    }

    // Extract emails from the found records
    const emails = notiSub.map((subscriber) => subscriber.email);

    // Return the list of emails
    return NextResponse.json(emails, { status: 200 });
  } catch (error) {
    console.error(
      "Error while processing the request to update and get emails:",
      error
    );
    return NextResponse.json(
      { message: "An error occurred while updating and retrieving emails." },
      { status: 500 }
    );
  }
}
