import { featureCard, Item, product, review } from "@/types/shop";
import headphone from "../../public/images/headphone/headphone.png"
import headphone1 from "../../public/images/headphone/headphone1.png"
import headphone2 from "../../public/images/headphone/headphone2.png"
import headphone3 from "../../public/images/headphone/headphone3.png"
import eWatch from "../../public/images/watch/eWatch.png"
import eDisplay from "../../public/images/monitor/eDisplay.png"
import eDisplay1 from "../../public/images/monitor/eDisplay1.png"
import eDisplay2 from "../../public/images/monitor/eDisplay2.png"
import eDisplay3 from "../../public/images/monitor/eDisplay3.png"
import displayXG from "../../public/images/monitor/displayXG.png"
import displayXG1 from "../../public/images/monitor/displayXG1.png"
import displayXG2 from "../../public/images/monitor/displayXG2.png"
import displayXG3 from "../../public/images/monitor/displayXG3.png"
import headphone_96c from "../../public/images/headphone/headphone-96c.png"
import headphone_96c1 from "../../public/images/headphone/headphone-96c1.png"
import headphone_96c2 from "../../public/images/headphone/headphone-96c2.png"
import headphone_96c3 from "../../public/images/headphone/headphone-96c3.png"
import iphoneBlack from "../../public/images/phone/iphoneBlack.png"
import iphoneBlack1 from "../../public/images/phone/iphoneBlack1.png"
import iphoneBlack2 from "../../public/images/phone/iphoneBlack2.png"
import iphoneBlack3 from "../../public/images/phone/iphoneBlack3.png"
import iphoneRed from "../../public/images/phone/iphoneRed.png"
import iphoneRed1 from "../../public/images/phone/iphoneRed1.png"
import iphoneRed2 from "../../public/images/phone/iphoneRed2.png"
import iphoneRed3 from "../../public/images/phone/iphoneRed3.png"
import iphoneWhite from "../../public/images/phone/iphoneWhite.png"
import iphoneWhite1 from "../../public/images/phone/iphoneWhite1.png"
import iphoneWhite2 from "../../public/images/phone/iphoneWhite2.png"
import iphoneWhite3 from "../../public/images/phone/iphoneWhite3.png"
import displayXE from "../../public/images/monitor/displayXE.png"
import displayXE1 from "../../public/images/monitor/displayXE1.png"
import displayXE2 from "../../public/images/monitor/displayXE2.png"
import displayXE3 from "../../public/images/monitor/displayXE3.png"
import orangeHeadphone from "../../public/images/headphone/orangeHeadphone.png"
import orangeHeadphone1 from "../../public/images/headphone/orangeHeadphone1.png"
import orangeHeadphone2 from "../../public/images/headphone/orangeHeadphone2.png"
import orangeHeadphone3 from "../../public/images/headphone/orangeHeadphone3.png"
import headphoneBlack from "../../public/images/headphone/headphoneBlack.png"
import headphoneBlack1 from "../../public/images/headphone/headphoneBlack1.png"
import headphoneBlack2 from "../../public/images/headphone/headphoneBlack2.png"
import headphoneBlack3 from "../../public/images/headphone/headphoneBlack3.png"
import watchBlack from "../../public/images/watch/watchBlack.png"
import watchBlack1 from "../../public/images/watch/watchBlack1.png"
import watchBlack2 from "../../public/images/watch/watchBlack2.png"
import watchBlack3 from "../../public/images/watch/watchBlack3.png"
import watchWhite from "../../public/images/watch/watchWhite.png"
import displayXS from "../../public/images/monitor/displayXS.png"
import displayXS1 from "../../public/images/monitor/displayXS1.png"
import displayXS2 from "../../public/images/monitor/displayXS2.png"
import displayXS3 from "../../public/images/monitor/displayXS3.png"
import headphones_99 from "../../public/images/headphone/headphones-99.png"
import headphones_991 from "../../public/images/headphone/headphones-991.png"
import headphones_992 from "../../public/images/headphone/headphones-992.png"
import headphones_993 from "../../public/images/headphone/headphones-993.png"
import headphoneGreen from "../../public/images/headphone/headphoneGreen.png"
import headphoneGreen1 from "../../public/images/headphone/headphoneGreen1.png"
import headphoneGreen2 from "../../public/images/headphone/headphoneGreen2.png"
import headphoneGreen3 from "../../public/images/headphone/headphoneGreen3.png"
import monitorFeature1 from "../../public/images/monitor/monitorFeature1.png"
import monitorFeature2 from "../../public/images/monitor/monitorFeature2.png"
import monitorFeature3 from "../../public/images/monitor/monitorFeature3.png"
import headphoneFeature1 from "../../public/images/headphone/headphoneFeature1.png"
import headphoneFeature2 from "../../public/images/headphone/headphoneFeature2.png"
import headphoneFeature3 from "../../public/images/headphone/headphoneFeature3.png"
import phoneFeature1 from "../../public/images/phone/phoneFeature1.png"
import phoneFeature2 from "../../public/images/phone/phoneFeature2.png"
import phoneFeature3 from "../../public/images/phone/phoneFeature3.png"
import watchFeature1 from "../../public/images/watch/watchFeature1.png"
import watchFeature2 from "../../public/images/watch/watchFeature2.png"
import watchFeature3 from "../../public/images/watch/watchFeature3.png"
import monitorCover from "../../public/images/monitor/monitorcover.png"
import headphoneCover from "../../public/images/headphone/headphonecover.png"
import phoneCover from "../../public/images/phone/phonecover.png"
import watchCover from "../../public/images/watch/watchcover.png"
import { ShieldCheckIcon, Package, HeadsetIcon } from "lucide-react"

