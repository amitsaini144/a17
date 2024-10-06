"use client"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { navItems } from "@/data/homeData";
import BurgerMenu from "./BurgerMenu";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
    const [hidden, setHidden] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { scrollY } = useScroll()
    const lastScrollY = useRef(0)

    useMotionValueEvent(scrollY, "change", (latest: number) => {
        if (menuOpen) return
        const direction = latest - lastScrollY.current > 0 ? "down" : "up"

        if (direction === "down" && !hidden) setHidden(true)
        if (direction === "up" && hidden) setHidden(false)

        lastScrollY.current = latest
    })

    useEffect(() => {
        setHidden(false)
    }, [])

    const variants = {
        visible: { y: 0 },
        hidden: { y: "-100%" },
    }

    return (
        <motion.nav
            variants={variants}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed top-0 left-0 right-0 z-50 flex px-8 py-8 w-full justify-center bg-white`}
        >
            <div className="flex w-full justify-between max-w-[1245px]">
                <div className="w-full justify-between hidden md:flex">
                    <div className="flex items-center gap-4 text-2xl text-black font-bold">
                        <Link href="/">A17</Link>
                    </div>
                    <div className="items-center gap-12 font-normal text-lg text-[#4a4a4a] hidden md:flex">
                        {navItems.map((item) => (
                            <div key={item.href}>
                                <Link href={item.href}>{item.label}</Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:hidden w-full">
                    <BurgerMenu setMenuOpen={setMenuOpen} />
                </div>
            </div>
        </motion.nav>
    );
}