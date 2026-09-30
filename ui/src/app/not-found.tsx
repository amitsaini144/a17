import Link from "next/link"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center w-full min-w-[320px]">
            <div className="flex flex-col items-center gap-6 w-full max-w-8xl py-32 px-4 text-center">
                <h1 className="text-[40px] text-black font-medium leading-tight">Page not found</h1>
                <p className="text-lg text-[#4a4a4a]">The page you are looking for doesn&apos;t exist or has moved.</p>
                <Link href="/shop" className="px-8 py-3 bg-black text-white rounded-full text-lg">
                    Back to shop
                </Link>
            </div>
        </div>
    )
}
