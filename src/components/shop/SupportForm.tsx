"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function Form() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setEmail('');
            setMessage('');
            setName('');
        }, 2000);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row w-full gap-3">
                <input
                    required
                    type="text"
                    value={name}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    className="p-4 rounded-xl w-full focus:outline-none text-black bg-[#f7f7f7]" />
                <input
                    required
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-4 rounded-xl w-full focus:outline-none text-black bg-[#f7f7f7]" />
            </div>
            <textarea
                required
                value={message}
                placeholder="Message"
                onChange={(e) => setMessage(e.target.value)}
                className="p-4 w-full h-40 resize-none rounded-xl focus:outline-none text-black bg-[#f7f7f7]"></textarea>
            <button
                type="submit"
                className="px-8 py-3 bg-black text-white font-semibold rounded-xl text-lg w-full flex items-center justify-center">
                {loading ?
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    >
                        <Loader2 />
                    </motion.div>
                    :
                    "Send message"
                }
            </button>
        </form>
    )
}