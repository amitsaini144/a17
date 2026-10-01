"use client"

import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useCart } from "@/components/cart/CartProvider"
import OrderCard from "@/components/orders/OrderCard"
import { consumeCartCheckout, getCheckoutOrder, type Order } from "@/lib/api/checkout"
import CheckoutProblem from "./CheckoutProblem"
import CheckoutShell from "./CheckoutShell"
import ConfirmationHeading from "./ConfirmationHeading"

// Stripe redirects here as soon as the payment goes through, often before its webhook (which
// marks the order paid) has reached the API. Poll briefly for the confirmation.
const POLL_INTERVAL_MS = 2000
const MAX_POLLS = 20

type State =
    | { status: "loading" }
    | { status: "order"; order: Order; polling: boolean }
    | { status: "error"; message: string }

export default function OrderConfirmation({ sessionId }: { sessionId: string }) {
    const { clear } = useCart()
    const [state, setState] = useState<State>({ status: "loading" })

    useEffect(() => {
        let cancelled = false
        let timer: ReturnType<typeof setTimeout> | undefined

        const poll = async (attempt: number) => {
            try {
                const order = await getCheckoutOrder(sessionId)
                if (cancelled) return
                const waiting = order.status === "pending" && attempt < MAX_POLLS
                setState({ status: "order", order, polling: waiting })
                if (order.status === "paid" && consumeCartCheckout()) clear()
                if (waiting) timer = setTimeout(() => poll(attempt + 1), POLL_INTERVAL_MS)
            } catch {
                if (!cancelled) setState({ status: "error", message: "We couldn't find this order." })
            }
        }
        poll(1)
        return () => {
            cancelled = true
            clearTimeout(timer)
        }
    }, [sessionId, clear])

    if (state.status === "loading") {
        return (
            <CheckoutShell>
                <div role="status" className="flex items-center justify-center gap-2 py-16 text-[#7f7f7f]">
                    <Loader2 aria-hidden className="w-5 h-5 animate-spin" /> Loading your order…
                </div>
            </CheckoutShell>
        )
    }
    if (state.status === "error") return <CheckoutProblem message={state.message} />

    const { order, polling } = state
    return (
        <CheckoutShell>
            <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 text-center">
                <ConfirmationHeading order={order} polling={polling} />
            </div>
            <OrderCard order={order} />
            <div className="flex flex-col md:flex-row gap-3 justify-center">
                <Link href="/account" className="px-8 py-4 bg-black text-white rounded-full text-center">View my orders</Link>
                <Link href="/shop" className="px-8 py-4 border border-black text-black rounded-full text-center">Continue shopping</Link>
            </div>
        </CheckoutShell>
    )
}
