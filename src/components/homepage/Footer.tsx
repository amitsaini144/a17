import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full px-4 md:px-6 xl:px-10 pb-16 bg-white">
            <div className="flex flex-col xl:flex-row bg-[#f7f7f7] rounded-3xl justify-between p-4">
                <div className="p-10 flex flex-col md:flex-row xl:flex-col justify-between gap-4 h-fit">
                    <div className="flex flex-col gap-4 text-black">
                        <h2 className="text-2xl font-semibold">a17</h2>
                        <p className="text-[18px]">Selling premium products, designed<br /> to elevate your everyday experience</p>
                        <hr className="block md:hidden xl:block" />
                    </div>
                    <div className="flex gap-4 w-fit items-end text-black">
                        <Link href="/">Home</Link>
                        <Link href="/">About</Link>
                        <Link href="/">Blog</Link>
                        <Link href="/">Contact</Link>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-around">
                    <div className="flex gap-20 p-10 pr-20 text-[#4a4a4a]">
                        <div className="flex flex-col gap-6">
                            <p className="text-[18px] font-medium">Pages</p>
                            <div className="flex flex-col gap-4">
                                <Link href="/">Home</Link>
                                <Link href="/">Shop</Link>
                                <Link href="/">About</Link>
                                <Link href="/">Blog</Link>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <p className="text-[18px] font-medium">Support</p>
                            <div className="flex flex-col gap-4">
                                <Link href="/">FAQ</Link>
                                <Link href="/">Contact</Link>
                                <Link href="/">Product</Link>
                                <Link href="/">404</Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Image src="/map.png" alt="logo" width={400} height={100} quality={90} priority className="object-cover h-[280px] rounded-2xl" />
                    </div>
                </div>
            </div>
        </footer>
    )
}