import type { Metadata } from "next"
import { Suspense } from "react"
import CheckoutSuccess from "@/components/checkout/CheckoutSuccess"

export const metadata: Metadata = { title: "Order confirmation - A17" }

export default function CheckoutSuccessPage() {
    // Reads `?session_id=`, which requires a Suspense boundary for static rendering.
    return (
        <Suspense>
            <CheckoutSuccess />
        </Suspense>
    )
}
