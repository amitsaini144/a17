// The cart lives in localStorage as `{ slug, quantity }` pairs only. Prices are never stored:
// they would go stale, and the browser is not a trusted source for them anyway.
import { MAX_LINES, MAX_QUANTITY, type CartItem } from "@/lib/api/cart";

// Versioned, so a future shape change can't be misread as the current one.
export const CART_STORAGE_KEY = "a17.cart.v1";

/** Parse stored data defensively: it may be stale, hand-edited or from another version. */
export function parseCart(raw: string | null): CartItem[] {
    if (!raw) return [];
    let data: unknown;
    try {
        data = JSON.parse(raw);
    } catch {
        return [];
    }
    if (!Array.isArray(data)) return [];

    const items = new Map<string, number>();
    for (const entry of data) {
        if (typeof entry !== "object" || entry === null) continue;
        const { slug, quantity } = entry as Record<string, unknown>;
        if (typeof slug !== "string" || !slug || slug.length > 128) continue;
        if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) continue;
        items.set(slug, Math.min(quantity, MAX_QUANTITY));
    }
    return Array.from(items, ([slug, quantity]) => ({ slug, quantity })).slice(0, MAX_LINES);
}

export function loadCart(): CartItem[] {
    try {
        return parseCart(window.localStorage.getItem(CART_STORAGE_KEY));
    } catch {
        return []; // Storage blocked (e.g. some private modes): the cart lasts for this page only.
    }
}

export function saveCart(items: CartItem[]): void {
    try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Storage full or blocked: keep working in memory.
    }
}
