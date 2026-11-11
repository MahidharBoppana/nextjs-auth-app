import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model.js";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please fill all the fields" },
        { status: 400 },
      );
    }
    const existingUser = await User.findOne({ email });

    // check if the user already exists in the database
    if (!existingUser) {
      return NextResponse.json(
        { message: "User does not exist with this email" },
        { status: 400 },
      );
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 },
      );
    }

    const tokenData = {
      id: existingUser._id,
      email: existingUser.email,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        message: "User logged in successfully",
        success: true,
      },
      { status: 200 },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
