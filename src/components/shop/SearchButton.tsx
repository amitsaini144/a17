"use client"

import { Search } from "lucide-react"
import { useState } from "react";
import SearchBar from "@/components/shop/SearchBar"

export default function SearchButton() {
    const [openSearch, setOpenSearch] = useState<boolean>(false);

    return (
        <>
            <button onClick={() => setOpenSearch(true)}>
                <Search className="text-[#4a4a4a]" />
            </button>
            <SearchBar isOpen={openSearch} onClose={() => setOpenSearch(false)} />
        </>
    )
}