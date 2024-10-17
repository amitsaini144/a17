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

export interface product {
    id: number,
    slug: string,
    label: string,
    image: StaticImageData,
    cover: StaticImageData,
    subimages: StaticImageData[],
    price: string,
    description: string,
    category: string,
}

export interface review {
    id: number,
    userName: string,
    review: string,
}

export interface featureCard {
    id: number,
    img: StaticImageData,
    title: string,
    description: string,
    category: string,   
}