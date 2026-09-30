"use client"

import { Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fetchProducts, type ProductSummary } from "@/lib/api/client";
import { motion, AnimatePresence } from "framer-motion";

const SEARCH_DEBOUNCE_MS = 250;
const MAX_RESULTS = 10;

type SearchStatus = "idle" | "loading" | "done" | "error";

export default function SearchBar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const searchBarRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [filteredProducts, setFilteredProducts] = useState<ProductSummary[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [status, setStatus] = useState<SearchStatus>("idle");
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
            setStatus("idle");
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Query the API once typing pauses; abort stale requests so older responses can't win.
    useEffect(() => {
        const term = searchTerm.trim();
        if (!term) {
            setFilteredProducts([]);
            setStatus("idle");
            return;
        }

        setStatus("loading");
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const page = await fetchProducts({ q: term, limit: MAX_RESULTS }, { signal: controller.signal });
                setFilteredProducts(page.items);
                setStatus("done");
            } catch {
                if (!controller.signal.aborted) setStatus("error");
            }
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [searchTerm]);

    useEffect(() => {
        if (listRef.current) {
            setListHeight(listRef.current.scrollHeight)
        }
    }, [filteredProducts, status])

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
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                {status === "loading" && filteredProducts.length === 0 ? (
                                    <div role="status" className="flex items-center justify-center gap-2 w-full py-2 text-sm text-[#7e7e7e]">
                                        <Loader2 aria-hidden className="w-4 h-4 animate-spin" />
                                        Searching…
                                    </div>
                                ) : status === "error" ? (
                                    <div className="flex items-center justify-center w-full py-2 text-sm text-[#7e7e7e]">
                                        Search is unavailable right now
                                    </div>
                                ) : filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <Link
                                            href={`/shop/${product.slug}`}
                                            key={product.slug}
                                            onClick={onClose}
                                            className="flex flex-col w-full text-sm hover:bg-[#f7f7f7] px-4 py-4">
                                            <span>{product.name}</span>
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