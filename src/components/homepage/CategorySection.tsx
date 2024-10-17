import AllProducts from "./AllProducts";
import Displays from "./Displays";
import CardWithButton from "./CardWithButton";
import whiteHeadphone from "../../../public/images/headphone/whiteHeadphone.png" 
import iphonepro from "../../../public/images/phone/iphonepro.png"

export default function CategorySection() {
    return (
        <div className="w-full px-4 md:px-6 xl:px-10 py-16 bg-white">
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2 text-black">
                    <h2 className="text-4xl xl:text-[40px] font-medium">Browse by categories</h2>
                    <p className=" text-[18px] xl:text-xl">Explore our diverse range of categories tailored to <br className="hidden md:block" /> meet your specific needs and interests.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    <AllProducts />
                    <div className="flex flex-col gap-6 justify-around">
                        <Displays />
                        <div className="grid md:grid-cols-2 gap-6 h-1/2 overflow-hidden">
                            <CardWithButton image={whiteHeadphone} label="Headphones" href="/shop/headphone" />
                            <CardWithButton image={iphonepro} label="Phones" href="/shop/phone" />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
