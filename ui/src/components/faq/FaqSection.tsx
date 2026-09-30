"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import FaqItem from "./FaqItem"
import { orderInfo, paymentInfo, shopFaq } from "@/data/faqData"
import { useEffect, useRef, useState } from "react"

const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, options: IntersectionObserverInit): boolean => {
    const [isIntersecting, setIsIntersecting] = useState(false)

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
        }, options)

        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [ref, options])

    return isIntersecting
}

export default function FaqSection() {
    const faqRef = useRef<HTMLDivElement>(null)
    const faqEndRef = useRef<HTMLDivElement>(null)

    useIntersectionObserver(faqRef, { threshold: 0 })
    useIntersectionObserver(faqEndRef, { threshold: 1 })

    const { scrollYProgress } = useScroll({
        target: faqRef,
        offset: ["start start", "end end"]
    })

    useTransform(scrollYProgress, [0, 0.95], ["0%", "-100%"])

    return (
        <motion.div
            ref={faqRef}
            className="flex flex-col gap-14 xl:gap-16 xl:w-[666px]"
        >
            <div className="flex flex-col gap-8">
                <h2 className="text-2xl md:text-[32px] text-black">Shopping Information</h2>
                <div className="flex flex-col gap-4">
                    {shopFaq.map((faq) => (
                        <FaqItem
                            key={faq.question}
                            question={faq.question}
                            answer={faq.answer} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-8">
                <h2 className="text-2xl md:text-[32px] text-black">Payment Information</h2>
                <div className="flex flex-col gap-4">
                    {paymentInfo.map((faq) => (
                        <FaqItem
                            key={faq.question}
                            question={faq.question}
                            answer={faq.answer} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-8">
                <h2 className="text-2xl md:text-[32px] text-black">Order & returns</h2>
                <div className="flex flex-col gap-4">
                    {orderInfo.map((faq) => (
                        <FaqItem
                            key={faq.question}
                            question={faq.question}
                            answer={faq.answer} />
                    ))}
                </div>
            </div>
            <div ref={faqEndRef} className="h-1" />
        </motion.div>
    )
}