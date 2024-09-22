"use client"
import Link from "next/link"
import { useInView, motion } from "framer-motion"
import { useRef } from "react";
import BurgerMenu from "./BurgerMenu";

const navItems = [
    { href: '/all-products', label: 'All products' },
    { href: '/about', label: 'About us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.1 });

    return (
        <motion.nav
            ref={containerRef}
            animate={isInView ? { y: 0 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex px-8 py-8 w-full"
        >
            <div className="flex w-full justify-between">
                <div className="w-full justify-between hidden md:flex">
                    <div className="flex items-center gap-4 text-2xl font-bold">
                        <Link href="/">a17</Link>
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
                    <BurgerMenu />
                </div>
            </div>
        </motion.nav>

    );
}