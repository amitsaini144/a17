import { article } from '@/types/blog'
import Image from 'next/image'
import Link from 'next/link'

export default function BlogPost({ post }: { post: article }) {
    return (
        <div className="flex flex-col items-center w-full min-w-[320px]">
            <div className="w-full max-w-[1349px]">
                <div className="w-full flex flex-col gap-12 px-4 md:px-6 xl:px-10 pt-32">
                    <div className="flex flex-col md:text-center md:justify-center gap-6">
                        <div className="flex gap-4 w-full md:justify-center text-[12px] md:text-sm">
                            <Link href="/blog" className="w-fit text-black">Home</Link>
                            <Link href="/blog" className="text-black">Blog</Link>
                            <span className="text-black">{post.label}</span>
                        </div>
                        <div className="flex flex-col gap-2 md:items-center">
                            <h1 className="text-[40px] md:text-5xl xl:text-[64px] font-medium md:w-[80%] lg:w-[75%] xl:w-[65%] leading-tight md:leading-tight">{post.label}</h1>
                            <p className="text-sm md:text-base text-[#4a4a4a]">{post.date}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col px-10 pt-10 pb-0 gap-6">
                    <Image
                        src={post.image}
                        alt={post.label}
                        width={1200}
                        height={500}
                        quality={100}
                        priority
                        className="object-cover w-full h-[400px] md:h-[460px] xl:h-[670px] rounded-3xl"
                    />
                    <div className="flex flex-col px-20 py-10 justify-start items-center bg-[#f7f7f7] rounded-3xl">
                        <div className="flex flex-col gap-20 w-[80%] text-black">
                            {post.content.map((section, index) => (
                                <div key={index} className="flex flex-col gap-4 text-black">
                                    {section.title && <h3 className="text-[32px] font-medium">{section.title}</h3>}
                                    <p className="text-xl">{section.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}