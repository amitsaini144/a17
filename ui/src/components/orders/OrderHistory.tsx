"use client"

import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import Skeleton from "@/components/loading/Skeleton"
import { listOrders, type Order } from "@/lib/api/checkout"
import OrderCard from "./OrderCard"

type State = { status: "loading" } | { status: "ready"; orders: Order[] } | { status: "error" }

export default function OrderHistory() {
    const [state, setState] = useState<State>({ status: "loading" })

    const load = useCallback(() => {
        setState({ status: "loading" })
        listOrders()
            .then((orders) => setState({ status: "ready", orders }))
            .catch(() => setState({ status: "error" }))
    }, [])

    useEffect(load, [load])

    if (state.status === "loading") {
        return (
            <div role="status" className="flex flex-col gap-4">
                <span className="sr-only">Loading your orders…</span>
                <Skeleton className="rounded-3xl h-[180px] w-full" />
                <Skeleton className="rounded-3xl h-[180px] w-full" />
            </div>
        )
    }
    if (state.status === "error") {
        return (
            <p role="alert" className="flex flex-wrap gap-2 text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">
                Couldn&apos;t load your orders.
                <button onClick={load} className="underline underline-offset-4">Try again</button>
            </p>
        )
    }
    if (state.orders.length === 0) {
        return (
            <p className="text-[#4a4a4a]">
                You haven&apos;t placed any orders yet.{" "}
                <Link href="/shop" className="text-black underline underline-offset-4">Browse the shop</Link>
            </p>
        )
    }
    return (
        <div className="flex flex-col gap-4">
            {state.orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
    )
}
