export default function RemovedNotice({ count }: { count: number }) {
    return (
        <p role="status" className="text-sm text-[#4a4a4a] bg-[#f7f7f7] rounded-xl px-4 py-3 mb-4">
            {count === 1 ? "1 product is" : `${count} products are`} no longer available and{" "}
            {count === 1 ? "was" : "were"} removed from your cart.
        </p>
    )
}
