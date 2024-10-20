import Product from "@/components/shop/Product"
import { shopProducts } from "@/data/shopData"
import SearchSection from "@/components/shop/SearchSection"

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
                        <SearchSection />

                        <div className="grid gris-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-6">
                            {shopProducts.map((product) => (
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