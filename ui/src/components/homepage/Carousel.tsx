import { carouselProducts } from "@/data/homeData"
import CarouselCard from "./CarouselCard"

export default function Carousel() {
    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide px-4 md:px-6 xl:px-10 py-10 md:pb-14 gap-6 xl:gap-8">
                {carouselProducts.map((product) => (
                    <div className="flex-shrink-0" key={product.id}>
                        <CarouselCard {...product} />
                    </div>
                ))}
            </div>
        </div>
    )
}  