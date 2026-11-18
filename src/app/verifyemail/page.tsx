"use client"

import axios from "axios"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function VerifyEmailPage() {
    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const verifyEmail = async (token: string) => {
        try {
            const response = await axios.post("/api/users/verifyEmail", { token })
            if (response.data.success) {
                setVerified(true)
                router.push("/login")
            } else {
                setError(response.data.message)
            }
        } catch (error: any) {
            setError(error.message)
        }
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const tokenParam = urlParams.get("token")
        if (tokenParam) {
            setToken(tokenParam)
            verifyEmail(tokenParam)
        } else {
            setError("Verification token is missing")
        }
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold">Verify Email</h1>
            <p className="py-2">Token: {token}</p>
            {error && <p className="text-red-500">{error}</p>}
            {verified && <p className="text-green-500">Email verified successfully</p>}
        </div>
    )
}