
import { Search } from "lucide-react"
import Product from "@/components/shop/Product"
import { product } from "@/types/shop"
import CategoryLinks from "./CategoryLinks"

export default function FilteredPage({ products }: { products: product[] }) {
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
                            <CategoryLinks />
                            <button>
                                <Search className="text-[#4a4a4a]" />
                            </button>
                        </div>

                        <div className="grid gris-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-6">
                            {products.map((product) => (
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