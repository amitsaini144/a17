"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { useState } from "react";
import SearchBar from "@/components/shop/SearchBar"

export default function SearchSection() {
    const [openSearch, setOpenSearch] = useState<boolean>(false);

    return (
        <div className="flex flex-row-reverse md:flex-row justify-between gap-4">
            <div className="flex gap-2 md:gap-1 xl:gap-3 text-sm md:text-base overflow-x-auto scrollbar-hide">
                <Link href="/shop" className="border px-8 py-3 rounded-full bg-black text-white flex-shrink-0">
                    <p>All products</p>
                </Link>
                <Link href="/shop/headphone" className="border px-8 py-3 rounded-full text-black">
                    <p>Headphones</p>
                </Link>
                <Link href="/shop/monitor" className="border px-8 py-3 rounded-full text-black">
                    <p>Displays</p>
                </Link>
                <Link href="/shop/smartwatch" className="border px-8 py-3 rounded-full text-black">
                    <p>Watches</p>
                </Link>
                <Link href="/shop/phone" className="border px-8 py-3 rounded-full text-black">
                    <p>Phones</p>
                </Link>
            </div>
            <button onClick={() => setOpenSearch(true)}>
                <Search className="text-[#4a4a4a]" />
            </button>
            <SearchBar isOpen={openSearch} onClose={() => setOpenSearch(false)} />
        </div>
    )
}