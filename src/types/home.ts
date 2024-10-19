import { StaticImageData } from "next/image";

export interface CardWithButtonProps {
    image: StaticImageData;
    label: string;
    href: string;
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