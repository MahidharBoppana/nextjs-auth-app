import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/user.model.js";
import crypto from "crypto"

connect()


export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token } = reqBody

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")

        const user = await User.findOne({ verifyToken: hashedToken, verifyTokenExpiry: { $gt: Date.now() } })

        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()

        return NextResponse.json({ success: true, message: "Email verified successfully" }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}