import Image from "next/image"
import { smallCardInfo, largeCardInfo } from "@/data/aboutData";
import SmallCard from "@/components/about/SmallCard"
import LargeCard from "@/components/about/LargeCard"
import Link from "next/link"
import about from "../../../public/about.png"
import timeless from "../../../public/timeless.png"
import premium from "../../../public/premium.png"

export default function About() {
    return (
        <div className="flex flex-col items-center w-full min-w-[320px] bg-white">
            <div className="w-full max-w-[1349px]">
                <div className="w-full flex flex-col gap-12 px-4 md:px-10 pt-32 md:pt-40">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-[40px] md:text-5xl xl:text-[64px] text-black font-medium leading-tight">Accessible excellence:<br className="hidden xl:block" /> Perfect tech for everyone!</h1>
                        <p className="text-lg md:text-xl text-black">With over two decades of expertise, we&apos;ve meticulously crafted collections that epitomize<br className="hidden xl:block" /> enduring quality and technological innovation, catering to the diverse needs of our clients.</p>
                    </div>
                </div>
                <div className="flex px-4 pt-10 md:px-6 md:pt-10 xl:px-10 xl:pt-16 rounded-3xl">
                    <Image
                        src={about}
                        alt="about"
                        width={1200}
                        height={500}
                        quality={100}
                        placeholder="blur"
                        priority
                        className="object-cover w-full h-[400px] md:h-[460px] xl:h-[670px] rounded-3xl " />
                </div>
                <div className="flex px-4 py-6 md:px-6 md:py-10 xl:p-10">
                    <div className="flex flex-col md:flex-row xl:py-6 xl:px-20 w-full gap-2 md:gap-8">
                        {smallCardInfo.map((card) => (
                            <SmallCard key={card.id} card={card} />
                        ))}
                    </div>
                </div>
                <div className="flex px-4 md:px-6 xl:px-10 pb-[60px] pt-0 md:pt-6">
                    <div className="flex flex-col xl:flex-row gap-10 xl:gap-6 w-full">
                        {largeCardInfo.map((card) => (
                            <LargeCard key={card.id} card={card} />
                        ))}
                    </div>
                </div>
                <div className="flex px-4 pb-10 pt-0 md:px-6 md:py-10 xl:p-10">
                    <div className="flex flex-col md:flex-row w-full gap-6 md:gap-16 items-center">
                        <Image
                            src={premium}
                            alt="about"
                            width={760}
                            height={500}
                            quality={90}
                            placeholder="blur"
                            priority
                            className="object-cover w-full md:w-1/2 h-[390px] rounded-3xl " />
                        <div className="flex flex-col gap-6 text-center items-center justify-center h-fit md:w-1/2">
                            <h3 className="text-2xl md:text-[28px] xl:text-[32px] text-black">Premium Tech Selection</h3>
                            <p className="md:text-lg text-[#4a4a4a]">Our pursuit of excellence involves extensive exploration of top-tier factories globally, ensuring our tech lineup mirrors the standards upheld by renowned brands. We forge strong partnerships with these facilities, prioritizing factors like sustainability and ethical production practices.</p>
                            <Link href='/shop' className="border border-black px-8 py-4 rounded-full md:text-lg w-fit text-black">
                                Check our store
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex px-4 pb-0 pt-6 md:px-6 md:py-10 xl:p-10 xl:pb-0">
                    <div className="flex flex-col md:flex-row-reverse w-full gap-6 md:gap-16 items-center">
                        <Image
                            src={timeless}
                            alt="about"
                            width={760}
                            height={500}
                            quality={90}
                            placeholder="blur"
                            priority
                            className="object-cover w-full md:w-1/2 h-[390px] rounded-3xl " />
                        <div className="flex flex-col gap-6 text-center items-center justify-center h-fit md:w-1/2">
                            <h3 className="text-2xl md:text-[28px] xl:text-[32px] text-black">Timeless Tech Solutions</h3>
                            <p className="md:text-lg text-[#4a4a4a]">At A17, we eschew passing trends in favor of enduring value and utility. Our commitment? To offer tech solutions that seamlessly integrate into your life, promising years of reliable performance and timeless appeal.</p>
                            <Link href='/blog' className="border border-black px-8 py-4 rounded-full md:text-lg w-fit text-black">
                                Check our blog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}