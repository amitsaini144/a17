"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { X, AlignJustify } from "lucide-react";

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen)

    return (
        <div className="flex w-full justify-between">
            <div className="flex items-center gap-4 text-xl font-biotif font-bold z-50">
                <Link href="/">a17</Link>
            </div>
            <motion.button
                onClick={toggle}
                className="md:hidden z-50"
            >
                {isOpen ? (
                    <X size={32} />
                ) : (
                    <AlignJustify size={32} />
                )}
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-x-0 top-0 z-40 bg-white md:hidden overflow-hidden"
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <motion.div
                            className="flex flex-col gap-3 pb-3 pt-24 px-4 w-full font-biotif font-normal text-lg text-[#4a4a4a]"
                        >
                            {[
                                { href: "/all-products", text: "All products" },
                                { href: "/about-us", text: "About us" },
                                { href: "/faq", text: "FAQ" },
                                { href: "/blog", text: "Blog" },
                                { href: "/docs", text: "Docs" },
                                { href: "/contact", text: "Contact" },
                            ].map((link, index, array) => (
                                <div key={link.href} className="relative">
                                    <Link
                                        href={link.href}
                                        className="block p-3 transition-colors duration-200 w-fit"
                                    >
                                        {link.text}
                                    </Link>
                                    {index < array.length - 1 && (
                                        <div className="absolute bottom-0 left-3 right-3 h-px bg-gray-200" />
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}