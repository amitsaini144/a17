import { motion } from "framer-motion"
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react"
import Link from "next/link"
import type { Order } from "@/lib/api/checkout"

export default function ConfirmationHeading({ order, polling }: { order: Order; polling: boolean }) {
    if (order.status === "paid" || order.status === "fulfilled") {
        return (
            <>
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                    <CheckCircle2 aria-hidden className="w-16 h-16 text-green-600" />
                </motion.div>
                <h1 className="text-[32px] md:text-[40px] text-black font-medium leading-tight">Thank you for your order!</h1>
                <p className="text-[#4a4a4a]">Payment confirmed. Order #{order.id} is on its way to being packed.</p>
            </>
        )
    }
    if (order.status === "cancelled") {
        return (
            <>
                <XCircle aria-hidden className="w-16 h-16 text-[#7f7f7f]" />
                <h1 className="text-[32px] md:text-[40px] text-black font-medium leading-tight">Payment didn&apos;t go through</h1>
                <p className="text-[#4a4a4a]">No money was taken. Your cart is still saved.</p>
                <Link href="/cart" className="text-black underline underline-offset-4">Back to cart</Link>
            </>
        )
    }
    return (
        <>
            {polling ? <Loader2 aria-hidden className="w-16 h-16 text-[#7f7f7f] animate-spin" /> : <Clock aria-hidden className="w-16 h-16 text-[#7f7f7f]" />}
            <h1 className="text-[32px] md:text-[40px] text-black font-medium leading-tight">Confirming your payment…</h1>
            <p className="text-[#4a4a4a]">
                {polling
                    ? "This usually takes a few seconds."
                    : "This is taking longer than usual. Your order will update in your account once the payment is confirmed."}
            </p>
        </>
    )
}
