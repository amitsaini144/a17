import Image from "next/image"
import Link from "next/link"
import type { Order } from "@/lib/api/checkout"
import { formatPrice } from "@/lib/format"
import OrderStatusBadge from "./OrderStatusBadge"

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })

export default function OrderCard({ order }: { order: Order }) {
    // What was charged once paid (includes anything Stripe added); the item total before that.
    const total = order.amount_total_cents ?? order.subtotal_cents
    return (
        <article className="flex flex-col gap-4 border rounded-3xl p-5 md:p-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col">
                    <h3 className="text-black text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-[#7f7f7f]">{dateFormat.format(new Date(order.created_at))}</p>
                </div>
                <OrderStatusBadge status={order.status} />
            </header>
            <ul className="flex flex-col gap-3">
                {order.items.map((item) => (
                    <li key={item.product_slug} className="flex items-center gap-4">
                        <Image
                            src={item.image_url}
                            alt=""
                            width={64}
                            height={64}
                            className="rounded-xl object-cover w-16 h-16 bg-[#f7f7f7]" />
                        <div className="flex flex-col flex-1 min-w-0">
                            <Link href={`/shop/${item.product_slug}`} className="text-black truncate">{item.product_name}</Link>
                            <p className="text-sm text-[#7f7f7f]">
                                {item.quantity} × {formatPrice(item.unit_price_cents, order.currency)}
                            </p>
                        </div>
                        <p className="text-black tabular-nums">{formatPrice(item.line_total_cents, order.currency)}</p>
                    </li>
                ))}
            </ul>
            <footer className="flex justify-between border-t pt-4 text-black">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(total, order.currency)}</span>
            </footer>
        </article>
    )
}
