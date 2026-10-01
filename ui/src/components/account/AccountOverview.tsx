"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/components/auth/AuthProvider"
import RequireAuth from "@/components/auth/RequireAuth"
import OrderHistory from "@/components/orders/OrderHistory"

export default function AccountOverview() {
    const { logout } = useAuth()
    const [loggingOut, setLoggingOut] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogout = async () => {
        setLoggingOut(true)
        setError(null)
        try {
            await logout()
            // A full load, not a client-side navigation: it can't lose a race with RequireAuth
            // (which reacts to the logout by redirecting to /login) and drops any in-memory state.
            window.location.replace("/")
        } catch {
            setError("Couldn't log out. Please try again.")
            setLoggingOut(false)
        }
    }

    return (
        <RequireAuth>
            {(user) => (
                <div className="flex flex-col items-center w-full min-w-[320px] px-4 pt-32 md:pt-40 pb-10">
                    <div className="flex flex-col gap-8 w-full max-w-[640px]">
                        <h1 className="text-[40px] xl:text-[64px] text-black font-medium leading-tight">Account</h1>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#f7f7f7] rounded-3xl p-6 md:p-8">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-[#7f7f7f]">Signed in as</p>
                                <p className="text-lg text-black break-all">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                aria-busy={loggingOut}
                                className="px-8 py-3 border border-black text-black rounded-full flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-60">
                                {loggingOut && <Loader2 aria-hidden className="w-4 h-4 animate-spin" />}
                                {loggingOut ? "Logging out…" : "Log out"}
                            </button>
                        </div>
                        <div role="alert">
                            {error && <p className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
                        </div>
                        <section className="flex flex-col gap-4">
                            <h2 className="text-2xl text-black">Orders</h2>
                            <OrderHistory />
                        </section>
                    </div>
                </div>
            )}
        </RequireAuth>
    )
}
