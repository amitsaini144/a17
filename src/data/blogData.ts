import { article } from "@/types/blog";

export const articles: article[] = [
    {
        id: 1,
        slug: 'the-future-of-wearable-tech-trends',
        label: 'The Future of Wearable Tech: Trends and Innovations to Watch',
        href: '/blog',
        image: '/VR.png',
        date: 'Apr 08, 2022',
        content: [
            {
                text: "In recent years, wearable technology has evolved from simple fitness trackers to sophisticated gadgets that seamlessly integrate into our daily lives. From smartwatches to augmented reality glasses, the possibilities seem endless. In this article, we'll explore the latest trends and innovations shaping the future of wearable tech."
            },
            {
                title: "1. Health and Wellness Monitoring:",
                text: "One of the most significant trends in wearable tech is its focus on health and wellness monitoring. Today's wearables go beyond simply tracking steps and calories. They can monitor heart rate, sleep patterns, stress levels, and even detect potential health issues like irregular heart rhythms. With advancements in sensors and AI, wearables are becoming invaluable tools for proactive healthcare management.",
            },
        ]
    },
    {
        id: 2,
        slug: 'the-rise-of-smart-home-devices',
        label: 'The Rise of Smart Home Devices: Transforming the Way We Live',
        href: '/blog',
        image: '/pc.png',
        date: 'Mar 15, 2022',
        content: [
            {
                text: "In the age of digital innovation, our homes are becoming smarter than ever before. From thermostats that adjust to our preferences to voice-activated assistants that control our appliances, smart home devices are revolutionizing the way we live. In this blog post, we'll explore the growing popularity of smart home devices and the ways in which they're transforming our daily lives."
            },
            {
                title: "1. Convenience at Your Fingertips:",
                text: "One of the biggest benefits of smart home devices is the convenience they offer. With just a few taps on your smartphone or a simple voice command, you can control everything from lighting and temperature to security cameras and entertainment systems. Imagine coming home to a cozy, well-lit space with your favorite music playing—all without lifting a finger.",
            },
        ]
    },
    {
        id: 3,
        slug: 'gaming-gadgets',
        label: 'Gaming Gadgets: Revolutionizing Entertainment and Beyond',
        href: '/blog',
        image: '/typing.png',
        date: 'Feb 15, 2022',
        content: [
            {
                text: "Gaming has evolved from a niche hobby to a global phenomenon, and with it, so have the gadgets and technologies that enhance the gaming experience. From high-performance gaming PCs to immersive virtual reality headsets, gaming gadgets are revolutionizing entertainment and pushing boundaries like never before. In this blog post, we'll delve into the world of gaming gadgets and explore how they're transforming not only how we play but also how we interact with technology."
            },
            {
                title: "1. Immersive Virtual Reality (VR) Experiences:",
                text: "One of the most significant advancements in gaming technology is the rise of virtual reality (VR). VR headsets transport players to immersive virtual worlds, allowing them to interact with their surroundings in ways never thought possible. Whether exploring fantastical realms or battling foes in intense multiplayer games, VR technology provides a level of immersion that traditional gaming simply can't match.",
            },
        ]
    },
]

export function getPostBySlug(slug: string) {
    return articles.find(article => article.slug === slug);
  }