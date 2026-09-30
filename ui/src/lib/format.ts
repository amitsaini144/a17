/** Formats integer cents as e.g. "USD 649.99" (the store's price style). */
export function formatPrice(cents: number, currency: string): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        currencyDisplay: "code",
    })
        .format(cents / 100)
        .replace(/ /g, " ");
}
