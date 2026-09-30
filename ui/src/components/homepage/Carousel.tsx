import { getFeaturedProducts } from "@/lib/api/catalog"
import CarouselCard from "./CarouselCard"

export default async function Carousel() {
    const products = await getFeaturedProducts()

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex overflow-x-auto scrollbar-hide px-4 md:px-6 xl:px-10 py-10 md:pb-14 gap-6 xl:gap-8">
                {products.map((product) => (
                    <div className="flex-shrink-0" key={product.slug}>
                        <CarouselCard {...product} />
                    </div>
                ))}
            </div>
        </div>
    )
}
