import type { Category } from "@/lib/api/client"
import CategoryLinks from "./CategoryLinks"
import SearchButton from "./SearchButton"

// Heading and controls around a product listing. Shared by the real listing and its loading
// state, so category links and search stay usable while products load.
export default function ShopShell({ categories, children }: { categories: Category[], children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center w-full min-w-[320px] bg-white">
            <div className="w-full max-w-8xl">
                <div className="flex flex-col px-4 md:px-6 xl:px-10 pt-[120px] md:pt-40 pb-0 gap-10">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[40px] xl:text-[64px] text-black font-medium">Shop</h1>
                        <p className="text-lg md:text-xl text-[#4a4a4a]">Check out our full collection of products tailored to your needs</p>
                    </div>
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-row-reverse md:flex-row justify-between gap-4">
                            <CategoryLinks categories={categories} />
                            <SearchButton />
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
