import Image from "next/image"

export default function AllProducts() {
    return (
        <div className="lg:col-span-1 flex flex-col bg-[#f7f7f7] rounded-3xl overflow-hidden">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-col gap-2 text-black">
                    <h2 className="text-xl md:text-2xl font-medium">All products</h2>
                    <p className="text-sm md:text-base">Discover endless possibilities with our All Products category.<br className="block md:hidden xl:block" /> Shop now for everything you need in one convenient place.</p>
                </div>
                <div>
                    <button className="border px-9 py-4 rounded-full text-black bg-white hover:bg-gray-100 transition-colors">
                        Browse all products
                    </button>
                </div>
            </div>
            <div className="overflow-hidden">
                <Image src="/ultrawatch.png" alt="Smartwatch" width={612} height={360} quality={100} priority className="w-full" />
            </div>
        </div>
    )
}