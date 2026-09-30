import type { CategoryFeature } from "@/lib/api/client"
import Image from "next/image"

export function FeatureCard({ card }: { card: CategoryFeature }) {
    return (
        <div className="flex flex-col gap-4 xl:w-1/3 w-full">
            <Image
            src={card.image_url}
            alt={card.title}
            width={1125}
            height={450}
            quality={90}
            loading="lazy"
            className="object-cover w-full h-[450px] xl:h-96 rounded-3xl" />
            <div className="flex flex-col gap-2">
                <h4 className="text-xl md:text-2xl font-medium text-black">{card.title}</h4>
                <p className="md:text-lg text-[#4a4a4a] md:leading-tight">{card.description}</p>
            </div>
        </div>
    )}
