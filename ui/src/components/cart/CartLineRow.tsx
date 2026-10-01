"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { CartLine } from "@/lib/api/cart"
import { formatPrice } from "@/lib/format"
import QuantityStepper from "./QuantityStepper"

type Props = {
    line: CartLine
    /** The cart's current quantity, which may be ahead of the last quote while re-pricing. */
    quantity: number
    pricing: boolean
    onQuantityChange: (quantity: number) => void
    onRemove: () => void
}

export default function CartLineRow({ line, quantity, pricing, onQuantityChange, onRemove }: Props) {
    const { product } = line
    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="flex gap-4 md:gap-6 py-6 border-b">
            <Link href={`/shop/${product.slug}`} className="flex-shrink-0">
                <Image
                    src={product.image_url}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="rounded-2xl object-cover w-[88px] h-[88px] md:w-[120px] md:h-[120px] bg-[#f7f7f7]" />
            </Link>
            <div className="flex flex-col justify-between flex-1 gap-3 min-w-0">
                <div className="flex justify-between gap-4">
                    <div className="flex flex-col gap-1 min-w-0">
                        <Link href={`/shop/${product.slug}`} className="text-black text-lg truncate">{product.name}</Link>
                        <p className="text-sm text-[#7f7f7f]">{formatPrice(product.price_cents, product.currency)} each</p>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        aria-label={`Remove ${product.name} from cart`}
                        className="self-start p-1 text-[#7f7f7f] hover:text-black">
                        <X aria-hidden className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <QuantityStepper value={quantity} onChange={onQuantityChange} label={product.name} />
                    <p className={`text-black text-lg tabular-nums transition-opacity ${pricing ? "opacity-40" : ""}`}>
                        {formatPrice(line.line_total_cents, product.currency)}
                    </p>
                </div>
            </div>
        </motion.li>
    )
}
