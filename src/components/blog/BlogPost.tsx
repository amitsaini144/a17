import { article } from '@/types/blog'
import { articles } from "@/data/blogData"
import Image from 'next/image'
import Link from 'next/link'
import BlogCard from './BlogCard'
import { DotIcon } from 'lucide-react'

function getOtherPostBySlug(slug: string) {
    return articles.filter(article => article.slug !== slug);
}

export default function BlogPost({ post, params }: { post: article, params: { slug: string } }) {
    const otherArticles = getOtherPostBySlug(params.slug)

    return (
        <div className="flex flex-col items-center w-full min-w-[320px]">
            <div className="w-full max-w-[1349px]">
                <div className="w-full flex flex-col gap-12 px-4 md:px-6 xl:px-10 pt-32">
                    <div className="flex flex-col md:text-center md:justify-center gap-6">
                        <div className="flex gap-1 w-full md:justify-center items-center text-[12px] md:text-sm">
                            <Link href="/" className="w-fit text-[#7f7f7f]">Home</Link>
                            <DotIcon className="w-4 h-4 text-[#bebebe]" />
                            <Link href="/blog" className="text-[#7f7f7f]">Blog</Link>
                            <DotIcon className="w-4 h-4 text-[#bebebe]" />
                            <span className="text-black">{post.label}</span>
                        </div>
                        <div className="flex flex-col gap-2 md:items-center">
                            <h1 className="text-[40px] md:text-5xl xl:text-[64px] font-medium md:w-[80%] lg:w-[75%] xl:w-[65%] leading-tight md:leading-tight text-black">{post.label}</h1>
                            <p className="text-sm md:text-base text-[#4a4a4a]">{post.date}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col px-4 md:px-10 pt-6 md:pt-10 pb-16 gap-6">
                    <Image
                        src={post.image}
                        alt={post.label}
                        width={1200}
                        height={500}
                        quality={100}
                        priority
                        placeholder='blur'
                        className="object-cover w-full h-[400px] md:h-[460px] xl:h-[670px] rounded-3xl"
                    />
                    <div className="flex flex-col p-6 md:px-20 md:py-10 justify-start items-center bg-[#f7f7f7] rounded-3xl">
                        <div className="flex flex-col gap-24 md:w-[80%] text-black">
                            {post.content.map((section, index) => (
                                <div key={index} className="flex flex-col gap-4 text-black">
                                    {section.title && <h3 className="text-2xl md:text-[32px] font-semibold">{section.title}</h3>}
                                    <p className="text-lg">{section.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col px-4 md:px-10 pb-0 pt-6 md:pt-10 gap-6'>
                    <div className='flex flex-col gap-10'>
                        <h2 className='text-[40px] text-black font-medium leading-tight'>Check out other<br /> items from our blog</h2>
                        <div className="flex flex-col md:flex-row justify-start items-center gap-4">
                            {otherArticles.map((article) => (
                                <div key={article.id}>
                                    <BlogCard {...article} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}