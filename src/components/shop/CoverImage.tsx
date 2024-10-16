"use client"

import Image, { StaticImageData } from "next/image";
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react";

export default function CoverImage({ cover, label, maxScale = 1.3, scrollThreshold = 0.4 }: { cover: StaticImageData, label: string, maxScale?: number, scrollThreshold?: number }) {

    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    const scale = useTransform(scrollYProgress, [0, scrollThreshold], [maxScale, 1])

    return (
        <div className="flex px-4 pt-6 md:px-6 xl:px-10">
            <div
                ref={ref}
                className="relative flex aspect-square sm:aspect-video w-full overflow-hidden rounded-3xl">
                <motion.div
                    style={{ scale }}
                    className="absolute inset-0">
                    <Image
                        src={cover}
                        alt={label}
                        fill
                        quality={100}
                        priority
                        placeholder="blur"
                        className="object-cover w-full h-full" />
                </motion.div>
            </div>
        </div>
    )
}   