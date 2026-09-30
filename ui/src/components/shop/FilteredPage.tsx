import type { Category, ProductSummary } from "@/lib/api/client"
import ProductGrid from "./ProductGrid"
import ShopShell from "./ShopShell"

export default function FilteredPage({ products, categories }: { products: ProductSummary[], categories: Category[] }) {
    return (
        <ShopShell categories={categories}>
            <ProductGrid products={products} />
        </ShopShell>
    )
}
