import Image from "next/image";


export default function CategorySection() {
    return (
        <div className="w-full px-10 py-10 bg-white">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[40px] text-black font-medium">Browse by categories</h1>
                    <p className="text-xl">Explore our diverse range of categories tailored to meet your specific needs and interests.</p>
                </div>

                <div className="flex gap-5">
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-5 bg-[#f7f7f7] p-10 rounded-t-3xl">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-2xl text-black font-medium">All products</h2>
                                <p className="text-base">Discover endless possibilities with our All Products category. Shop now for everything you need in one convenient place.</p>
                            </div>
                            <div className="xl:flex-shrink-0 w-fit">
                                <button className="border px-7 py-3 rounded-full text-lg bg-white">
                                    Browse all products
                                </button>
                            </div>
                        </div>
                        <div className="bg-[#f7f7f7] rounded-b-3xl">
                            <Image src="/ultrawatch.png" alt="Headphones x-28m" width={612} height={360} quality={90} priority />
                        </div>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="flex">
                            <div className="flex flex-col justify-between bg-[#f7f7f7] p-10 pr-0 rounded-l-3xl">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-2xl text-black font-medium">Displays</h2>
                                    <p className="text-base">Experience crystal-clear clarity and vibrant visuals with our Displays.</p>
                                </div>
                                <div className="xl:flex-shrink-0 w-fit">
                                    <button className="border px-7 py-3 rounded-full text-lg bg-white">
                                        Check Displays
                                    </button>
                                </div>
                            </div>
                            <div className="bg-[#f7f7f7] rounded-r-3xl">
                                <Image src="/macbook.png" alt="monitor" width={411} height={300} quality={90} priority className="mix-blend-darken" />
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="bg-[#f7f7f7] rounded-3xl overflow-hidden">
                                <Image src="/whiteHeadphone.png" alt="headphone" width={294} height={600} quality={90} priority className="mix-blend-multiply" />
                            </div>
                            <div className="bg-[#f7f7f7] rounded-3xl overflow-hidden">
                                <Image src="/iphonepro.png" alt="phone" width={294} height={600} quality={90} priority className="mix-blend-multiply" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
