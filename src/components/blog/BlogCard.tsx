"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { article } from "@/types/blog";

export default function BlogCard({ label, slug, image, date }: article) {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="w-full">
            <Link href={`/blog/${slug}`} className="flex flex-col gap-4 w-full xl:w-[400px]">
                <div className="rounded-3xl w-full">
                    <Image
                        src={image}
                        alt="Ariticle image"
                        width={400}
                        height={400}
                        quality={90}
                        loading="lazy"
                        placeholder="blur"
                        className="rounded-3xl object-cover h-96 w-full xl:w-[400px]" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-black text-lg md:text-xl">{label}</p>
                    <p className="text-[#999999] md:text-lg">{date}</p>
                </div>
            </Link>
        </motion.div>
    )
}