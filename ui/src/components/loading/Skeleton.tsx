// Placeholder block shown while content loads. Decorative: the surrounding region carries the
// accessible "loading" status. The pulse is skipped for users who prefer reduced motion.
export default function Skeleton({ className = "" }: { className?: string }) {
    return <div aria-hidden className={`bg-[#efefef] motion-safe:animate-pulse ${className}`} />
}
