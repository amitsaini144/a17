import Image from "next/image"

interface CardWithButtonProps {
    image: string;
    label: string;
}

export default function CardWithButton( { image, label }: CardWithButtonProps ) {
    return (
        <div className="bg-[#f7f7f7] rounded-3xl overflow-hidden flex flex-col items-center">
            <Image src={image} alt={label} width={300} height={150} quality={90} priority className="object-contain mix-blend-multiply overflow-hidden" />
            <div className="-mt-12 z-10 pb-8">
                <button className="border px-9 py-4 rounded-full text-base text-black bg-white hover:bg-gray-100 transition-colors">
                    {label}
                </button>
            </div>
        </div>
    )
}