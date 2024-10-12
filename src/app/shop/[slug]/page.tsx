import { shopProducts } from "@/data/shopData"
import ProductPage from "@/components/shop/ProductPage"

function getProductBySlug(slug: string) {
    return shopProducts.find(product => product.slug === slug);
}

export async function generateStaticParams() {
    return shopProducts.map((product) => ({
        slug: product.slug,
    }))
}

export default function Product({ params }: { params: { slug: string } }) {
    const product = getProductBySlug(params.slug)

    if (!product) {
        return (
            <div className="flex flex-col items-center w-full min-w-[320px]">
                <div className="w-full max-w-[1349px]">
                    <h1 className='text-[40px] text-black font-medium leading-tight py-32 text-center'>Post not found</h1>
                </div>
            </div>
        )
    }

    return <ProductPage product={product} />
}