export const shopProducts: product[] = [
    {
        id: 1,
        slug: 'edisplay-xg',
        label: 'eDisplay XG',
        image: displayXG,
        cover: monitorCover,
        subimages: [displayXG1, displayXG2, displayXG3],
        price: '649.99',
        description: "Upgrade your workspace with the eDisplay XS and take your productivity to new heights.",
        category: 'monitor',
    },
    {
        id: 2,
        slug: 'headphones-or-27n',
        label: 'Headphones or-27n',
        image: orangeHeadphone,
        cover: headphoneCover,
        subimages: [orangeHeadphone1, orangeHeadphone2, orangeHeadphone3],
        price: '97.99',
        description: "Whether you're on the move or powering through your workout, these headphones are designed to keep up with your active lifestyle effortlessly.",
        category: 'headphone',
    },
    {
        id: 3,
        slug: 'iphone-15-black',
        label: 'iPhone 15 Black',
        image: iphoneBlack,
        cover: phoneCover,
        subimages: [iphoneBlack1, iphoneBlack2, iphoneBlack3],
        price: '799.99',
        description: "Experience the pinnacle of technology and design with iPhone. Seamlessly integrated features, stunning display, and powerful performance redefine what's possible in the world of smartphones.",
        category: 'phone',
    },
    {
        id: 4,
        slug: 'headphones-w-96c',
        label: 'Headphones w-96c',
        image: headphone_96c,
        cover: headphoneCover,
        subimages: [headphone_96c1, headphone_96c2, headphone_96c3],
        price: '129.99',
        description: "Whether you're on the move or powering through your workout, these headphones are designed to keep up with your active lifestyle effortlessly.",
        category: 'headphone',
    },
    {
        id: 5,
        slug: 'edisplay-xe',
        label: 'eDisplay XE',
        image: displayXE,
        cover: monitorCover,
        subimages: [displayXE1, displayXE2, displayXE3],
        price: '649.99',
        description: "Upgrade your workspace with the eDisplay XE and take your productivity to new heights.",
        category: 'monitor',
    },
    {
        id: 6,
        slug: 'headphones-z-23c',
        label: 'Headphones z-23c',
        image: headphoneBlack,
        cover: headphoneCover,
        subimages: [headphoneBlack1, headphoneBlack2, headphoneBlack3],
        price: '149.99',
        description: "Whether you're on the move or powering through your workout, these headphones are designed to keep up with your active lifestyle effortlessly.",
        category: 'headphone',
    },
    {
        id: 7,
        slug: 'iphone-15-red',
        label: 'iPhone 15 Red',
        image: iphoneRed,
        cover: phoneCover,
        subimages: [iphoneRed1, iphoneRed2, iphoneRed3],
        price: '799.99',
        description: "Experience the pinnacle of technology and design with iPhone. Seamlessly integrated features, stunning display, and powerful performance redefine what's possible in the world of smartphones.",
        category: 'phone',
    },
    {
        id: 8,
        slug: 'iphone-15-white',
        label: 'iPhone 15 White',
        image: iphoneWhite,
        cover: phoneCover,
        subimages: [iphoneWhite1, iphoneWhite2, iphoneWhite3],
        price: '799.99',
        description: "Experience the pinnacle of technology and design with iPhone. Seamlessly integrated features, stunning display, and powerful performance redefine what's possible in the world of smartphones.",
        category: 'phone',
    },
    {
        id: 9,
        slug: 'ewatch-sf-3-black',
        label: 'eWatch SF 3 Black',
        image: watchBlack,
        cover: watchCover,
        subimages: [watchBlack1, watchBlack2, watchBlack3],
        price: '319.99',
        description: "Stay connected, organized, and motivated with eWatch. Enjoy seamless connectivity, comprehensive fitness tracking, stylish design, and convenient smart features—all in one sleek package.",
        category: 'smartwatch',
    },
    {
        id: 10,
        slug: 'ewatch-sf-3-white',
        label: 'eWatch SF 3 White',
        image: watchWhite,
        cover: watchCover,
        subimages: [watchBlack1, watchBlack2, watchBlack3],
        price: '319.99',
        description: "Stay connected, organized, and motivated with eWatch. Enjoy seamless connectivity, comprehensive fitness tracking, stylish design, and convenient smart features—all in one sleek package.",
        category: 'smartwatch',
    },
    {
        id: 11,
        slug: 'edisplay-xs',
        label: 'eDisplay XS',
        image: displayXS,
        cover: monitorCover,
        subimages: [displayXS1, displayXS2, displayXS3],
        price: '649.99',
        description: "Upgrade your workspace with the eDisplay XE and take your productivity to new heights.",
        category: 'monitor',
    },
    {
        id: 12,
        slug: 'headphones-x-28m',
        label: 'Headphones x-28m',
        image: headphone,
        cover: headphoneCover,
        subimages: [headphone1, headphone2, headphone3],
        price: '149.99',
        description: "Whether you're on the move or powering through your workout, these headphones are designed to keep up with your active lifestyle effortlessly.",
        category: 'headphone',
    },

    {
        id: 13,
        slug: 'headphone-e-11g',
        label: 'Headphone e-11g',
        image: headphoneGreen,
        cover: headphoneCover,
        subimages: [headphoneGreen1, headphoneGreen2, headphoneGreen3],
        price: '97.99',
        description: "Whether you're on the move or powering through your workout, these headphones are designed to keep up with your active lifestyle effortlessly.",
        category: 'headphone',
    },
    {
        id: 14,
        slug: 'headphone-w-99',
        label: 'Headphone w-99',
        image: headphones_99,
        cover: headphoneCover,
        subimages: [headphones_991, headphones_992, headphones_993],
        price: '129.99',
        description: "Whether you're on the move or powering through your workout, these headphones are designed to keep up with your active lifestyle effortlessly.",
        category: 'headphone',
    },
    {
        id: 15,
        slug: 'ewatch-sf-4',
        label: 'eWatch SF-4',
        image: eWatch,
        cover: watchCover,
        subimages: [watchBlack1, watchBlack2, watchBlack3],
        price: '349.99',
        description: "Stay connected, organized, and motivated with eWatch. Enjoy seamless connectivity, comprehensive fitness tracking, stylish design, and convenient smart features—all in one sleek package.",
        category: 'smartwatch',
    },
    {
        id: 16,
        slug: 'edisplay-xr',
        label: 'eDisplay XR',
        image: eDisplay,
        cover: monitorCover,
        subimages: [eDisplay1, eDisplay2, eDisplay3],
        price: '649.99',
        description: "Upgrade your workspace with the eDisplay XE and take your productivity to new heights.",
        category: 'monitor',
    },
]

