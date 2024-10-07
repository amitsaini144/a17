import { articles, getPostBySlug } from '@/data/blogData'
import BlogPost from '@/components/blog/BlogPost'

export async function generateStaticParams() {
    return articles.map((article) => ({
        slug: article.slug,
    }))
}

export default function Post({ params }: { params: { slug: string } }) {
    const post = getPostBySlug(params.slug)

    if (!post) {
        return <div>Post not found</div>
    }

    return <BlogPost post={post} />
}