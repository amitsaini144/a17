"use client"

import { AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { quoteCart, type CartQuote } from "@/lib/api/cart"
import { formatPrice } from "@/lib/format"
import CartLayout from "./CartLayout"
import CartLineRow from "./CartLineRow"
import CartSkeleton from "./CartSkeleton"
import { useCart } from "./CartProvider"
import CheckoutButton from "./CheckoutButton"
import EmptyCart from "./EmptyCart"
import RemovedNotice from "./RemovedNotice"

// Wait for quantity clicks to settle before re-pricing, instead of one request per click.
const REQUOTE_DELAY_MS = 300

type QuoteState =
    | { status: "loading"; quote: CartQuote | null }
    | { status: "ready"; quote: CartQuote }
    | { status: "error"; quote: CartQuote | null }

export default function CartView() {
    const cart = useCart()
    const { items, ready, remove } = cart
    const [state, setState] = useState<QuoteState>({ status: "loading", quote: null })
    const [removedCount, setRemovedCount] = useState(0)
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        if (!ready || items.length === 0) return
        setState((previous) => ({ status: "loading", quote: previous.quote }))
        const controller = new AbortController()
        const timer = setTimeout(async () => {
            try {
                const quote = await quoteCart(items, { signal: controller.signal })
                if (quote.unavailable_slugs.length > 0) {
                    setRemovedCount((count) => count + quote.unavailable_slugs.length)
                    remove(quote.unavailable_slugs)
                }
                setState({ status: "ready", quote })
            } catch {
                if (!controller.signal.aborted) setState((previous) => ({ status: "error", quote: previous.quote }))
            }
        }, REQUOTE_DELAY_MS)
        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [items, ready, remove, attempt])

    const retry = useCallback(() => setAttempt((n) => n + 1), [])

    if (!ready || (items.length > 0 && !state.quote && state.status === "loading")) return <CartSkeleton />
    if (items.length === 0) return <EmptyCart removedCount={removedCount} />

    const quote = state.quote
    const pricing = state.status === "loading"
    const quantities = new Map(items.map((item) => [item.slug, item.quantity]))
    const lines = quote?.lines.filter((line) => quantities.has(line.product.slug)) ?? []

    return (
        <CartLayout>
            <div className="flex flex-col xl:flex-row gap-10 xl:gap-16">
                <div className="flex-1 min-w-0">
                    {removedCount > 0 && <RemovedNotice count={removedCount} />}
                    {state.status === "error" && (
                        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3 mb-4">
                            Couldn&apos;t update prices. Check your connection.
                            <button onClick={retry} className="underline underline-offset-4">Try again</button>
                        </div>
                    )}
                    <ul className="border-t">
                        <AnimatePresence initial={false}>
                            {lines.map((line) => (
                                <CartLineRow
                                    key={line.product.slug}
                                    line={line}
                                    quantity={quantities.get(line.product.slug) ?? line.quantity}
                                    pricing={pricing}
                                    onQuantityChange={(quantity) => cart.setQuantity(line.product.slug, quantity)}
                                    onRemove={() => remove(line.product.slug)} />
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
                <aside className="xl:w-[380px] flex-shrink-0">
                    <div className="flex flex-col gap-6 bg-[#f7f7f7] rounded-3xl p-6 md:p-8 xl:sticky xl:top-32">
                        <h2 className="text-2xl text-black">Summary</h2>
                        <div className="flex justify-between items-center text-lg text-black">
                            <span>Subtotal</span>
                            <span className="flex items-center gap-2 tabular-nums" aria-live="polite" aria-busy={pricing}>
                                {pricing && <Loader2 aria-hidden className="w-4 h-4 animate-spin text-[#7f7f7f]" />}
                                {quote?.currency ? formatPrice(quote.subtotal_cents, quote.currency) : "—"}
                            </span>
                        </div>
                        <p className="text-sm text-[#7f7f7f]">Shipping and taxes are calculated at checkout.</p>
                        <CheckoutButton disabled={pricing || state.status === "error"} onStale={retry} />
                    </div>
                </aside>
            </div>
        </CartLayout>
    )
}
