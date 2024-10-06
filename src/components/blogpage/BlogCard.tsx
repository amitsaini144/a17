"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArticlesProps } from "@/types/blog";

export default function BlogCard({ article }: ArticlesProps) {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="w-full">
            <Link href="/" className="flex flex-col gap-4 w-full xl:w-[400px]">
                <div className="rounded-3xl w-full">
                    <Image
                        src={article.image}
                        alt="Ariticle image"
                        width={400}
                        height={400}
                        quality={90}
                        priority
                        className="rounded-3xl object-cover h-96 w-full xl:w-[400px]" />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-black text-lg md:text-xl">{article.label}</p>
                    <p className="text-[#999999] md:text-lg">{article.date}</p>
                </div>
            </Link>
        </motion.div>
    )
}