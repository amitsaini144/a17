
export default function HeroSection() {
    return (
        <div className="w-full px-4 md:px-6 lg:px-10 pt-8 md:pt-14">
            <div className="flex flex-col xl:flex-row gap-6 xl:items-end text-black">
                <div className="flex flex-col gap-5 w-full lg:items-start">
                    <h1 className="text-[40px] md:text-5xl xl:text-[64px] font-medium leading-tight md:leading-tight xl:leading-tight">
                        Elevate your lifestyle<br className="hidden xl:inline" /> with premium essentials.
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed">
                        Elevate your daily routine with our meticulously <br className="hidden md:inline" /> selected premium goods and curated essentials.
                    </p>
                </div>
                <div className="xl:flex-shrink-0 w-fit">
                    <button className="border border-black px-7 py-4 rounded-full text-lg">
                        Browse all products
                    </button>
                </div>
            </div>
        </div>
    )
}