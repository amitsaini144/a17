import { product } from "@/types/home";
import { navbarItem } from "@/types/home";
import headphone from "../../public/headphone.png"
import eWatch from "../../public/eWatch.png"
import eDisplay from "../../public/eDisplay.png"

export const navItems: navbarItem[] = [
    { href: '/shop', label: 'All products' },
    { href: '/about', label: 'About us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
]

export const carouselProducts: product[] = [
    { id: 1, label: 'Headphones x-28m', href: '/shop', image: headphone, price: '149.99', },
    { id: 2, label: 'eWatch SF 4', href: '/shop', image: eWatch, price: '349.99' },
    { id: 3, label: 'eDisplay XR', href: '/shop', image: eDisplay, price: '649.99' },
]