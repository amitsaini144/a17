"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"
import type { ProductSummary } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";

export default function Product({ name, slug, image_url, price_cents, currency }: ProductSummary) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
        >
            <Link href={`/shop/${slug}`} className="flex flex-col gap-4 w-full">
                <div className="rounded-3xl w-full">
                    <Image
                        src={image_url}
                        alt={name}
                        width={800}
                        height={800}
                        quality={90}
                        loading="lazy"
                        className="rounded-3xl object-cover w-full" />
                </div>
                <div className="flex justify-between">
                    <p className="text-black text-lg md:text-xl">{name}</p>
                    <p className="text-[#7f7f7f] text-lg md:text-xl">{formatPrice(price_cents, currency)}</p>
                </div>
            </Link>
        </motion.div>
    )
}
