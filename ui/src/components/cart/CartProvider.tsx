"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { MAX_LINES, MAX_QUANTITY, type CartItem } from "@/lib/api/cart"
import { CART_STORAGE_KEY, loadCart, saveCart } from "@/lib/cart-storage"

type CartContextValue = {
    items: CartItem[]
    /** Total number of units, for the navbar badge. */
    count: number
    /** False until the stored cart has been read (it isn't available during server rendering). */
    ready: boolean
    /** Returns false when the cart is full and the product isn't in it yet. */
    add: (slug: string, quantity?: number) => boolean
    setQuantity: (slug: string, quantity: number) => void
    remove: (slugs: string | string[]) => void
    clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
    const context = useContext(CartContext)
    if (!context) throw new Error("useCart must be used inside <CartProvider>")
    return context
}

const clampQuantity = (quantity: number) => Math.min(Math.max(Math.trunc(quantity), 1), MAX_QUANTITY)

export default function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItemsState] = useState<CartItem[]>([])
    const [ready, setReady] = useState(false)
    // Latest items, readable synchronously (e.g. to answer "is the cart full?" in `add`).
    const itemsRef = useRef<CartItem[]>([])

    const setItems = useCallback((next: CartItem[]) => {
        itemsRef.current = next
        setItemsState(next)
    }, [])

    useEffect(() => {
        setItems(loadCart())
        setReady(true)
        // Keep tabs in sync: another tab changed the cart.
        const onStorage = (event: StorageEvent) => {
            if (event.key === CART_STORAGE_KEY || event.key === null) setItems(loadCart())
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [setItems])

    const update = useCallback(
        (change: (current: CartItem[]) => CartItem[]) => {
            const next = change(itemsRef.current)
            saveCart(next)
            setItems(next)
        },
        [setItems],
    )

    const add = useCallback(
        (slug: string, quantity = 1) => {
            const existing = itemsRef.current.find((item) => item.slug === slug)
            if (!existing && itemsRef.current.length >= MAX_LINES) return false
            update((items) =>
                existing
                    ? items.map((item) =>
                          item.slug === slug ? { slug, quantity: clampQuantity(item.quantity + quantity) } : item,
                      )
                    : [...items, { slug, quantity: clampQuantity(quantity) }],
            )
            return true
        },
        [update],
    )

    const setQuantity = useCallback(
        (slug: string, quantity: number) =>
            update((items) =>
                items.map((item) => (item.slug === slug ? { slug, quantity: clampQuantity(quantity) } : item)),
            ),
        [update],
    )

    const remove = useCallback(
        (slugs: string | string[]) => {
            const gone = new Set(Array.isArray(slugs) ? slugs : [slugs])
            update((items) => items.filter((item) => !gone.has(item.slug)))
        },
        [update],
    )

    const clear = useCallback(() => update(() => []), [update])

    const value = useMemo(
        () => ({
            items,
            count: items.reduce((total, item) => total + item.quantity, 0),
            ready,
            add,
            setQuantity,
            remove,
            clear,
        }),
        [items, ready, add, setQuantity, remove, clear],
    )

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
