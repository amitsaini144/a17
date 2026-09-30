import ShopCategoriesProvider from "@/components/shop/ShopCategoriesProvider"
import { getCategories } from "@/lib/api/catalog"

// Layouts persist across navigations within /shop, so this runs on the first shop page load
// only. Pages still fetch their own data; `getCategories` dedupes the call on that first load.
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
    const categories = await getCategories()

    return <ShopCategoriesProvider categories={categories}>{children}</ShopCategoriesProvider>
}
