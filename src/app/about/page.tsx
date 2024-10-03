import Image from "next/image"
import { TruckIcon, CreditCardIcon, Undo2Icon } from "lucide-react"
import SmallCard from "@/components/about/SmallCard"
import LargeCard from "@/components/about/LargeCard"

const smallCardInfo = [
    { id: 1, svg: TruckIcon, title: 'Free Shipping', description: '$24+ orders ship free' },
    { id: 2, svg: CreditCardIcon, title: 'Secure Payments', description: 'Trusted payment options' },
    { id: 3, svg: Undo2Icon, title: '45 Days Free Return', description: 'Easy, risk-free returns' },
]

const largeCardInfo = [
    { id: 1, img: '/exclusive.png', title: 'Exclusive Range', description: 'Immerse yourself in our meticulously curated selection, backed by over 20 years of industry experience.' },
    { id: 2, img: '/enduring.png', title: 'Enduring Innovation', description: 'Our products transcend fleeting trends, embodying timeless innovation that ensures they remain relevant and cutting-edge for years.' },
    { id: 3, img: '/ethical.png', title: 'Ethical Sourcing', description: 'Shop with confidence knowing that our products are sourced from reputable factories worldwide, adhering to stringent compliance standards.' }
]

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
                    <Image src="/about.png" alt="about" width={1200} height={500} quality={100} priority className="object-cover w-full h-[400px] md:h-[460px] xl:h-[670px] rounded-3xl " />
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
            </div>
        </div>

    )
}