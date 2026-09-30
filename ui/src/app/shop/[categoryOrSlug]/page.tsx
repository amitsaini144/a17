import type { Metadata } from "next"
import { notFound } from "next/navigation"
import FilteredPage from "@/components/shop/FilteredPage"
import ProductPage from "@/components/shop/ProductPage"
import {
    getCategories,
    getCategory,
    getProduct,
    getProductsByCategory,
    getRelatedProducts,
} from "@/lib/api/catalog"
import { isNotFound } from "@/lib/api/client"

// Rendered per request: catalog data must be current, and builds must not depend on the API.
export const dynamic = "force-dynamic"

type Props = { params: { categoryOrSlug: string } }

// `/shop/<slug>` is either a category listing or a product page.
async function findCategory(slug: string) {
    const categories = await getCategories()
    return categories.find((category) => category.slug === slug)
}

async function getProductOrNotFound(slug: string) {
    try {
        return await getProduct(slug)
    } catch (error) {
        if (isNotFound(error)) notFound()
        throw error
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const category = await findCategory(params.categoryOrSlug)
    if (category) return { title: `${category.name} - A17` }

    const product = await getProductOrNotFound(params.categoryOrSlug)
    return { title: `${product.name} - A17`, description: product.description }
}

export default async function CategoryOrProductPage({ params }: Props) {
    const slug = params.categoryOrSlug

    if (await findCategory(slug)) {
        const [products, categories] = await Promise.all([getProductsByCategory(slug), getCategories()])
        return <FilteredPage products={products} categories={categories} />
    }

    const product = await getProductOrNotFound(slug)
    const [category, related] = await Promise.all([
        getCategory(product.category.slug),
        getRelatedProducts(slug),
    ])
    return <ProductPage product={product} features={category.features} related={related} />
}
