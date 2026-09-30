"use client"

import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center w-full min-w-[320px]">
            <div className="flex flex-col items-center gap-6 w-full max-w-8xl py-32 px-4 text-center">
                <h1 className="text-[40px] text-black font-medium leading-tight">Something went wrong</h1>
                <p className="text-lg text-[#4a4a4a]">We couldn&apos;t load this page. Please try again in a moment.</p>
                <button onClick={reset} className="px-8 py-3 bg-black text-white rounded-full text-lg">
                    Try again
                </button>
            </div>
        </div>
    )
}
