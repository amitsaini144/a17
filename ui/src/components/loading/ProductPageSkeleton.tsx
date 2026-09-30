import Skeleton from "./Skeleton"

const PLACEHOLDER_THUMBNAILS = 3

// Mirrors the above-the-fold part of ProductPage: breadcrumb, gallery, and buy box.
export default function ProductPageSkeleton() {
    return (
        <div role="status" className="flex flex-col items-center w-full min-w-[320px]">
            <span className="sr-only">Loading product…</span>
            <div className="w-full max-w-8xl">
                <div className="w-full flex flex-col gap-6 px-4 md:px-6 xl:px-10 pt-32">
                    <Skeleton className="rounded-full h-5 w-48" />
                    <div className="flex flex-col xl:flex-row gap-10 w-full">
                        <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
                            <div className="flex md:flex-col justify-between md:justify-around gap-2 md:gap-3">
                                {Array.from({ length: PLACEHOLDER_THUMBNAILS }, (_, index) => (
                                    <Skeleton
                                        key={index}
                                        className="rounded-2xl w-1/3 h-[150px] md:w-[200px] md:h-[240px] xl:h-[180px]" />
                                ))}
                            </div>
                            <Skeleton className="rounded-3xl w-full h-[500px] md:h-[744px] xl:h-[600px]" />
                        </div>
                        <div className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col gap-3">
                                <Skeleton className="rounded-full h-10 w-2/3" />
                                <Skeleton className="rounded-full h-4 w-full" />
                                <Skeleton className="rounded-full h-4 w-5/6" />
                            </div>
                            <Skeleton className="rounded-full h-9 w-32" />
                            <Skeleton className="rounded-full h-[62px] w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
