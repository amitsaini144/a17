"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"
import type { ProductSummary } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";

export default function CarouselCard({ name, slug, image_url, price_cents, currency }: ProductSummary) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
        >
            <Link href={`/shop/${slug}`} className="flex flex-col gap-4 w-full xl:w-[400px]">
                <div className="relative rounded-3xl">
                    <Image
                        src={image_url}
                        alt={name}
                        width={400}
                        height={465}
                        quality={90}
                        priority className="rounded-3xl w-[300px] md:w-[400px]" />
                    <p className="absolute top-5 left-5 border border-[#4a4a4a] text-[#4a4a4a] w-fit rounded-full px-3">Featured</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-black text-lg md:text-xl">{name}</p>
                    <p className="text-[#7f7f7f] text-lg md:text-xl">{formatPrice(price_cents, currency)}</p>
                </div>
            </Link>
        </motion.div>
    )
}
