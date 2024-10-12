"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"
import { product } from "@/types/home";

export default function Product({ label, slug, image, price }: product) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
        >
            <Link href={`/shop/${slug}`} className="flex flex-col gap-4 w-full xl:w-[400px]">
                <div className="rounded-3xl w-full">
                    <Image
                        src={image}
                        alt="Headphones x-28m"
                        width={800}
                        height={800}
                        quality={90}
                        priority 
                        placeholder="blur"
                        className="rounded-3xl object-cover w-full" />
                </div>
                <div className="flex justify-between">
                    <p className="text-black text-lg md:text-xl">{label}</p>
                    <p className="text-[#7f7f7f] text-lg md:text-xl">USD {price}</p>
                </div>
            </Link>
        </motion.div>
    )
}