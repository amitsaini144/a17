"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/AuthProvider"
import { MAX_LINES } from "@/lib/api/cart"
import { startCheckout } from "@/lib/api/checkout"
import { describeCheckoutError } from "@/lib/checkout-errors"
import { useCart } from "./CartProvider"

// How long the "Added" confirmation stays before the button returns to normal.
const CONFIRMATION_MS = 2500

export default function AddToCartButtons({ slug }: { slug: string }) {
    const { add } = useCart()
    const auth = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [added, setAdded] = useState(false)
    const [cartFull, setCartFull] = useState(false)
    const [buying, setBuying] = useState(false)
    const [buyError, setBuyError] = useState<string | null>(null)

    useEffect(() => {
        if (!added) return
        const timer = setTimeout(() => setAdded(false), CONFIRMATION_MS)
        return () => clearTimeout(timer)
    }, [added])

    const addToCart = () => {
        const ok = add(slug)
        setCartFull(!ok)
        setBuyError(null)
        if (ok) setAdded(true)
    }

    // "Buy now" buys just this product, leaving the cart as it is.
    const buyNow = async () => {
        if (auth.status !== "authenticated") {
            router.push(`/login?next=${encodeURIComponent(pathname)}`)
            return
        }
        setBuying(true)
        setBuyError(null)
        try {
            window.location.assign(await startCheckout([{ slug, quantity: 1 }]))
        } catch (error) {
            setBuyError(describeCheckoutError(error))
            setBuying(false)
        }
    }

    return (
        <div className="flex flex-col w-full gap-3">
            <div className="flex flex-col md:flex-row w-full gap-3">
                <button
                    onClick={addToCart}
                    className="flex items-center justify-center gap-2 border border-black text-black px-9 py-[18px] rounded-full w-full md:text-[18px]">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={added ? "added" : "add"}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2">
                            {added ? <><Check aria-hidden className="w-5 h-5" /> Added to cart</> : "Add to cart"}
                        </motion.span>
                    </AnimatePresence>
                </button>
                <button
                    onClick={buyNow}
                    disabled={buying || auth.status === "loading"}
                    aria-busy={buying}
                    className="flex items-center justify-center gap-2 text-white bg-black px-9 py-[18px] rounded-full w-full md:text-[18px] disabled:opacity-70">
                    {buying && <Loader2 aria-hidden className="w-5 h-5 animate-spin" />}
                    {buying ? "Redirecting…" : "Buy now"}
                </button>
            </div>
            <div role="status" aria-live="polite" className="text-sm text-center">
                {added && <Link href="/cart" className="text-black underline underline-offset-4">View cart</Link>}
                {cartFull && <span className="text-red-700">Your cart is full ({MAX_LINES} products). Remove something first.</span>}
                {buyError && <span className="text-red-700">{buyError}</span>}
            </div>
        </div>
    )
}