export const featureCardInfo: featureCard[] = [
    {
        id: 1,
        img: monitorFeature1,
        title: 'Crystal Clear Visuals',
        description: 'Experience stunning clarity and vibrant colors on the Apple Display SE 3, bringing your content to life like never before.',
        category: 'monitor',
    },
    {
        id: 2,
        img: monitorFeature2,
        title: 'Seamless Connectivity',
        description: 'Effortlessly connect to your Mac, iPad, or other devices with Thunderbolt and USB-C ports for enhanced productivity.',
        category: 'monitor',
    },
    {
        id: 3,
        img: monitorFeature3,
        title: 'Sleek Design',
        description: 'With its slim profile and edge-to-edge glass, the eDisplay adds a modern touch to any workspace while maximizing your viewing area.',
        category: 'monitor',
    },
    {
        id: 4,
        img: headphoneFeature1,
        title: 'Sound Superiority, Anywhere',
        description: "Experience top-tier audio quality. Whether you're into rock or classical, these buds deliver exceptional sound across all genres.",
        category: 'headphone',
    },
    {
        id: 5,
        img: headphoneFeature2,
        title: 'Power on the Move',
        description: "Stay charged with portable capsule, giving you 4 full charges for your headphones wherever you roam.",
        category: 'headphone',
    },
    {
        id: 6,
        img: headphoneFeature3,
        title: 'Tailored Comfort',
        description: "With 6 tips in varying sizes, our headphones ensures a perfect fit for every ear, guaranteeing comfort during extended wear.",
        category: 'headphone',
    },
    {
        id: 7,
        img: phoneFeature1,
        title: 'Powerful Performance',
        description: "Experience lightning-fast processing speeds and smooth multitasking, empowering you to tackle any task with ease and efficiency.",
        category: 'phone',
    },
    {
        id: 8,
        img: phoneFeature2,
        title: 'Innovative Features',
        description: "Explore a wealth of innovative features and apps designed to streamline your daily life, from augmented reality experiences to voice-activated assistants.",
        category: 'phone',
    },
    {
        id: 9,
        img: phoneFeature3,
        title: 'Sleek Design',
        description: "Make a statement with the iPhone's sleek and elegant design, crafted from premium materials for a sophisticated look and feel.",
        category: 'phone',
    },
    {
        id: 10,
        img: watchFeature1,
        title: 'Fitness Tracking',
        description: "Monitor your health and fitness goals with precision, tracking your activity, heart rate, and more.",
        category: 'smartwatch',
    },
    {
        id: 11,
        img: watchFeature2,
        title: 'Versatile Design',
        description: "Elevate your look with a sleek and modern design that seamlessly transitions from the gym to the boardroom.",
        category: 'smartwatch',
    },
    {
        id: 12,
        img: watchFeature3,
        title: 'Effortless Connectivity',
        description: "Seamlessly stay in touch with your world, receiving notifications and calls directly on your wrist.",
        category: 'smartwatch',
    },
]

export const reviewCardInfo: review[] = [
    {
        id: 1,
        userName: 'Sarah C',
        review: "The eDisplay monitor I purchased from this store has completely transformed my work setup. The display quality is stunning, and I love how monitorFeature2 it is to connect to my devices. It's made a noticeable difference in my productivity and overall workflow.",
    },
    {
        id: 1,
        userName: "Jason M",
        review: "I was hesitant to invest in a new monitor, but I'm so glad I did. The eDisplay monitor exceeded my expectations in terms of both performance and design. It's monitorFeature3, it's vibrant, and it's made my gaming and movie-watching experiences so much more immersive.",
    },
    {
        id: 1,
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

export const categories = [
    { name: 'All products', slug: '' },
    { name: 'Headphones', slug: 'headphone' },
    { name: 'Displays', slug: 'monitor' },
    { name: 'Watches', slug: 'smartwatch' },
    { name: 'Phones', slug: 'phone' },
];
