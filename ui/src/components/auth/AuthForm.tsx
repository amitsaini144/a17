"use client"

import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useId, useState } from "react"
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, safeNextPath } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"
import { useAuth } from "./AuthProvider"

type Mode = "login" | "register"
type FieldErrors = { email?: string; password?: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COPY = {
    login: {
        title: "Welcome back",
        subtitle: "Log in to check out and see your orders.",
        submit: "Log in",
        switchPrompt: "New to A17?",
        switchLabel: "Create an account",
        switchPath: "/register",
    },
    register: {
        title: "Create your account",
        subtitle: "You only need an account to check out.",
        submit: "Create account",
        switchPrompt: "Already have an account?",
        switchLabel: "Log in",
        switchPath: "/login",
    },
} as const

// Mirrors the API's rules, so most mistakes are caught before a request is sent.
function validate(mode: Mode, email: string, password: string): FieldErrors {
    const errors: FieldErrors = {}
    if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address"
    if (!password) {
        errors.password = "Enter your password"
    } else if (mode === "register" && password.length < PASSWORD_MIN_LENGTH) {
        errors.password = `Use at least ${PASSWORD_MIN_LENGTH} characters`
    } else if (password.length > PASSWORD_MAX_LENGTH) {
        errors.password = `Use at most ${PASSWORD_MAX_LENGTH} characters`
    }
    return errors
}

function describeError(error: unknown): string {
    if (!(error instanceof ApiError)) return "Couldn't reach the server. Check your connection and try again."
    if (error.status === 429) {
        const minutes = Math.max(1, Math.ceil((error.retryAfter ?? 60) / 60))
        return `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`
    }
    if (error.status >= 500) return "Something went wrong on our side. Please try again."
    return error.message
}

export default function AuthForm({ mode }: { mode: Mode }) {
    const copy = COPY[mode]
    const router = useRouter()
    const auth = useAuth()
    const next = safeNextPath(useSearchParams().get("next"))
    const id = useId()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [formError, setFormError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    // Already logged in (e.g. sent here by the route guard with a still-valid session): go on.
    useEffect(() => {
        if (auth.status === "authenticated") router.replace(next)
    }, [auth.status, next, router])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const errors = validate(mode, email, password)
        setFieldErrors(errors)
        setFormError(null)
        if (errors.email || errors.password) return

        setSubmitting(true)
        try {
            const credentials = { email: email.trim(), password }
            await (mode === "login" ? auth.login(credentials) : auth.register(credentials))
            router.replace(next)
        } catch (error) {
            setFormError(describeError(error))
            setSubmitting(false)
        }
    }

    const switchHref = next === "/" ? copy.switchPath : `${copy.switchPath}?next=${encodeURIComponent(next)}`

    return (
        <div className="flex flex-col items-center w-full min-w-[320px] px-4 pt-32 md:pt-40 pb-10">
            <div className="flex flex-col gap-8 w-full max-w-[440px]">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-[32px] md:text-[40px] text-black font-medium leading-tight">{copy.title}</h1>
                    <p className="text-[#4a4a4a]">{copy.subtitle}</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor={`${id}-email`} className="text-sm text-black">Email</label>
                        <input
                            id={`${id}-email`}
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={Boolean(fieldErrors.email)}
                            aria-describedby={fieldErrors.email ? `${id}-email-error` : undefined}
                            className={`p-4 rounded-xl w-full text-black bg-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.email ? "ring-2 ring-red-500" : ""}`} />
                        {fieldErrors.email && <p id={`${id}-email-error`} className="text-sm text-red-600">{fieldErrors.email}</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor={`${id}-password`} className="text-sm text-black">Password</label>
                        <div className="relative">
                            <input
                                id={`${id}-password`}
                                type={showPassword ? "text" : "password"}
                                autoComplete={mode === "login" ? "current-password" : "new-password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-invalid={Boolean(fieldErrors.password)}
                                aria-describedby={`${id}-password-help`}
                                className={`p-4 pr-12 rounded-xl w-full text-black bg-[#f7f7f7] focus:outline-none focus:ring-2 focus:ring-black ${fieldErrors.password ? "ring-2 ring-red-500" : ""}`} />
                            <button
                                type="button"
                                onClick={() => setShowPassword((shown) => !shown)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7f7f7f] hover:text-black">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <p id={`${id}-password-help`} className={`text-sm ${fieldErrors.password ? "text-red-600" : "text-[#7f7f7f]"}`}>
                            {fieldErrors.password ?? (mode === "register" ? `At least ${PASSWORD_MIN_LENGTH} characters. A passphrase works well.` : "")}
                        </p>
                    </div>

                    <div role="alert" aria-live="assertive">
                        {formError && <p className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">{formError}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        aria-busy={submitting}
                        className="px-8 py-4 bg-black text-white rounded-full text-lg w-full flex items-center justify-center gap-2 disabled:opacity-80">
                        {submitting && <Loader2 aria-hidden className="w-5 h-5 animate-spin" />}
                        {submitting ? (mode === "login" ? "Logging in…" : "Creating account…") : copy.submit}
                    </button>
                </form>

                <p className="text-center text-[#4a4a4a]">
                    {copy.switchPrompt}{" "}
                    <Link href={switchHref} className="text-black underline underline-offset-4">{copy.switchLabel}</Link>
                </p>
            </div>
        </div>
    )
}
