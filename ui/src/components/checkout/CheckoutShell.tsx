export default function CheckoutShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center w-full min-w-[320px] px-4 pt-32 md:pt-40 pb-10">
            <div className="flex flex-col gap-8 w-full max-w-[640px]">{children}</div>
        </div>
    )
}
