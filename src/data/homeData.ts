import { CarouselProps } from "@/types/home";
import { navbarItem } from "@/types/home";
import headphone from "../../public/images/headphone/headphone.png"
import eWatch from "../../public/images/watch/eWatch.png"
import eDisplay from "../../public/images/monitor/eDisplay.png"

export const navItems: navbarItem[] = [
    { href: '/shop', label: 'All products' },
    { href: '/about', label: 'About us' },
    { href: '/faq', label: 'FAQ' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
]

export const carouselProducts: CarouselProps[] = [
    { id: 1, slug:'headphones-x-28m', label: 'Headphones x-28m', image: headphone, price: '149.99', },
    { id: 2, slug:'ewatch-sf-4', label: 'eWatch SF 4', image: eWatch, price: '349.99' },
    { id: 3, slug:'edisplay-xr', label: 'eDisplay XR', image: eDisplay, price: '649.99' },
]