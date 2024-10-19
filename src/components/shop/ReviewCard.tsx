import { review } from "@/types/shop";

export default function ReviewCard({ userName, review }: review) {
    return (
        <div className="flex flex-col p-6 md:p-10 gap-6 bg-[#f7f7f7] rounded-3xl">
            <p className="md:text-lg text-[#1f1f1f] md:leading-tight">{review}</p>
            <p className="md:text-lg text-black font-medium">{userName}</p>
        </div>
    )
}