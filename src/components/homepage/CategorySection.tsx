import Image from "next/image";


export default function CategorySection() {
    return (
        <div className="w-full px-4 md:px-6 xl:px-10 py-10 bg-white">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2 text-black">
                    <h1 className="text-[40px] font-medium">Browse by categories</h1>
                    <p className="text-xl">Explore our diverse range of categories tailored to meet your specific needs and interests.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-1 flex flex-col bg-[#f7f7f7] rounded-3xl overflow-hidden">
                        <div className="flex flex-col gap-4 p-8">
                            <div className="flex flex-col gap-2 text-black">
                                <h2 className="text-2xl font-medium">All products</h2>
                                <p className="text-base">Discover endless possibilities with our All Products category. Shop now for everything you need in one convenient place.</p>
                            </div>
                            <div>
                                <button className="border px-6 py-2 rounded-full text-base text-black bg-white hover:bg-gray-100 transition-colors">
                                    Browse all products
                                </button>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <Image src="/ultrawatch.png" alt="Smartwatch" width={612} height={360} quality={100} priority className="w-full" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col lg:flex-row bg-[#f7f7f7] rounded-3xl overflow-hidden">
                            <div className="flex flex-col justify-between p-8">
                                <div className="flex flex-col gap-2 text-black">
                                    <h2 className="text-2xl font-medium">Displays</h2>
                                    <p className="text-base">Experience crystal-clear clarity and vibrant visuals with our Displays.</p>
                                </div>
                                <div className="mt-4">
                                    <button className="border px-6 py-2 rounded-full text-base text-black bg-white hover:bg-gray-100 transition-colors">
                                        Check Displays
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-center items-center p-4">
                                <Image src="/macbook.png" alt="monitor" width={411} height={300} quality={90} priority className="object-contain mix-blend-multiply" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-[#f7f7f7] rounded-3xl overflow-hidden flex justify-center items-center p-4">
                                <Image src="/whiteHeadphone.png" alt="headphone" width={350} height={150} quality={90} priority className="object-contain mix-blend-multiply" />
                            </div>
                            <div className="bg-[#f7f7f7] rounded-3xl overflow-hidden flex justify-center items-center p-4">
                                <Image src="/iphonepro.png" alt="Smartphone" width={350} height={150} quality={90} priority className="object-contain mix-blend-multiply" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
