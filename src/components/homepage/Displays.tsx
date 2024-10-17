import Image from "next/image"
import macbook from "../../../public/images/monitor/macbook.png"
import Link from "next/link"

export default function Displays() {
    return (
        <div className="flex flex-col md:flex-row bg-[#f7f7f7] rounded-3xl overflow-hidden xl:h-1/2 justify-between">
            <div className="flex flex-col justify-between p-6 md:p-10 gap-6 md:pr-0 w-full md:w-1/2 ">
                <div className="flex flex-col gap-2 text-black">
                    <h2 className="text-xl md:text-2xl font-medium">Displays</h2>
                    <p className="text-sm md:text-base">Experience crystal-clear clarity and <br className="xl:hidden" /> vibrant visuals with our Displays.</p>
                </div>
                <div className="mt-4">
                    <Link href="/shop/monitor">
                        <button className="border px-9 py-4 rounded-full text-black bg-white hover:bg-gray-100 transition-colors">
                            Check Displays
                        </button>
                    </Link>
                </div>
            </div>
            <Image
                src={macbook}
                alt="monitor"
                width={300}
                height={300}
                quality={90}
                loading="lazy"
                placeholder="blur"
                className="object-contain mix-blend-multiply w-full md:w-1/2 max-h-[270px] md:max-h-[300px]" />
        </div>
    )
}