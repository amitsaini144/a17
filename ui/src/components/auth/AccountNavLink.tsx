"use client"

import { UserRound } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "./AuthProvider"

/** "Log in" (returning here afterwards) or "Account", depending on the session. */
export default function AccountNavLink({ className = "" }: { className?: string }) {
    const { status } = useAuth()
    const pathname = usePathname()

    // Reserve the space while the session loads, so the navbar doesn't shift or flash "Log in".
    if (status === "loading") {
        return <span aria-hidden className={`invisible ${className}`}>Log in</span>
    }
    if (status === "authenticated") {
        return (
            <Link href="/account" className={`flex items-center gap-2 ${className}`}>
                <UserRound aria-hidden className="w-5 h-5" />
                Account
            </Link>
        )
    }
    const onAuthPage = pathname === "/login" || pathname === "/register"
    const href = onAuthPage ? "/login" : `/login?next=${encodeURIComponent(pathname)}`
    return <Link href={href} className={className}>Log in</Link>
}
