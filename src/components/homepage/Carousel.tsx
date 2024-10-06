import { carouselProducts } from "@/data/homeData"
import ProductCard from "./productCard"

export default function Carousel() {
    return (
        <div className="relative w-full">
            <div className="flex overflow-x-auto scrollbar-hide px-4 md:px-6 xl:px-10 py-10 md:pb-14 gap-6 xl:gap-8">
                {carouselProducts.map((product) => (
                    <div className="flex-shrink-0" key={product.id}>
                        <ProductCard {...product} />
                    </div>
                ))}
            </div>
        </div>
    )
}  