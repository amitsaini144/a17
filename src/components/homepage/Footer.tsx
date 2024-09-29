import Image from "next/image";
import Link from "next/link";
import { Icons } from "./Icons";

export default function Footer() {
    return (
        <footer className="flex flex-col gap-6 w-full px-4 md:px-6 xl:px-10 pb-14 bg-white max-w-[1349px] mx-auto">
            <div className="flex flex-col xl:flex-row gap-10 md:gap-0 bg-[#f7f7f7] rounded-3xl justify-between p-4">
                <div className="md:p-4 md:pr-0 xl:p-10 flex flex-col md:flex-row xl:flex-col justify-between gap-4 h-fit">
                    <div className="flex flex-col gap-4 text-black">
                        <h2 className="text-2xl font-semibold">a17</h2>
                        <p className="text-[18px]">Selling premium products, designed<br /> to elevate your everyday experience</p>
                        <hr className="block md:hidden xl:block" />
                    </div>
                    <div className="flex gap-3 w-fit items-end justify-center i text-black">
                        <Link href="https://github.com/amitsaini144" className="bg-[#E6E6E6] rounded-full p-3" target="_blank" rel="noreferrer">
                            <Icons.gitHub className="h-5 w-5" />
                            <span className="sr-only">Facebook</span>
                        </Link>
                        <Link href="/" className="bg-[#E6E6E6] rounded-full p-3">
                            <Icons.instagram className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </Link>
                        <Link href="https://www.linkedin.com/in/amitsaini144" className="bg-[#E6E6E6] rounded-full p-3" target="_blank" rel="noreferrer">
                            <Icons.linkedin className="h-5 w-5" />
                            <span className="sr-only">Linkedin</span>
                        </Link>
                        <Link href="https://x.com/amitsaini_144" className="bg-[#E6E6E6] rounded-full p-3" target="_blank" rel="noreferrer">
                            <Icons.twitter className="h-4 w-4" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-0">
                    <div className="flex gap-20 p-0 md:p-4 xl:p-10 xl:pr-20 text-[#4a4a4a]">
                        <div className="flex flex-col gap-6">
                            <p className="text-[18px] font-medium">Pages</p>
                            <div className="flex flex-col gap-4">
                                <Link href="/">Home</Link>
                                <Link href="/shop">Shop</Link>
                                <Link href="/about">About</Link>
                                <Link href="/blog">Blog</Link>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between">
                            <p className="text-[18px] font-medium">Support</p>
                            <div className="flex flex-col gap-4">
                                <Link href="/faq">FAQ</Link>
                                <Link href="/contact">Contact</Link>
                                <Link href="/">Product</Link>
                                <Link href="/">404</Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Image src="/map.png" alt="logo" width={400} height={100} quality={90} priority className="object-cover h-[211px] md:h-[227px] xl:h-[280px] rounded-2xl" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-6 items-center text-[#171717]">
                <div className="flex gap-2">
                    <p>2024 design by</p>
                    <Link href="https://x.com/tolvstudio" target="_blank" rel="noreferrer">
                        tolv.studio
                    </Link>
                </div>
                <div className="flex gap-10">
                    <Link href="/">Terms & conditions</Link>
                    <Link href="/">Cookies</Link>
                    <Link href="/">Privacy policy</Link>
                </div>
            </div>
        </footer>
    )
}