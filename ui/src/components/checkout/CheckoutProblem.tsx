import Link from "next/link"
import CheckoutShell from "./CheckoutShell"

export default function CheckoutProblem({ message }: { message: string }) {
    return (
        <CheckoutShell>
            <div className="flex flex-col items-center gap-4 text-center py-10">
                <h1 className="text-[32px] text-black font-medium">Something&apos;s not right</h1>
                <p className="text-[#4a4a4a]">{message}</p>
                <Link href="/account" className="px-8 py-4 bg-black text-white rounded-full">Go to my account</Link>
            </div>
        </CheckoutShell>
    )
}
