import type { Metadata } from "next"
import CartView from "@/components/cart/CartView"

export const metadata: Metadata = { title: "Cart - A17" }

export default function CartPage() {
    return <CartView />
}
