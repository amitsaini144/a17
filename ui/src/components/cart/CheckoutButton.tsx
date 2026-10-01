"use client"

import { Loader2, Lock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/components/auth/AuthProvider"
import { markCartCheckout, startCheckout } from "@/lib/api/checkout"
import { describeCheckoutError } from "@/lib/checkout-errors"
import { useCart } from "./CartProvider"

type Props = {
    /** True while the cart is being re-priced (or couldn't be): don't check out unseen prices. */
    disabled: boolean
    /** Called when checkout found unavailable products, so the cart re-prices and shows them. */
    onStale: () => void
}

export default function CheckoutButton({ disabled, onStale }: Props) {
    const auth = useAuth()
    const { items } = useCart()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (auth.status === "anonymous") {
        return (
            <Link href="/login?next=%2Fcart" className="px-8 py-4 bg-black text-white rounded-full text-lg text-center">
                Log in to check out
            </Link>
        )
    }

    const handleCheckout = async () => {
        setSubmitting(true)
        setError(null)
        try {
            const url = await startCheckout(items)
            markCartCheckout()
            // Stripe's hosted page is another site: a full navigation, not a client-side route.
            window.location.assign(url)
        } catch (failure) {
            setError(describeCheckoutError(failure))
            setSubmitting(false)
            onStale()
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={handleCheckout}
                disabled={disabled || submitting || auth.status === "loading"}
                aria-busy={submitting}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-full text-lg disabled:opacity-60">
                {submitting ? <Loader2 aria-hidden className="w-5 h-5 animate-spin" /> : <Lock aria-hidden className="w-4 h-4" />}
                {submitting ? "Redirecting to payment…" : "Checkout"}
            </button>
            <p className="text-xs text-center text-[#7f7f7f]">Secure payment by Stripe. Test mode: no real charges.</p>
            <div role="alert">
                {error && <p className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
            </div>
        </div>
    )
}
