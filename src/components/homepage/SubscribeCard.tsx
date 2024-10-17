"use client"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion";

export default function SubscribeCard() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setEmail("");
        }, 2000);
    };

    return (
        <div className="w-full px-4 md:px-6 xl:px-10 pt-10 md:pt-16 pb-4 md:pb-6 bg-white max-w-[1349px] mx-auto">
            <div className="flex flex-col gap-8 bg-[#f7f7f7] rounded-3xl items-center justify-center py-12 px-6 md:px-0">
                <div className="flex flex-col gap-4 text-black items-center w-full text-center">
                    <h3 className="text-2xl md:text-[28px] xl:text-[32px] leading-tight">Subscribe to our email<br className="hidden xl:block" /> newsletter<br className="hidden md:block xl:hidden" /> and get 15% off</h3>
                    <p className="text-sm md:text-base leading-tight">Be the first to know about the latest in tech trends, exclusive offers, and exciting product launches by subscribing to our newsletter.</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col md:flex-row gap-4 w-full md:w-[80%] xl:w-[50%]">
                    <input
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Your email address"
                        className="text-black p-4 rounded-full text-lg w-full focus:outline-none"
                        required
                    />
                    <button
                        type="submit"
                        className="px-8 py-4 bg-black text-white rounded-full text-lg w-full flex items-center justify-center md:w-[30%]"
                    >
                        {loading ?
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            >
                                <Loader2 />
                            </motion.div>
                            :
                            "Subscribe"
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}