"use client"

import { usePathname } from "next/navigation"
import ShopShell from "@/components/shop/ShopShell"
import { useShopCategories } from "@/components/shop/ShopCategoriesProvider"
import ProductGridSkeleton from "./ProductGridSkeleton"
import ProductPageSkeleton from "./ProductPageSkeleton"

// `/shop/<slug>` is either a category listing or a product page, and the loading state renders
// before the server has decided which. The destination URL is already known, so match its slug
// against the category list to show the right placeholder.
export default function ShopSkeleton() {
    const categories = useShopCategories()
    const slug = usePathname().split("/")[2]

    if (slug && !categories.some((category) => category.slug === slug)) {
        return <ProductPageSkeleton />
    }
    return (
        <ShopShell categories={categories}>
            <ProductGridSkeleton />
        </ShopShell>
    )
}
