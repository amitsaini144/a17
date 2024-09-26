import ProductCard from "./productCard"

const products = [
    { id: 1, label: 'Headphones x-28m', href: '/', image: '/headphone.png', price: '149.99' },
    { id: 2, label: 'eWatch SF 4', href: '/all-products', image: '/eWatch.png', price: '349.99' },
    { id: 3, label: 'eDisplay XR', href: '/all-products', image: '/eDisplay.png', price: '649.99' },
]

export default function Carousel() {
    return (
        <div className="relative w-full">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4 md:px-6 xl:px-10 py-10 md:pb-14">
                {products.map((product) => (
                    <div className="flex-shrink-0" key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    )
}  