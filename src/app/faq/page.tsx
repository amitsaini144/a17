import Link from "next/link";
import FaqItem from "@/components/faq/FaqItem";

const shopFaq = [
    {
        id: 1,
        question: "How can I track my order?",
        answer: "Once your order has been processed and shipped, you'll receive a confirmation email containing a tracking number and a link to track your package. Simply click on the provided link or enter the tracking number on our website's order tracking page to monitor the status and location of your shipment in real-time.",
    },
    {
        id: 2,
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods to ensure a convenient shopping experience for our customers. These include major credit and debit cards such as Visa, Mastercard, American Express, as well as digital payment options like PayPal, Apple Pay, Google Pay, and more. Rest assured, all transactions are securely processed to safeguard your financial information.",
    },
    {
        id: 3,
        question: "Can I modify or cancel my order after it's been placed?",
        answer: "We understand that circumstances may change after placing an order. While we strive to process orders quickly, you may still have a window of opportunity to modify or cancel your order. To do so, please contact our customer support team as soon as possible with your order details. We'll do our best to accommodate your request, but please note that once an order has been processed for shipping, modifications or cancellations may no longer be possible.",
    },
    {
        id: 4,
        question: "Do you offer international shipping?",
        answer: "Yes, we offer international shipping to select countries worldwide. During the checkout process, you'll have the option to select your preferred shipping method and view estimated delivery times and costs for international orders. Please note that additional customs duties or taxes may apply depending on your country's import regulations, which are the responsibility of the recipient. For more information on international shipping, please refer to our Shipping &amp; Delivery page.",
    },
    {
        id: 5,
        question: "How do I contact customer support?",
        answer: "We're here to assist you every step of the way. If you have any questions, concerns, or need assistance with your order, our dedicated customer support team is readily available to help. You can reach us via email at support@example.com or through our website's live chat feature during business hours. We strive to respond promptly to ensure a seamless shopping experience for our valued customers.",
    },
]

const paymentInfo = [
    {
        id: 1,
        question: "Is it safe to enter my credit card information on your website?",
        answer: "Absolutely. We take the security of your personal and financial information seriously. Our website is equipped with advanced encryption technology and security protocols to ensure that your data is protected against unauthorized access or interception. When you enter your credit card information during checkout, it is encrypted and transmitted securely to prevent any potential breaches. You can shop with confidence knowing that your information is safe with us.",
    },
    {
        id: 2,
        question: "When will my credit card be charged for my order?",
        answer: "Your credit card will be charged at the time your order is placed. Once you complete the checkout process and submit your order, the payment will be processed immediately. You'll receive a confirmation email once the transaction is successful, and your order will be processed for shipping according to our standard processing times.",
    },
]

const orderInfo = [
    {
        id: 1,
        question: "How can I track my order?",
        answer: "Once your order has been processed and shipped, you will receive a confirmation email containing a tracking number and instructions on how to track your package. Simply click on the provided tracking link or enter the tracking number on our website's order tracking page to monitor the status and location of your shipment in real-time.",
    },
    {
        id: 2,
        question: "What is your return policy?",
        answer: "We want you to be completely satisfied with your purchase. If for any reason you are not, we offer a hassle-free return policy. Eligible items can be returned within 30 days of delivery for a refund or exchange. Simply initiate the return process through our website's Returns &amp; Exchanges page, and follow the provided instructions. Please ensure that the item is in its original condition with all tags and packaging intact.",
    },
]

export default function Faq() {

    return (
        <div className="flex flex-col items-center w-full min-w-[320px] bg-white">
            <div className="w-full max-w-[1349px]">
                <div className="w-full flex flex-col gap-12 px-4 md:px-10 pt-32 md:pt-40">
                    <div className="flex flex-col gap-3 xl:w-1/2">
                        <h1 className="text-[40px] md:text-6xl text-black font-medium">FAQ</h1>
                        <p className="text-lg md:text-xl text-black">Shop our curated selection of premium products, designed<br className="hidden md:block" /> to elevate your everyday experiences</p>
                    </div>
                </div>
                <div className="flex flex-col-reverse xl:flex-row pt-10 md:pt-16 pb-6 px-4 md:px-6 xl:px-10 xl:py-16 justify-between gap-10">

                    <div className="flex flex-col gap-8 xl:w-[500px] h-fit">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-2xl md:text-[32px] text-black">NEED HELP?</h2>
                            <div className="flex flex-col gap-4 text-black text-lg md:text-xl">
                                <p>If you have an issue or question that requires immediate assistance, you can click the button below to contact with a Customer Service representative.</p>
                                <p>Please allow 06 - 12 business days from the time your package arrives back to us for a refund to be issued.</p>
                            </div>
                        </div>
                        <Link href='/contact' className="border border-black px-8 py-4 rounded-full md:text-lg text-black text-center">
                            Contact us
                        </Link>
                    </div>
                    <div className="flex h-[2px] w-full xl:w-[2px] xl:h-[1200px] bg-[#f7f7f7]">
                    </div>
                    <div className="flex flex-col gap-8 xl:w-[666px]">
                        <div className="flex flex-col gap-8">
                            <h2 className="text-2xl md:text-[32px] text-black">Shopping Information</h2>

                            <div className="flex flex-col gap-4">
                                {shopFaq.map((faq) => (
                                    <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">
                            <h2 className="text-2xl md:text-[32px] text-black">Payment Information</h2>

                            <div className="flex flex-col gap-4">
                                {paymentInfo.map((faq) => (
                                    <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">
                            <h2 className="text-2xl md:text-[32px] text-black">Order & returns</h2>

                            <div className="flex flex-col gap-4">
                                {orderInfo.map((faq) => (
                                    <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}  