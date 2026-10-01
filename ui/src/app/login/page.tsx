import type { Metadata } from "next"
import { Suspense } from "react"
import AuthForm from "@/components/auth/AuthForm"

export const metadata: Metadata = { title: "Log in - A17" }

export default function LoginPage() {
    // The form reads `?next=`, which requires a Suspense boundary for static rendering.
    return (
        <Suspense>
            <AuthForm mode="login" />
        </Suspense>
    )
}
