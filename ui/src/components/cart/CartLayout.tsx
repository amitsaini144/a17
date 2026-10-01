export default function CartLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center w-full min-w-[320px]">
            <div className="flex flex-col gap-10 w-full max-w-8xl px-4 md:px-6 xl:px-10 pt-[120px] md:pt-40 pb-10">
                <h1 className="text-[40px] xl:text-[64px] text-black font-medium leading-tight">Cart</h1>
                {children}
            </div>
        </div>
    )
}
