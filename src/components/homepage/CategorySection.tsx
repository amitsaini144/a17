import Image from "next/image";


export default function CategorySection() {
    return (
        <div className="w-full px-4 md:px-6 xl:px-10 py-10 bg-white">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2 text-black">
                    <h1 className="text-[40px] font-medium">Browse by categories</h1>
                    <p className="text-xl">Explore our diverse range of categories tailored to meet your specific needs and interests.</p>
                </div>

                <div className="flex flex-col xl:flex-row gap-5">
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-5 bg-[#f7f7f7] p-10 rounded-t-3xl">
                            <div className="flex flex-col gap-2 text-black">
                                <h2 className="text-2xl font-medium">All products</h2>
                                <p className="text-base">Discover endless possibilities with our All Products category. Shop now for everything you need in one convenient place.</p>
                            </div>
                            <div className="xl:flex-shrink-0 w-fit">
                                <button className="border px-7 py-3 rounded-full text-lg text-black bg-white">
                                    Browse all products
                                </button>
                            </div>
                        </div>
                        <div className="bg-[#f7f7f7] rounded-b-3xl">
                            <Image src="/ultrawatch.png" alt="Headphones x-28m" width={612} height={360} quality={100} priority className="w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row">
                            <div className="flex flex-col justify-between bg-[#f7f7f7] p-10 md:pr-0 rounded-l-3xl">
                                <div className="flex flex-col gap-2 text-black">
                                    <h2 className="text-2xl font-medium">Displays</h2>
                                    <p className="text-base">Experience crystal-clear clarity and vibrant visuals with our Displays.</p>
                                </div>
                                <div className="xl:flex-shrink-0 w-fit">
                                    <button className="border px-7 py-3 rounded-full text-lg text-black bg-white">
                                        Check Displays
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[#f7f7f7] rounded-r-3xl flex justify-center">
                                <Image src="/macbook.png" alt="monitor" width={411} height={300} quality={90} priority className="mix-blend-darken" />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="bg-[#f7f7f7] rounded-3xl overflow-hidden flex justify-center">
                                <Image src="/whiteHeadphone.png" alt="headphone" width={294} height={600} quality={90} priority className="mix-blend-multiply w-fit h-fit" />
                            </div>
                            <div className="bg-[#f7f7f7] rounded-3xl overflow-hidden flex justify-center">
                                <Image src="/iphonepro.png" alt="phone" width={294} height={600} quality={90} priority className="mix-blend-multiply w-fit h-fit" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
