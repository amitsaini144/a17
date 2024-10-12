import { product } from "@/types/home";
import headphone from "../../public/headphone.png"
import eWatch from "../../public/eWatch.png"
import eDisplay from "../../public/eDisplay.png"
import displayXG from "../../public/displayXG.png"
import headphone_96c from "../../public/headphone-96c.png"
import iphoneBlack from "../../public/iphoneBlack.png"
import iphoneWhite from "../../public/iphoneWhite.png"
import displayXE from "../../public/displayXE.png"
import orangeHeadphone from "../../public/orangeHeadphone.png"
import headphoneBlack from "../../public/headphoneBlack.png"
import iphoneRed from "../../public/iphoneRed.png"
import watchBlack from "../../public/watchBlack.png"
import watchWhite from "../../public/watchWhite.png"
import displayXS from "../../public/displayXS.png"
import headphones_99 from "../../public/headphones-99.png"
import headphoneGreen from "../../public/headphoneGreen.png"

export const shopProducts: product[] = [
    { id: 1, slug: 'edisplay-xg', label: 'eDisply XG', href: '/shop', image: displayXG, price: '649.99', },
    { id: 2, slug: 'headphones-or-27n', label: 'Headphones or_27n', href: '/shop', image: orangeHeadphone, price: '97.99' },
    { id: 3, slug: 'iphone-15-black', label: 'iphone_15 Black', href: '/shop', image: iphoneBlack, price: '799.99' },
    { id: 4, slug: 'headphones-w-96c', label: 'Headphones w_96c', href: '/shop', image: headphone_96c, price: '129.99', },
    { id: 5, slug: 'edisplay-xg', label: 'eDisplay XE', href: '/shop', image: displayXE, price: '649.99' },
    { id: 6, slug: 'headphones-z-23c', label: 'Headphones z_23c', href: '/shop', image: headphoneBlack, price: '149.99' },
    { id: 7, slug: 'iphone-15-red', label: 'iphone_15 Red', href: '/shop', image: iphoneRed, price: '799.99', },
    { id: 8, slug: 'iphone-15-white', label: 'iphone_15 White', href: '/shop', image: iphoneWhite, price: '799.99' },
    { id: 9, slug: 'ewatch-sf-3-black', label: 'eWatch SF_3 Black', href: '/shop', image: watchBlack, price: '319.99' },
    { id: 10, slug: 'ewatch-sf-3-white', label: 'eWatch SF_3 White', href: '/shop', image: watchWhite, price: '319.99' },
    { id: 11, slug: 'edisplay-xs', label: 'eDisplay XS', href: '/shop', image: displayXS, price: '649.99' },
    { id: 12, slug: 'headphone-w-99', label: 'Headphone w_99', href: '/shop', image: headphones_99, price: '129.99' },
    { id: 13, slug: 'headphone-e-11g', label: 'Headphone e_11g', href: '/shop', image: headphoneGreen, price: '97.99' },
    { id: 14, slug: 'headphones-x-28m', label: 'Headphones x_28m', href: '/shop', image: headphone, price: '149.99', },
    { id: 15, slug: 'ewatch-sf-4', label: 'eWatch SF_4', href: '/shop', image: eWatch, price: '349.99', },
    { id: 16, slug: 'edisplay-xr', label: 'eDisplay XR', href: '/shop', image: eDisplay, price: '649.99', },
]