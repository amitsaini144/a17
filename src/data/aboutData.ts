import { TruckIcon, CreditCardIcon, Undo2Icon } from "lucide-react"
import { smallCard, largeCard } from "@/types/about";
import exculsive from "../../public/images/exclusive.png"
import enduring from "../../public/images/enduring.png"
import ethical from "../../public/images/ethical.png"


export const smallCardInfo: smallCard[] = [
    {
        id: 1,
        svg: TruckIcon,
        title: 'Free Shipping',
        description: '$24+ orders ship free'
    },
    {
        id: 2,
        svg: CreditCardIcon,
        title: 'Secure Payments',
        description: 'Trusted payment options'
    },
    {
        id: 3,
        svg: Undo2Icon,
        title: '45 Days Free Return',
        description: 'Easy, risk-free returns',
    },
]

export const largeCardInfo: largeCard[] = [
    {
        id: 1,
        img: exculsive,
        title: 'Exclusive Range',
        description: 'Immerse yourself in our meticulously curated selection, backed by over 20 years of industry experience.'
    },
    {
        id: 2,
        img: enduring,
        title: 'Enduring Innovation',
        description: 'Our products transcend fleeting trends, embodying timeless innovation that ensures they remain relevant and cutting-edge for years.'
    },
    {
        id: 3,
        img: ethical,
        title: 'Ethical Sourcing',
        description: 'Shop with confidence knowing that our products are sourced from reputable factories worldwide, adhering to stringent compliance standards.'
    }
]