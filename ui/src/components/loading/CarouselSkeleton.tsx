import Skeleton from "./Skeleton"

const PLACEHOLDER_CARDS = 4

// Mirrors Carousel/CarouselCard sizes so the page doesn't shift when products arrive.
export default function CarouselSkeleton() {
    return (
        <div role="status" className="relative w-full overflow-hidden">
            <span className="sr-only">Loading featured products…</span>
            <div className="flex overflow-x-hidden px-4 md:px-6 xl:px-10 py-10 md:pb-14 gap-6 xl:gap-8">
                {Array.from({ length: PLACEHOLDER_CARDS }, (_, index) => (
                    <div key={index} className="flex flex-col gap-4 flex-shrink-0 w-[300px] md:w-[400px]">
                        <Skeleton className="rounded-3xl w-full aspect-[400/465]" />
                        <div className="flex justify-between gap-4">
                            <Skeleton className="rounded-full h-6 w-1/2" />
                            <Skeleton className="rounded-full h-6 w-1/5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
