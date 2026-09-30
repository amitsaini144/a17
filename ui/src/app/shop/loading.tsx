import ShopSkeleton from "@/components/loading/ShopSkeleton"

// One boundary for all of /shop: it wraps both /shop and /shop/<slug>, so it is what shows when
// navigating between them. A nested loading.tsx would only show on the first page load.
export default function Loading() {
    return <ShopSkeleton />
}
