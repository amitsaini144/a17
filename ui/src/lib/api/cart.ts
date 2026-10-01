import type { components } from "./schema";
import { toApiError } from "./client";

type Schemas = components["schemas"];

export type CartItem = Schemas["CartItem"];
export type CartLine = Schemas["CartLine"];
export type CartQuote = Schemas["CartQuote"];

// Mirrors the API's bounds (app/cart/schemas.py).
export const MAX_QUANTITY = 10;
export const MAX_LINES = 50;

/** Price the cart on the server: the only prices shown (and later charged) come from the API. */
export async function quoteCart(items: CartItem[], init?: { signal?: AbortSignal }): Promise<CartQuote> {
    const response = await fetch("/api/v1/cart/quote", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
        signal: init?.signal,
    });
    if (!response.ok) throw await toApiError(response, "Couldn't load your cart");
    return (await response.json()) as CartQuote;
}
