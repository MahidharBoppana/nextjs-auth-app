import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model.js";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await connect();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value || "";

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select(
      "-password -forgotPasswordToken -verifyToken",
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "User retrieved successfully",
        success: true,
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
