"use client"
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(!isOpen)

    return (
        <div className="flex flex-col bg-[#f7f7f7] p-5 md:p-8 rounded-3xl gap-8 cursor-pointer select-none"
            onClick={toggleOpen}
        >
            <motion.div className="flex justify-between gap-16"   >
                <p className="text-black text-lg md:text-xl">{question}</p>
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <PlusIcon className="w-6 h-6 text-black" />
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.p className="text-[#4a4a4a] md:text-lg w-[85%] overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {answer}
                    </motion.p>
                )}
            </AnimatePresence>

        </div>
    )
}