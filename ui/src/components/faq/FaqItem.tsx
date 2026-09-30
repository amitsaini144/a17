"use client"

import { AnimatePresence, motion } from "framer-motion"
import { PlusIcon } from "lucide-react"
import { useState } from "react"

export default function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(!isOpen)

    return (
        <motion.div
            layout
            className="flex flex-col bg-[#f7f7f7] p-5 md:p-8 rounded-3xl cursor-pointer select-none overflow-hidden"
            onClick={toggleOpen}
        >
            <motion.div layout className="flex justify-between">
                <motion.p layout className="text-black text-lg md:text-xl w-[80%]">
                    {question}
                </motion.p>
                <motion.div
                    layout
                    className="flex-shrink-0 w-6 h-6 relative"
                >
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PlusIcon className="w-6 h-6 text-black" />
                    </motion.div>
                </motion.div>
            </motion.div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <motion.p className="text-[#4a4a4a] md:text-lg mt-8 w-[85%]">
                            {answer}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}