"use client"

import { useSearchParams } from "next/navigation"
import RequireAuth from "@/components/auth/RequireAuth"
import CheckoutProblem from "./CheckoutProblem"
import OrderConfirmation from "./OrderConfirmation"

export default function CheckoutSuccess() {
    const sessionId = useSearchParams().get("session_id")
    return (
        <RequireAuth>
            {() => (sessionId ? <OrderConfirmation sessionId={sessionId} /> : <CheckoutProblem message="This link is missing its order reference." />)}
        </RequireAuth>
    )
}
