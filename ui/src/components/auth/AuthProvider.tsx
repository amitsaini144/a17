"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
    getCurrentUser,
    hasSessionHint,
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest,
    type LoginRequest,
    type RegisterRequest,
    type User,
} from "@/lib/api/auth"

// "loading" until the session is known, so the UI doesn't flash "Log in" for a logged-in user.
type AuthState =
    | { status: "loading"; user: null }
    | { status: "anonymous"; user: null }
    | { status: "authenticated"; user: User }

type AuthContextValue = AuthState & {
    login: (data: LoginRequest) => Promise<User>
    register: (data: RegisterRequest) => Promise<User>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>")
    return context
}

const ANONYMOUS: AuthState = { status: "anonymous", user: null }

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({ status: "loading", user: null })

    useEffect(() => {
        // No session cookie means nobody is logged in: skip the network round trip entirely.
        if (!hasSessionHint()) {
            setState(ANONYMOUS)
            return
        }
        let cancelled = false
        getCurrentUser()
            .then((user) => {
                if (!cancelled) setState(user ? { status: "authenticated", user } : ANONYMOUS)
            })
            .catch(() => {
                // API unreachable: behave as logged out; protected pages send users to log in.
                if (!cancelled) setState(ANONYMOUS)
            })
        return () => {
            cancelled = true
        }
    }, [])

    const login = useCallback(async (data: LoginRequest) => {
        const user = await loginRequest(data)
        setState({ status: "authenticated", user })
        return user
    }, [])

    const register = useCallback(async (data: RegisterRequest) => {
        const user = await registerRequest(data)
        setState({ status: "authenticated", user })
        return user
    }, [])

    const logout = useCallback(async () => {
        await logoutRequest()
        setState(ANONYMOUS)
    }, [])

    const value = useMemo(() => ({ ...state, login, register, logout }), [state, login, register, logout])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
