import Image from "next/image"
import { CardWithButtonProps } from "@/types/home";
import Link from "next/link";

export default function CardWithButton({ image, label, href }: CardWithButtonProps) {
    return (
        <div className="bg-[#f7f7f7] rounded-3xl overflow-hidden flex flex-col items-center">
            <Image src={image}
                alt={label}
                width={300}
                height={150}
                quality={90}
                loading="lazy"
                placeholder="blur"
                className="object-cover mix-blend-multiply overflow-hidden" />
            <div className="-mt-12 z-10 pb-8">
                <Link href={href}>
                    <button className="border px-9 py-4 rounded-full text-black bg-white hover:bg-gray-100 transition-colors">
                        {label}
                    </button>
                </Link>
            </div>
        </div>
    )
}