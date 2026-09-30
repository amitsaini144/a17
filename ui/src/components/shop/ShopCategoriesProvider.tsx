"use client"

import { createContext, useContext } from "react"
import type { Category } from "@/lib/api/client"

// Categories loaded once by the shop layout, for client components under /shop that render
// before their page's data arrives (the loading state).
const ShopCategoriesContext = createContext<Category[]>([])

export function useShopCategories(): Category[] {
    return useContext(ShopCategoriesContext)
}

export default function ShopCategoriesProvider({ categories, children }: { categories: Category[], children: React.ReactNode }) {
    return <ShopCategoriesContext.Provider value={categories}>{children}</ShopCategoriesContext.Provider>
}
