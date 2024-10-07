export interface article {
    id: number;
    slug: string;
    label: string;
    href: string;
    image: string;
    date: string;
    content: Array<{ title?: string; text: string }>;
};
