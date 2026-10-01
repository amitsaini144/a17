"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "./CartProvider"

export default function CartNavLink({ className = "" }: { className?: string }) {
    const { count, ready } = useCart()
    const label = count === 1 ? "Cart, 1 item" : `Cart, ${count} items`

    return (
        <Link href="/cart" aria-label={ready ? label : "Cart"} className={`relative flex items-center ${className}`}>
            <ShoppingBag aria-hidden className="w-6 h-6" />
            <AnimatePresence>
                {ready && count > 0 && (
                    // Re-keyed on every change, so the badge pops whenever something is added.
                    <motion.span
                        key={count}
                        aria-hidden
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                        className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-black text-white text-xs flex items-center justify-center">
                        {count > 99 ? "99+" : count}
                    </motion.span>
                )}
            </AnimatePresence>
        </Link>
    )
}
