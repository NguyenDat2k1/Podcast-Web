import { NextResponse } from "next/server";
import User from "@/models/user";
import { connectMongoDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        await connectMongoDB();
        await User.updateOne({ email: email }, { $set: { password: hashedPassword } });

        return NextResponse.json({ message: "user updated"}, {status: 201});
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while registering the user."},
            {status: 500 }
        )
    }
}