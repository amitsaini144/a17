import { articles } from '@/data/blogData'
import BlogPost from '@/components/blog/BlogPost'

function getPostBySlug(slug: string) {
    return articles.find(article => article.slug === slug);
}

export async function generateStaticParams() {
    return articles.map((article) => ({
        slug: article.slug,
    }))
}

export default function Post({ params }: { params: { slug: string } }) {
    const post = getPostBySlug(params.slug)

    if (!post) {
        return (
            <div className="flex flex-col items-center w-full min-w-[320px]">
                <div className="w-full max-w-[1349px]">
                    <h1 className='text-[40px] text-black font-medium leading-tight py-32 text-center'>Post not found</h1>
                </div>
            </div>
        )
    }

    return <BlogPost post={post} params={params} />
}