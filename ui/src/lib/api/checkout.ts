// Checkout and order history. All calls need a logged-in user and go through `authedFetch`,
// which refreshes an expired access token once before giving up.
import type { components } from "./schema";
import { authedFetch } from "./auth";
import type { CartItem } from "./cart";
import { toApiError } from "./client";

type Schemas = components["schemas"];

export type Order = Schemas["OrderRead"];
export type OrderStatus = Order["status"];

/** Create a Stripe Checkout page for `items` (priced on the server) and return its URL. */
export async function startCheckout(items: CartItem[]): Promise<string> {
    const response = await authedFetch("/checkout/sessions", {
        method: "POST",
        body: JSON.stringify({ items }),
    });
    if (!response.ok) throw await toApiError(response, "Couldn't start checkout, please try again");
    const { url } = (await response.json()) as Schemas["CheckoutResponse"];
    return url;
}

export async function getCheckoutOrder(sessionId: string): Promise<Order> {
    const response = await authedFetch(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
    if (!response.ok) throw await toApiError(response, "Couldn't load your order");
    return (await response.json()) as Order;
}

export async function listOrders(): Promise<Order[]> {
    const response = await authedFetch("/orders");
    if (!response.ok) throw await toApiError(response, "Couldn't load your orders");
    return (await response.json()) as Order[];
}

// Set just before leaving for Stripe from the cart, read on the success page: only a paid
// checkout of the cart (not a single-item "Buy now") should empty the cart.
const CLEAR_CART_FLAG = "a17.checkout.clear-cart";

export function markCartCheckout(): void {
    try {
        window.sessionStorage.setItem(CLEAR_CART_FLAG, "1");
    } catch {
        // Storage blocked: the cart simply isn't emptied automatically.
    }
}

export function consumeCartCheckout(): boolean {
    try {
        const marked = window.sessionStorage.getItem(CLEAR_CART_FLAG) === "1";
        window.sessionStorage.removeItem(CLEAR_CART_FLAG);
        return marked;
    } catch {
        return false;
    }
}
