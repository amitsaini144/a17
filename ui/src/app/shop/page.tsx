import FilteredPage from "@/components/shop/FilteredPage"
import { getCategories, getProductsByCategory } from "@/lib/api/catalog"

// Rendered per request: catalog data must be current, and builds must not depend on the API.
export const dynamic = "force-dynamic"

export default async function Shop() {
    const [products, categories] = await Promise.all([getProductsByCategory(), getCategories()])

    return <FilteredPage products={products} categories={categories} />
}
