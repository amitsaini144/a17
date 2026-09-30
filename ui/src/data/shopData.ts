import { Item, review } from "@/types/shop";
import { ShieldCheckIcon, Package, HeadsetIcon } from "lucide-react"

export const reviewCardInfo: review[] = [
    {
        id: 1,
        userName: 'Sarah C',
        review: "The eDisplay monitor I purchased from this store has completely transformed my work setup. The display quality is stunning, and I love how monitorFeature2 it is to connect to my devices. It's made a noticeable difference in my productivity and overall workflow.",
    },
    {
        id: 2,
        userName: "Jason M",
        review: "I was hesitant to invest in a new monitor, but I'm so glad I did. The eDisplay monitor exceeded my expectations in terms of both performance and design. It's monitorFeature3, it's vibrant, and it's made my gaming and movie-watching experiences so much more immersive.",
    },
    {
        id: 3,
        userName: "Emily K",
        review: "I've been using the eDisplay monitor for a few weeks now, and I'm blown away by its versatility. Whether I'm editing photos or streaming videos, the colors are always accurate and vibrant. It's definitely raised the bar for what I expect from a monitor.",
    },
]

export const items: Item[] = [
    {
        id: 1,
        icon: ShieldCheckIcon,
        text: 'Warranty',
        href: "/",
        description: [
            "Etec offers a two-year manufacturer warranty on all new headphones purchased from authorized retailers in most countries. Refurbished products purchased from authorized retailers are covered by a one-year manufacturer warranty. If you believe your product is faulty and is within the warranty period, please fill out this form to submit a warranty claim here.",

            "After you’ve completed and submitted the warranty claim form our customer service team will proceed with your claim within two business days. If you are required to return your product prior to approval, you will receive an email with a prepaid return shipping label. Please do not mail your product to etec without a prepaid return label provided by Etec as this will delay the claims process.",

            "If no further information is needed, you’ll receive an approval confirmation email, followed by a shipping confirmation email with a tracking number for your replacement headphones once they have been shipped. Please do not discard your faulty headphones until you receive your replacement.",
        ]
    },
    {
        id: 2,
        icon: Package,
        text: 'Shipping & delivery',
        href: "/shop",
        description: [
            "For all orders exceeding a value of 100USD shipping is offered for free.",

            "Returns will be accepted for up to 10 days of Customer’s receipt or tracking number on unworn items. You, as a Customer, are obliged to inform us via email before you return the item.",

            "Otherwise, standard shipping charges apply. Check out our delivery Terms & Conditions for more details.",
        ]
    },
    {
        id: 3,
        icon: HeadsetIcon,
        text: 'Support',
        href: "/blog",
    }
]
