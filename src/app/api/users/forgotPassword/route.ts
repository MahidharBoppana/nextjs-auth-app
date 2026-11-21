import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model.js";
import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest, response: NextResponse) {
  const reqBody = await request.json();
  const { email } = reqBody;

  if (!email) {
    return NextResponse.json(
      {
        message: "Please enter the email.",
      },
      {
        status: 400,
      },
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      {
        message: "User does not exist",
      },
      {
        status: 404,
      },
    );
  }

  await sendEmail({ email, emailType: "RESET", userId: user._id });

  return NextResponse.json(
    {
      secure: true,
      message: "Check your email to change the password",
    },
    {
      status: 200,
    },
  );
}
