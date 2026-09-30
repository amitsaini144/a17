"use client"
import { product } from "@/types/shop";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function RelatedCard({ label, slug, image, price, }: product) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
        >
            <Link href={`/shop/${slug}`} className="flex flex-col gap-4 w-full xl:w-[400px]">
                <div className="rounded-3xl">
                    <Image
                        src={image}
                        alt={label}
                        width={400}
                        height={465}
                        quality={90}
                        placeholder="blur"
                        priority className="rounded-3xl w-[300px] md:w-[400px]" />
                </div>
                <div className="flex justify-between">
                    <p className="text-black text-lg md:text-xl">{label}</p>
                    <p className="text-[#7f7f7f] text-lg md:text-xl">USD {price}</p>
                </div>
            </Link>
        </motion.div>
    )
}