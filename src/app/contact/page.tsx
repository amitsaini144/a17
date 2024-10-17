import Form from "@/components/contact/Form"

export default function Contact() {

    return (
        <div className="flex flex-col items-center w-full min-w-[320px] bg-white">
            <div className="w-full max-w-[1349px]">
                <div className="w-full flex flex-col gap-12 px-4 md:px-10 pt-32 md:pt-40">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-6xl text-black font-semibold">Contact us</h1>
                        <p className="text-lg md:text-xl text-black md:w-2/3">We&apos;re here to assist you with any inquiries, feedback, or assistance you may need. Whether you have questions about products, orders, or general inquiries, our dedicated customer support team is ready to help.</p>
                    </div>
                </div>
                <div className="flex flex-col-reverse xl:flex-row px-4 md:px-10 pt-6 md:pt-10 gap-6">
                    <div className="flex flex-col gap-6 xl:w-1/3 justify-between">
                        <div className="flex flex-col justify-between px-4 py-6 md:p-6 bg-[#f7f7f7] rounded-3xl h-[250px] xl:h-1/2">
                            <div className="flex flex-col gap-2 text-lg md:text-xl text-black">
                                <p>Phone number</p>
                                <p>+ 123 456 789</p>
                            </div>
                            <p className="md:text-lg text-[#4a4a4a]">Call our team directly. We will provide information, answer technical questions, or schedule an appointment.</p>
                        </div>
                        <div className="flex flex-col justify-between px-4 py-6 md:p-6 bg-[#f7f7f7] rounded-3xl h-[250px] xl:h-1/2">
                            <div className="flex flex-col gap-2 text-lg md:text-xl text-black">
                                <p>E-mail</p>
                                <p>example@gmail.com</p>
                            </div>
                            <p className="md:text-lg text-[#4a4a4a]">Use email to provide information about the project. We will respond as soon as possible, providing comprehensive support.</p>
                        </div>
                    </div>
                    <div className="flex flex-col px-4 py-6 md:p-6 bg-[#f7f7f7] rounded-3xl xl:w-2/3 gap-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-lg md:text-xl text-black">Drop us a message</p>
                            <p className="md:w-2/3 text-[#4a4a4a] md:text-lg">We&apos;re always here to assist you at Etec. Our customer support team is dedicated to addressing your inquiries.</p>
                        </div>
                        <Form />
                    </div>
                </div>
            </div>
        </div>
    )
}