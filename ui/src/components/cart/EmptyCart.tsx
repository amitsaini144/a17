import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import CartLayout from "./CartLayout"
import RemovedNotice from "./RemovedNotice"

export default function EmptyCart({ removedCount }: { removedCount: number }) {
    return (
        <CartLayout>
            {removedCount > 0 && <RemovedNotice count={removedCount} />}
            <div className="flex flex-col items-center gap-6 py-16 text-center">
                <ShoppingBag aria-hidden className="w-12 h-12 text-[#c4c4c4]" />
                <div className="flex flex-col gap-2">
                    <p className="text-2xl text-black">Your cart is empty</p>
                    <p className="text-[#4a4a4a]">Find something you&apos;ll love in the shop.</p>
                </div>
                <Link href="/shop" className="px-8 py-4 bg-black text-white rounded-full text-lg">Browse products</Link>
            </div>
        </CartLayout>
    )
}
