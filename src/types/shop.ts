import { StaticImageData } from "next/image";

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

export interface Item {
    id: number;
    icon: React.ElementType;
    text: string;
    description?: string[];
    href: string;
}

export interface ModalProps {
    isOpen: boolean,
    onClose: () => void,
    Icon: React.ElementType,
    title: string,
    description?: string[],
}