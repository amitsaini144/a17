import { StaticImageData } from "next/image";

export interface CardWithButtonProps {
    image: StaticImageData;
    label: string;
}
export interface navbarItem {
    href: string;
    label: string;
}

export interface product {
    id: number,
    slug: string,
    label: string,
    href: string,
    image: StaticImageData,
    price: string,
}