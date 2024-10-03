import Image from "next/image"

interface Card {
    id: number,
    img: string,
    title: string,
    description: string
}

export default function LargeCard({ card }: { card: Card }) {
    return (
        <div className="flex flex-col gap-4 xl:w-1/3 w-full">
            <Image src={card.img} alt="image" width={1125} height={450} quality={90} priority className="object-cover w-full h-[450px] xl:h-96 rounded-3xl" />
            <div className="flex flex-col gap-2">
                <h4 className="text-xl md:text-2xl font-medium text-black">{card.title}</h4>
                <p className="md:text-lg text-[#4a4a4a]">{card.description}</p>
            </div>
        </div>
    )
}