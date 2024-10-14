import { DotIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ShieldCheckIcon, ArrowRightIcon, Package, HeadsetIcon } from "lucide-react"
import { product } from "@/types/home"

export default function ProductPage({ product }: { product: product }) {
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
                    <div className="flex flex-col xl:flex-row gap-10 w-full">
                        <div className="flex flex-col-reverse md:flex-row gap-4">
                            <div className="flex md:flex-col justify-between md:justify-around gap-2 md:gap-3">
                                {[0, 1, 2].map((index) => (
                                    <Image
                                        key={index}
                                        src={product.subimages[index]}
                                        alt={product.label}
                                        width={180}
                                        height={240}
                                        quality={90}
                                        loading="lazy"
                                        placeholder="blur"
                                        className="rounded-2xl object-cover min-w-[145px] w-1/3 h-[150px] md:w-[200px] md:h-[240px] xl:h-[180px]" />
                                ))}
                            </div>
                            <div className="xl:h-full">
                                <Image
                                    src={product.image}
                                    alt={product.label}
                                    width={485}
                                    height={600}
                                    quality={90}
                                    priority
                                    placeholder="blur"
                                    className="rounded-3xl object-cover w-full h-[500px] md:w-[930px] md:h-[744px] xl:h-full xl:w-full" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 flex-1">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-[32px] xl:text-[40px] text-black leading-tight w-fit">{product.label}</h1>
                                <p className="text-sm md:text-base text-[#1f1f1f]">Upgrade your workspace with the eDisplay XS and take your productivity to new heights.</p>
                            </div>
                            <h2 className="text-2xl md:text-[28px] xl:text-[32px] text-black w-fit">USD {product.price}</h2>
                            <div className="flex flex-col w-full gap-4 items-center">
                                <Link href={`/shop/${product.id}`} className="text-white bg-black text-center px-9 py-[18px] rounded-full w-full md:text-[18px]">
                                    Buy now
                                </Link>
                                <div className="flex flex-col gap-1 text-center text-[#7f7f7f] text-[12px] md:text-sm w-full">
                                    <p>Estimate delivery times: 3-6 days (International)</p>
                                    <p>Return within 45 days of purchase. Duties & taxes are non-refundable.</p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-end flex-1">
                                <div className="flex flex-col gap-4">
                                    {[
                                        { icon: ShieldCheckIcon, text: 'Warranty' },
                                        { icon: Package, text: 'Shipping & delivery' },
                                        { icon: HeadsetIcon, text: 'Support' },
                                    ].map((item, index) => (
                                        <div key={index}>
                                            <div className="flex gap-2 justify-between py-4">
                                                <div className="flex gap-2 items-center text-black">
                                                    <item.icon className="w-6 h-6" />
                                                    <p className="text-sm md:text-base">{item.text}</p>
                                                </div>
                                                <ArrowRightIcon className="w-6 h-6 text-black" />
                                            </div>
                                            {index < 2 && <div className="flex bg-[#e6e6e6] h-[1px] w-full"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}