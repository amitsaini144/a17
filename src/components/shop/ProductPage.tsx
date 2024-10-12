import { DotIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ShieldCheckIcon, ArrowRightIcon, Package, HeadsetIcon } from "lucide-react"

export default function ProductPage({ product }: { product: any }) {
    return (
        <div className="flex flex-col items-center w-full min-w-[320px]">
            <div className="w-full max-w-[1349px]">
                <div className="w-full flex flex-col gap-6 px-4 md:px-6 xl:px-10 pt-32">
                    <div className="flex w-full items-center text-[12px] md:text-sm">
                        <Link href="/" className="w-fit text-[#7f7f7f]">Home</Link>
                        <DotIcon className="w-4 h-4 text-[#bebebe]" />
                        <Link href="/shop" className="text-[#7f7f7f]">Shop</Link>
                        <DotIcon className="w-4 h-4 text-[#bebebe]" />
                        <span className="text-black">{product.label}</span>
                    </div>
                    <div className="flex gap-12 w-full">
                        <div className="flex gap-4 ">
                            <div className="flex flex-col gap-4">
                                <Image src={product.image} alt={product.label} width={180} height={400} quality={90} priority placeholder="blur" className="rounded-3xl object-cover h-1/3" />
                                <Image src={product.image} alt={product.label} width={180} height={400} quality={90} priority placeholder="blur" className="rounded-3xl object-cover h-1/2" />
                                <Image src={product.image} alt={product.label} width={180} height={400} quality={90} priority placeholder="blur" className="rounded-3xl object-cover h-1/3" />

                            </div>
                            <div>
                                <Image src={product.image} alt={product.label} width={485} height={400} quality={90} priority placeholder="blur" className="rounded-3xl object-cover" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-[32px] text-black">{product.label}</h1>
                                <p className="text-[#1f1f1f]">Upgrade your workspace with the eDisplay XS and take your productivity to new heights.</p>
                            </div>
                            <h2 className="text-[32px] text-black w-fit">USD {product.price}</h2>
                            <div className="flex flex-col w-full gap-4 items-center">
                                <Link href={`/shop/${product.id}`} className="text-white bg-black text-center px-9 py-[18px] rounded-full w-full text-[18px]">
                                    Buy now
                                </Link>
                                <div className="flex flex-col gap-1 text-center text-[#7f7f7f] text-sm w-full">
                                    <p>Estimate delivery times: 3-6 days (International)</p>
                                    <p>Return within 45 days of purchase. Duties & taxes are non-refundable.</p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end h-full">
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2 justify-between py-4">
                                        <div className="flex gap-2 items-center text-black">
                                            <ShieldCheckIcon className="w-6 h-6" />
                                            <p>Warranty</p>
                                        </div>
                                        <ArrowRightIcon className="w-6 h-6 text-black" />
                                    </div>
                                    <div className="flex bg-[#e6e6e6] h-[1px] w-full"></div>
                                    <div className="flex gap-2 items-center justify-between py-4">
                                        <div className="flex gap-2 items-center text-black">
                                            <Package className="w-6 h-6" />
                                            <p>Shipping & delivery</p>
                                        </div>
                                        <ArrowRightIcon className="w-6 h-6 text-black" />
                                    </div>
                                    <div className="flex bg-[#e6e6e6] h-[1px] w-full"></div>
                                    <div className="flex gap-2 items-center justify-between py-4">
                                        <div className="flex gap-2 items-center text-black">
                                            <HeadsetIcon className="w-6 h-6" />
                                            <p>Support</p>
                                        </div>
                                        <ArrowRightIcon className="w-6 h-6 text-black" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}