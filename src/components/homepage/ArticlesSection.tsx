import Link from "next/link"
import { articles } from "@/data/blogData"
import ArticleCard from "./ArticleCard"

export default function ArticlesSection() {
    return (
        <div className="w-full px-4 md:px-6 xl:px-10 pt-16 pb-6 xl:pb-16 bg-white">
            <div className="flex flex-col gap-10 justify-center">
                <div className="flex md:flex-row flex-col text-black justify-between gap-y-6">
                    <h2 className="text-4xl xl:text-[40px] font-medium ">Our articles and news</h2>
                    <Link href="/blog" className="xl:flex-shrink-0 w-fit">
                        <button className="border border-black px-8 py-4 rounded-full text-lg">
                            Check all
                        </button>
                    </Link>
                </div>

                <div className="flex gap-6 overflow-x-auto justify-around scrollbar-hide relative">
                    {articles.map((article) => (
                        <div className="flex-shrink-0" key={article.id}>
                            <ArticleCard {...article} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}