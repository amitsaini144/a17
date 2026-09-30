"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from "@/data/shopData";

export default function CategoryLinks() {
    const currentCategory = usePathname().split('/')[2];

    return (
        <div className="flex gap-2 md:gap-1 xl:gap-3 text-sm md:text-base overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
                <Link
                    key={category.slug}
                    href={`/shop${category.slug ? `/${category.slug}` : ''}`}
                    className={`border px-8 py-3 rounded-full flex-shrink-0 ${currentCategory === category.slug
                        ? 'bg-black text-white'
                        : 'text-black'
                        }`}
                >
                    <p>{category.name}</p>
                </Link>
            ))}
        </div>
    );
}