import type { Metadata } from "next"
import { Suspense } from "react"
import AuthForm from "@/components/auth/AuthForm"

export const metadata: Metadata = { title: "Create account - A17" }

export default function RegisterPage() {
    // The form reads `?next=`, which requires a Suspense boundary for static rendering.
    return (
        <Suspense>
            <AuthForm mode="register" />
        </Suspense>
    )
}
