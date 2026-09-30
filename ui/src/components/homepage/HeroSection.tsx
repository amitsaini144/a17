import Link from "next/link";

export default function HeroSection() {
    return (
        <section className="w-full px-4 md:px-6 xl:px-10 pt-32 md:pt-40">
            <div className="flex flex-col xl:flex-row gap-6 xl:items-end text-black">
                <div className="flex flex-col gap-5 w-full">
                    <h1 className="text-[40px] md:text-5xl xl:text-[64px] font-medium md:leading-tight leading-tight">
                        Elevate your lifestyle<br className="hidden xl:inline" /> with premium essentials.
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed">
                        Elevate your daily routine with our meticulously <br className="hidden md:inline" /> selected premium goods and curated essentials.
                    </p>
                </div>
                <Link href="/shop" className="xl:flex-shrink-0 w-fit">
                    <button className="border border-black px-8 py-4 rounded-full text-lg">
                        Browse all products
                    </button>
                </Link>
            </div>
        </section>
    )
}