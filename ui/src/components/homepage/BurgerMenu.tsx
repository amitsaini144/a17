"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { X, AlignJustify } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/homeData";

export default function BurgerMenu({ setMenuOpen }: { setMenuOpen: Dispatch<SetStateAction<boolean>> }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const toggle = () => {
        setMenuOpen(!isOpen)
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        setIsOpen(false)
        setMenuOpen(false)
    }, [pathname, setMenuOpen])

    return (
        <div className="flex w-full justify-between">
            <div className="flex item-center gap-4 text-2xl text-black font-bold z-50">
                <Link href="/">A17</Link>
            </div>
            <motion.button
                onClick={toggle}
                className="md:hidden z-50"
            >
                {isOpen ? (
                    <X size={32} color="black" />
                ) : (
                    <AlignJustify size={32} color="black" />
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
                            className="flex flex-col gap-4 pt-24 px-4 w-full font-normal text-lg text-[#4a4a4a]"
                        >
                            {navItems.map((item, index, array) => (
                                <div key={item.href} className="relative py-1">
                                    <Link
                                        href={item.href}
                                        className="block p-3 transition-colors duration-200 w-fit"
                                    >
                                        {item.label}
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