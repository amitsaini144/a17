import type { OrderStatus } from "@/lib/api/checkout"

const STYLES: Record<OrderStatus, { label: string; className: string }> = {
    pending: { label: "Awaiting payment", className: "bg-amber-50 text-amber-800" },
    paid: { label: "Paid", className: "bg-green-50 text-green-800" },
    fulfilled: { label: "Shipped", className: "bg-blue-50 text-blue-800" },
    cancelled: { label: "Cancelled", className: "bg-[#f0f0f0] text-[#4a4a4a]" },
}

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
    const { label, className } = STYLES[status]
    return <span className={`px-3 py-1 rounded-full text-sm ${className}`}>{label}</span>
}
