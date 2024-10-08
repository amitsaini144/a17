import Link from "next/link"
import { Search } from "lucide-react"
import { carouselProducts } from "@/data/homeData"
import Product from "@/components/shop/Product"

export default function Shop() {
    return (
        <div className="flex flex-col items-center w-full min-w-[320px] bg-white">
            <div className="w-full max-w-[1349px]">
                <div className="flex flex-col px-4 md:px-6 xl:px-10 pt-[120px] md:pt-40 pb-0 gap-10">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[40px] xl:text-[64px] text-black font-medium">Shop</h1>
                        <p className="text-lg md:text-xl text-[#4a4a4a]">Check out our full collection of products tailored to your needs</p>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-row-reverse md:flex-row justify-between gap-4">
                            <div className="flex gap-2 md:gap-1 xl:gap-3 text-sm md:text-base overflow-x-auto scrollbar-hide">
                                <Link href='' className="border px-8 py-3 rounded-full bg-black text-white flex-shrink-0">
                                    <p>All products</p>
                                </Link>
                                <Link href='' className="border px-8 py-3 rounded-full text-black">
                                    <p>Headphones</p>
                                </Link>
                                <Link href='' className="border px-8 py-3 rounded-full text-black">
                                    <p>Displays</p>
                                </Link>
                                <Link href='' className="border px-8 py-3 rounded-full text-black">
                                    <p>Watches</p>
                                </Link>
                                <Link href='' className="border px-8 py-3 rounded-full text-black">
                                    <p>Phones</p>
                                </Link>
                            </div>
                            <button>
                                <Search className="text-[#4a4a4a]" />
                            </button>
                        </div>

                        <div className="grid gris-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
                            {carouselProducts.map((product) => (
                                <div key={product.id}>
                                    <Product {...product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}