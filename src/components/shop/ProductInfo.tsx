"use client"

import { ArrowRightIcon } from "lucide-react"
import { items } from "@/data/shopData"
import { useState } from "react"
import { Modal } from "./ProductInfoModal"

export default function ProductInfo() {
    const [openModal, setOpenModal] = useState<number | null>(null);

    const handleOpenModal = (id: number) => {
        setOpenModal(id);
    };

    const handleCloseModal = () => {
        setOpenModal(null);
    };

    return (
        <div className="flex flex-col gap-4">
            {items.map((item, index) => (
                <div key={item.id}>
                    <button
                        onClick={() => handleOpenModal(item.id)}
                        className="flex gap-2 justify-between py-4 w-full"
                    >
                        <div className="flex gap-2 items-center text-black">
                            <item.icon className="w-6 h-6" />
                            <p className="text-sm md:text-base">{item.text}</p>
                        </div>
                        <ArrowRightIcon className="w-6 h-6 text-black" />
                    </button>
                    {index < 2 && <div className="flex bg-[#e6e6e6] h-[1px] w-full"></div>}
                    <Modal
                        isOpen={openModal === item.id}
                        onClose={handleCloseModal}
                        Icon={item.icon}
                        title={item.text}
                        description={item.description}
                    />
                </div>
            ))}
        </div>
    )
}