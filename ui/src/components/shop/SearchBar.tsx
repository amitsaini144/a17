"use client"

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { shopProducts } from "@/data/shopData";
import { product } from "@/types/shop";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const searchBarRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [filteredProducts, setFilteredProducts] = useState<product[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [listHeight, setListHeight] = useState<number>(0);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
            document.body.style.overflow = 'hidden';
        } else {
            setSearchTerm("");
            setFilteredProducts([]);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)

        if (newSearchTerm === "") {
            setFilteredProducts([])
        } else {
            setFilteredProducts(shopProducts.filter(product =>
                product.label.toLowerCase().includes(newSearchTerm.toLowerCase())
            ))
        }
    }

    useEffect(() => {
        if (listRef.current) {
            setListHeight(listRef.current.scrollHeight)
        }
    }, [filteredProducts])

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-start justify-center z-50 sm:pt-32">
            <motion.div
                initial={{ y: "-100vh", opacity: 0 }}
                animate={{ y: "0vh", opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                ref={searchBarRef}
                className="flex flex-col px-5 py-3 bg-white sm:rounded-2xl gap-4 justify-start items-center w-full sm:w-fit max-h-[500px] ">
                <div className="flex gap-2 items-center">
                    <Search className="text-[#7f7f7f] w-5 h-5" />
                    <input
                        autoFocus
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e)}
                        placeholder="Type in to search.."
                        className="w-[430px] h-[32px] text-black bg-transparent outline-none"
                        aria-label="Search Products"
                    />
                </div>
                <AnimatePresence>
                    {searchTerm && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: listHeight }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="flex flex-col text-black border-t w-full overflow-y-auto scrollbar-hide"
                        >
                            <div ref={listRef}>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <Link
                                            href={`/shop/${product.slug}`}
                                            key={product.id}
                                            onClick={onClose}
                                            className="flex flex-col w-full text-sm hover:bg-[#f7f7f7] px-4 py-4">
                                            <span>{product.label}</span>
                                            <span className="text-[#4a4a4a]">/shop/{product.slug}</span>
                                        </Link>
                                    ))) : (
                                    <div className="flex items-center justify-center w-full py-2 text-sm text-[#7e7e7e]">
                                        No results
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}