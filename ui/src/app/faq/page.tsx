import Link from "next/link";
import FaqSection from "@/components/faq/FaqSection";

export default function Faq() {

    return (
        <div className="flex flex-col items-center w-full min-w-[320px] bg-white">
            <div className="w-full max-w-8xl">
                <div className="w-full flex flex-col gap-12 px-4 md:px-10 pt-32 md:pt-40">
                    <div className="flex flex-col gap-3 xl:w-1/2">
                        <h1 className="text-[40px] md:text-6xl text-black font-medium">FAQ</h1>
                        <p className="text-lg md:text-xl text-black">Shop our curated selection of premium products, designed<br className="hidden md:block" /> to elevate your everyday experiences</p>
                    </div>
                </div>
                <div className="flex flex-col-reverse xl:flex-row pt-10 md:pt-16 pb-6 px-4 md:px-6 xl:px-10 xl:py-16 justify-between gap-10 relative">

                    <div className="flex flex-col gap-8 xl:w-[500px] h-fit xl:sticky xl:top-20">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl md:text-[32px] text-black">Need Help?</h2>
                            <div className="flex flex-col gap-4 text-black text-lg md:text-xl">
                                <p>If you have an issue or question that requires immediate assistance, you can click the button below to contact with a Customer Service representative.</p>
                                <p>Please allow 06 - 12 business days from the time your package arrives back to us for a refund to be issued.</p>
                            </div>
                        </div>
                        <Link href='/contact' className="border px-8 py-4 rounded-full md:text-lg text-black text-center hover:bg-[#f7f7f7] transition-colors duration-300">
                            Contact us
                        </Link>
                    </div>
                    <div className="flex h-[2px] w-full xl:w-[2px] xl:h-auto bg-[#f7f7f7]"></div>
                    <FaqSection />
                </div>
            </div>
        </div>
    )
}  