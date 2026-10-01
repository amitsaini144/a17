// Browser-only auth calls. They go to our own origin (`/api/*`, proxied to the API), so the
// httpOnly session cookies are first-party and sent automatically; tokens never touch JS.
import type { components } from "./schema";
import { toApiError } from "./client";

type Schemas = components["schemas"];

export type User = Schemas["UserRead"];
export type LoginRequest = Schemas["LoginRequest"];
export type RegisterRequest = Schemas["RegisterRequest"];

// Mirrors the API's limits (app/auth/schemas.py) so forms can validate before submitting.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

const SESSION_HINT_COOKIE = "session";

/** True if the API has marked this browser as having a login session (holds no secret). */
export function hasSessionHint(): boolean {
    return document.cookie.split("; ").some((cookie) => cookie === `${SESSION_HINT_COOKIE}=1`);
}

function request(path: string, init: RequestInit = {}): Promise<Response> {
    return fetch(`/api/v1${path}`, {
        ...init,
        credentials: "same-origin",
        headers: { Accept: "application/json", "Content-Type": "application/json", ...init.headers },
    });
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
    const response = await request(path, { method: "POST", body: JSON.stringify(body) });
    if (!response.ok) throw await toApiError(response, "Something went wrong, please try again");
    return (await response.json()) as T;
}

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Trade the refresh cookie for new session cookies. Concurrent callers share one request: the
 * API rotates the refresh token on every use, so parallel refreshes would race each other.
 */
export function refreshSession(): Promise<boolean> {
    refreshInFlight ??= request("/auth/refresh", { method: "POST" })
        .then((response) => response.ok)
        .catch(() => false)
        .finally(() => {
            refreshInFlight = null;
        });
    return refreshInFlight;
}

/** Fetch an endpoint that needs a logged-in user, refreshing an expired access token once. */
export async function authedFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const response = await request(path, init);
    if (response.status !== 401) return response;
    return (await refreshSession()) ? request(path, init) : response;
}

export function login(data: LoginRequest): Promise<User> {
    return postJson<User>("/auth/login", data);
}

export function register(data: RegisterRequest): Promise<User> {
    return postJson<User>("/auth/register", data);
}

export async function logout(): Promise<void> {
    const response = await request("/auth/logout", { method: "POST" });
    if (!response.ok) throw await toApiError(response, "Couldn't log out, please try again");
}

/** The logged-in user, or null when there is no (longer a) valid session. */
export async function getCurrentUser(): Promise<User | null> {
    const response = await authedFetch("/auth/me");
    if (response.status === 401) return null;
    if (!response.ok) throw await toApiError(response, "Couldn't load your account");
    return (await response.json()) as User;
}

/**
 * Where to go after logging in. Only same-site paths are allowed: a crafted
 * `/login?next=https://evil.example` must not turn our login page into a redirect to another site.
 */
export function safeNextPath(next: string | null | undefined, fallback = "/"): string {
    if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
        return fallback;
    }
    if (next.startsWith("/login") || next.startsWith("/register")) return fallback;
    return next;
}
