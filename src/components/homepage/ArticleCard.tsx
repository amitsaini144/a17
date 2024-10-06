"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {article } from "@/types/blog";

export default function ArticleCard({ label, href, image }: article) {
    return (
        <motion.div whileHover={{ scale: 1.02 }}>
            <Link href={href} className="flex flex-col gap-4 w-[331px] md:w-[400px]">
                <div className="rounded-3xl">
                    <Image
                        src={image}
                        alt="Ariticle image"
                        width={400}
                        height={400}
                        quality={90}
                        priority
                        className="rounded-3xl object-cover h-96" />
                </div>
                <div className="flex">
                    <p className="text-black text-lg md:text-xl">{label}</p>
                </div>
            </Link>
        </motion.div>
    )
}