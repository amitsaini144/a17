import type { components } from "./schema";

type Schemas = components["schemas"];

export type Category = Schemas["CategoryRead"];
export type CategoryDetail = Schemas["CategoryDetail"];
export type CategoryFeature = Schemas["CategoryFeatureRead"];
export type ProductSummary = Schemas["ProductSummary"];
export type ProductDetail = Schemas["ProductDetail"];
export type ProductPage = Schemas["Page_ProductSummary_"];

export type ProductQuery = {
    category?: string;
    featured?: boolean;
    q?: string;
    limit?: number;
    offset?: number;
};

export class ApiError extends Error {
    constructor(
        readonly status: number,
        message: string,
        /** Machine-readable code from the API's error body, e.g. "rate_limited". */
        readonly code?: string,
        /** Seconds until a rate-limited request may be retried (`Retry-After`). */
        readonly retryAfter?: number,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

type ErrorBody = { detail?: unknown; code?: unknown };

/** Build an ApiError from a failed response, keeping the API's message when there is one. */
export async function toApiError(response: Response, fallback: string): Promise<ApiError> {
    const retryAfter = Number(response.headers.get("Retry-After")) || undefined;
    let body: ErrorBody | undefined;
    try {
        body = (await response.json()) as ErrorBody;
    } catch {
        // Not JSON (e.g. a proxy error page): fall back to the generic message.
    }
    const code = typeof body?.code === "string" ? body.code : undefined;
    if (typeof body?.detail === "string") {
        return new ApiError(response.status, body.detail, code, retryAfter);
    }
    // FastAPI validation errors: `detail` is a list of { msg } entries.
    if (Array.isArray(body?.detail) && body.detail.length > 0) {
        return new ApiError(response.status, "Please check the highlighted fields", "validation_error");
    }
    return new ApiError(response.status, fallback, code, retryAfter);
}

export function isNotFound(error: unknown): boolean {
    return error instanceof ApiError && error.status === 404;
}

function apiOrigin(): string {
    // In the browser, call our own origin: Next.js proxies `/api/*` to the backend (next.config.mjs).
    if (typeof window !== "undefined") return "";

    const url =
        process.env.API_URL ??
        (process.env.NODE_ENV === "development" ? "http://localhost:8000" : undefined);
    if (!url) throw new Error("API_URL is not configured");
    return url.replace(/\/$/, "");
}

function toQueryString(params: Record<string, string | number | boolean | undefined>): string {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") search.set(key, String(value));
    }
    const query = search.toString();
    return query ? `?${query}` : "";
}

export async function apiGet<T>(path: string, init?: { signal?: AbortSignal }): Promise<T> {
    const response = await fetch(`${apiOrigin()}/api/v1${path}`, {
        headers: { Accept: "application/json" },
        // Catalog data (prices) must always be current, so never serve it from Next's data cache.
        cache: "no-store",
        signal: init?.signal,
    });
    if (!response.ok) {
        throw await toApiError(response, `GET ${path} failed with status ${response.status}`);
    }
    return (await response.json()) as T;
}

export function fetchProducts(query: ProductQuery = {}, init?: { signal?: AbortSignal }) {
    return apiGet<ProductPage>(`/products${toQueryString(query)}`, init);
}
