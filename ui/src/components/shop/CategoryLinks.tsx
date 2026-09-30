"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Category } from "@/lib/api/client";

export default function CategoryLinks({ categories }: { categories: Category[] }) {
    // "" on /shop (all products), otherwise the category slug from /shop/<slug>.
    const currentCategory = usePathname().split('/')[2] ?? '';
    const links = [{ name: 'All products', slug: '' }, ...categories];

    return (
        <div className="flex gap-2 md:gap-1 xl:gap-3 text-sm md:text-base overflow-x-auto scrollbar-hide">
            {links.map((category) => (
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
