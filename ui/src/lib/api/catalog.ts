import { cache } from "react";
import {
    apiGet,
    fetchProducts,
    type Category,
    type CategoryDetail,
    type ProductDetail,
    type ProductSummary,
} from "./client";

// Server-side data access. `cache` dedupes identical calls within one request
// (e.g. generateMetadata and the page both loading the same product).

export const getCategories = cache(() => apiGet<Category[]>("/categories"));

export const getCategory = cache((slug: string) =>
    apiGet<CategoryDetail>(`/categories/${encodeURIComponent(slug)}`),
);

export const getProduct = cache((slug: string) =>
    apiGet<ProductDetail>(`/products/${encodeURIComponent(slug)}`),
);

export function getRelatedProducts(slug: string, limit = 3) {
    return apiGet<ProductSummary[]>(`/products/${encodeURIComponent(slug)}/related?limit=${limit}`);
}

// The catalog is small; one page of the API's maximum size holds all of it.
const ALL = 100;

export async function getProductsByCategory(category?: string): Promise<ProductSummary[]> {
    return (await fetchProducts({ category, limit: ALL })).items;
}

export async function getFeaturedProducts(): Promise<ProductSummary[]> {
    return (await fetchProducts({ featured: true, limit: ALL })).items;
}
