import Skeleton from "@/components/loading/Skeleton"
import CartLayout from "./CartLayout"

export default function CartSkeleton() {
    return (
        <CartLayout>
            <div role="status" className="flex flex-col xl:flex-row gap-10 xl:gap-16">
                <span className="sr-only">Loading your cart…</span>
                <div className="flex-1 flex flex-col border-t">
                    {Array.from({ length: 2 }, (_, index) => (
                        <div key={index} className="flex gap-6 py-6 border-b">
                            <Skeleton className="rounded-2xl w-[88px] h-[88px] md:w-[120px] md:h-[120px]" />
                            <div className="flex flex-col justify-between flex-1">
                                <Skeleton className="rounded-full h-6 w-1/2" />
                                <Skeleton className="rounded-full h-10 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
                <Skeleton className="rounded-3xl h-[260px] xl:w-[380px]" />
            </div>
        </CartLayout>
    )
}
