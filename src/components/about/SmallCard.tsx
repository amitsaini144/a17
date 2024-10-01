import React from "react";

interface Card {
    id: number,
    svg: React.FC<React.SVGProps<SVGSVGElement>>,
    title: string,
    description: string
}

export default function SmallCard({ card }: { card: Card }) {
    return (
        <div className="flex md:flex-col xl:flex-row p-2 md:p-4 gap-2 md:w-1/3 items-center">
            <div className="flex items-center justify-center w-16 h-16 ">
                <card.svg className=" text-black w-8 h-8" />
            </div>
            <div className="flex flex-col text-black gap-1 md:text-lg w-full md:text-center xl:text-start">
                <p className="font-medium">{card.title}</p>
                <p>{card.description}</p>
            </div>
        </div>
    )
}