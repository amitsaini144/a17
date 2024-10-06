import { articles } from "@/data/blogData";
import BlogCard from "@/components/blogpage/BlogCard"

export default function Blog() {
    return (
        <div className="flex flex-col items-center w-full min-w-[320px] bg-white">
            <div className="w-full max-w-[1349px]">
                <div className="w-full flex flex-col gap-12 px-4 md:px-6 xl:px-10 pt-32 md:pt-40">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-6xl text-black font-semibold">Blog</h1>
                        <p className="text-xl text-[#4a4a4a]">Stay informed with our bite-sized articles</p>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-6">
                        {articles.map((article) => (
                            <div className="" key={article.id}>
                                <BlogCard {...article} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}