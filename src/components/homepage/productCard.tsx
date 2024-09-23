"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"

interface ProductCardProps {
    product: {
        id: number,
        label: string,
        href: string,
        image: string,
        price: string,
    }
}
export default function ProductCard({ product }: ProductCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
        >
            <Link href="/" className="flex flex-col gap-4">
                <div className="relative rounded-3xl">
                    <Image src={product.image} alt="Headphones x-28m" width={400} height={465} quality={100} className="rounded-3xl w-[300px] md:w-[400px]" />
                    <p className=" absolute top-5 left-5 border border-[#4a4a4a] text-[#4a4a4a] w-fit rounded-full px-3">Featured</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-black text-lg md:text-xl">{product.label}</p>
                    <p className="text-[#7f7f7f] text-lg md:text-xl">USD {product.price}</p>
                </div>
            </Link>
        </motion.div>
    )
}