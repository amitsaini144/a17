import Product from "@/components/shop/Product"
import type { ProductSummary } from "@/lib/api/client"

// Shared with ProductGridSkeleton so the placeholder grid matches the real one.
export const PRODUCT_GRID_CLASS = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"

export default function ProductGrid({ products }: { products: ProductSummary[] }) {
    return (
        <div className={PRODUCT_GRID_CLASS}>
            {products.map((product) => (
                <div key={product.slug}>
                    <Product {...product} />
                </div>
            ))}
        </div>
    )
}
