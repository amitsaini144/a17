import { StaticImageData } from "next/image";

export interface article {
    id: number;
    slug: string;
    label: string;
    href: string;
    image: StaticImageData;
    date: string;
    content: Array<{ title?: string; text: string }>;
};
