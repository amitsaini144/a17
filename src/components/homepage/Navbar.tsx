"use client"
import Link from "next/link"
import { useInView, motion } from "framer-motion"
import { useRef } from "react";
import BurgerMenu from "./BurgerMenu";

export default function Navbar() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.1 });

    return (
        <motion.div
            ref={containerRef}
            initial={{ y: -60 }}
            animate={isInView ? { y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex px-8 py-8 w-full">
            <div className=" flex w-full justify-between">
                <div className="w-full justify-between hidden md:flex">
                    <div className="flex items-center gap-4 text-xl font-biotif font-bold">
                        <Link href="/">a17</Link>
                    </div>
                    <div className="items-center gap-12 font-biotif font-normal text-lg text-[#4a4a4a] hidden md:flex">
                        <div>
                            <Link href="/">All products</Link>
                        </div>
                        <div>
                            <Link href="/">About us</Link>

                        </div>
                        <div>
                            <Link href="/">FAQ</Link>

                        </div>
                        <div>
                            <Link href="/">Blog</Link>

                        </div>
                        <div>
                            <Link href="/">Contact</Link>
                        </div>
                    </div>
                </div>

                <div className="md:hidden w-full">
                    <BurgerMenu />
                </div>
            </div>
        </motion.div>

    );
}