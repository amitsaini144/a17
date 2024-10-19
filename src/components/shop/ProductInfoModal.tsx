"use client"

import { XIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import SupportForm from "./SupportForm"
import { ModalProps } from "@/types/shop";

export const Modal = ({ isOpen, onClose, Icon, title, description }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
            document.body.style.overflow = 'hidden';
        };
        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-end md:items-center justify-center z-50">
            <div ref={modalRef} className="flex flex-col gap-8 bg-white w-full md:max-w-3xl rounded-t-3xl md:rounded-3xl">
                <div className="flex flex-col px-6 pt-6 gap-6">
                    <div className="flex justify-between items-center text-black">
                        <div className="flex gap-3 text-black items-center">
                            <Icon className="w-6 h-6" />
                            <h5 className="text-lg md:text-xl">{title}</h5>
                        </div>
                        <button onClick={onClose} >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="h-[1px] w-full bg-[#e6e6e6]"> </div>
                </div>
                <div className="flex flex-col gap-4 px-6 pb-14">
                    {description ? description.map((item, index) => (
                        <p key={index} className="text-black text-sm md:text-base">
                            {item}
                        </p>
                    )) :
                        <>
                            <p className="text-black text-lg md:text-xl">Get in touch with our team today</p>
                            <p className="text-black text-sm md:text-base"> Need any help? Send us a message using the form<br className="hidden md:block" /> below and we&apos;ll get back to you as fast as we can!</p>
                            <SupportForm />
                        </>
                    }
                </div>
            </div>
        </div>
    )
};