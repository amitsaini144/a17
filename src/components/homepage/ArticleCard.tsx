"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface ArticlesProps {
    article: {
        id: number;
        label: string;
        href: string;
        image: string;
    };
}

export default function ArticleCard({ article }: ArticlesProps) {
    return (
        <motion.div whileHover={{ scale: 1.02 }}>
            <Link href="/" className="flex flex-col gap-4 w-[331px] md:w-[400px]">
                <div className="rounded-3xl">
                    <Image
                        src={article.image}
                        alt="Ariticle image"
                        width={400}
                        height={400}
                        quality={90}
                        priority
                        className="rounded-3xl object-cover h-96" />
                </div>
                <div className="flex">
                    <p className="text-black text-lg md:text-xl">{article.label}</p>
                </div>
            </Link>
        </motion.div>
    )
}