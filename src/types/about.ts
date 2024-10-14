import { StaticImageData } from "next/image"

export interface largeCard {
    id: number,
    img: StaticImageData
    title: string,
    description: string
}

export interface smallCard {
    id: number,
    svg: React.FC<React.SVGProps<SVGSVGElement>>,
    title: string,
    description: string
}