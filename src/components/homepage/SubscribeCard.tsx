export default function SubscribeCard() {
    return (
        <div className="w-full px-4 md:px-6 xl:px-10 pt-10 md:pt-16 pb-4 md:pb-6 bg-white">
            <div className="flex flex-col gap-8 bg-[#f7f7f7] rounded-3xl items-center justify-center py-12 px-6 md:px-0">
                <div className="flex flex-col gap-4 text-black items-center w-full text-center">
                    <h3 className="text-2xl md:text-[28px] xl:text-[32px] leading-tight">Subscribe to our email<br className="hidden xl:block" /> newsletter<br className="hidden md:block xl:hidden" /> and get 15% off</h3>
                    <p className="text-sm md:text-base leading-tight">Be the first to know about the latest in tech trends, exclusive offers, and exciting product launches by subscribing to our newsletter.</p>
                </div>

                <form className="flex flex-col md:flex-row gap-4 w-full md:w-[80%] xl:w-[50%]">
                    <input type="email" placeholder="Your email address" className="p-4 rounded-full text-lg w-full" />
                    <input type="submit" value="Subscribe" className="px-8 py-4 bg-black text-white rounded-full text-lg w-full md:w-fit" />
                </form>
            </div>
        </div>
    )
}