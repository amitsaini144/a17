"use client"

import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import type { User } from "@/lib/api/auth"
import { useAuth } from "./AuthProvider"

/**
 * Renders its children only for a logged-in user. The middleware already turns away visitors
 * without a session; this covers sessions that turn out to be expired or revoked.
 */
export default function RequireAuth({ children }: { children: (user: User) => React.ReactNode }) {
    const auth = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (auth.status === "anonymous") router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    }, [auth.status, pathname, router])

    if (auth.status !== "authenticated") {
        return (
            <div role="status" className="flex justify-center items-center gap-2 w-full py-40 text-[#7f7f7f]">
                <Loader2 aria-hidden className="w-5 h-5 animate-spin" />
                Loading your account…
            </div>
        )
    }
    return children(auth.user)
}
