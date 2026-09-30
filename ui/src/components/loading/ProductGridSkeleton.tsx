import { PRODUCT_GRID_CLASS } from "@/components/shop/ProductGrid"
import Skeleton from "./Skeleton"

const PLACEHOLDER_CARDS = 6

export default function ProductGridSkeleton() {
    return (
        <div role="status" className={PRODUCT_GRID_CLASS}>
            <span className="sr-only">Loading products…</span>
            {Array.from({ length: PLACEHOLDER_CARDS }, (_, index) => (
                <div key={index} className="flex flex-col gap-4">
                    <Skeleton className="rounded-3xl w-full aspect-square" />
                    <div className="flex justify-between gap-4">
                        <Skeleton className="rounded-full h-6 w-1/2" />
                        <Skeleton className="rounded-full h-6 w-1/5" />
                    </div>
                </div>
            ))}
        </div>
    )
}
