import { StaticImageData } from "next/image";

export interface CardWithButtonProps {
    image: StaticImageData;
    label: string;
}
export interface navbarItem {
    href: string;
    label: string;
}

export interface CarouselProps {
    id: number,
    slug: string,
    label: string,
    image: StaticImageData,
    price: string,
}

export interface product {
    id: number,
    slug: string,
    label: string,
    image: StaticImageData,
    subimages: StaticImageData[],
    price: string,
}