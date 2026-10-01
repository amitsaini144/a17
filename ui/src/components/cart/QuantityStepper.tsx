"use client"

import { Minus, Plus } from "lucide-react"
import { MAX_QUANTITY } from "@/lib/api/cart"

type Props = { value: number; onChange: (quantity: number) => void; label: string }

export default function QuantityStepper({ value, onChange, label }: Props) {
    return (
        <div role="group" aria-label={`Quantity of ${label}`} className="flex items-center border border-[#e5e5e5] rounded-full">
            <button
                type="button"
                onClick={() => onChange(value - 1)}
                disabled={value <= 1}
                aria-label="Decrease quantity"
                className="p-2.5 text-black disabled:text-[#c4c4c4]">
                <Minus aria-hidden className="w-4 h-4" />
            </button>
            <span aria-live="polite" className="min-w-[2ch] text-center text-black tabular-nums">{value}</span>
            <button
                type="button"
                onClick={() => onChange(value + 1)}
                disabled={value >= MAX_QUANTITY}
                aria-label="Increase quantity"
                className="p-2.5 text-black disabled:text-[#c4c4c4]">
                <Plus aria-hidden className="w-4 h-4" />
            </button>
        </div>
    )
}
