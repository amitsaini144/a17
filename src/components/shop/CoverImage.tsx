"use client"

import Image, { StaticImageData } from "next/image";
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react";

export default function CoverImage({ cover, label, maxScale = 1.2, scrollThreshold = 0.4 }: { cover: StaticImageData, label: string, maxScale?: number, scrollThreshold?: number }) {

    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    const scale = useTransform(scrollYProgress, [0, scrollThreshold], [maxScale, 1])

    return (
        <div className="flex px-4 pt-8 md:pt-6 md:px-6 xl:px-10">
            <motion.div
                ref={ref}
                style={{ scale }}
                className="relative flex aspect-square sm:aspect-video w-full">
                <Image
                    src={cover}
                    alt={label}
                    fill
                    quality={100}
                    loading="lazy"
                    placeholder="blur"
                    className="rounded-3xl object-cover w-full" />
            </motion.div>
        </div>
    )
}   