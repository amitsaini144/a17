import { shopProducts } from "@/data/shopData"
import ProductPage from "@/components/shop/ProductPage"
import { product } from "@/types/shop";
import FilteredPage from "@/components/shop/FilteredPage";

type QueryResult =
    | { type: 'category'; product: product[] }
    | { type: 'product'; product: product }
    | { type: 'notFound' }

function getProductBySlug(slug: string): QueryResult {
    const categoryProducts = shopProducts.filter(product => product.category.toLowerCase() === slug.toLocaleLowerCase());

    if (categoryProducts.length > 0) {
        return { type: 'category', product: categoryProducts }
    }
    const singleProduct = shopProducts.find(product => product.slug === slug);

    if (singleProduct) {
        return { type: 'product', product: singleProduct }
    }
    return { type: 'notFound' }
}

export async function generateStaticParams() {
    return shopProducts.map((product) => ({
        slug: product.slug,
    }))
}

export default function HandleSlug({ params }: { params: { categoryOrSlug: string } }) {
    const { categoryOrSlug } = params;
    const result = getProductBySlug(categoryOrSlug)

    switch (result.type) {
        case 'category':
            return <FilteredPage products={result.product} />;
        case 'product':
            return <ProductPage currentProduct={result.product} allProducts={shopProducts} />;
        case 'notFound':
            return (
                <div className="flex flex-col items-center w-full min-w-[320px]">
                    <div className="w-full max-w-[1349px]">
                        <h1 className='text-[40px] text-black font-medium leading-tight py-32 text-center'>
                            Page not found: {categoryOrSlug}
                        </h1>
                    </div>
                </div>
            );
    }
}