import { ApiError } from "@/lib/api/client";

/** A shopper-facing message for a failed checkout start. */
export function describeCheckoutError(error: unknown): string {
    if (!(error instanceof ApiError)) return "Couldn't reach the server. Check your connection and try again.";
    switch (error.status) {
        case 401:
            return "Your session has expired. Please log in again.";
        case 409:
            return "Some products are no longer available. Your cart has been updated, please review it.";
        case 429:
            return "Too many checkout attempts. Please wait a minute and try again.";
        case 503:
            return "Payments are unavailable right now. Please try again shortly.";
        default:
            return error.status >= 500 ? "Something went wrong on our side. Please try again." : error.message;
    }
}
