import { Suspense } from "react";
import Carousel from "@/components/homepage/Carousel";
import CategorySection from "@/components/homepage/CategorySection";
import HeroSection from "@/components/homepage/HeroSection";
import ArticlesSection from "@/components/homepage/ArticlesSection";
import CarouselSkeleton from "@/components/loading/CarouselSkeleton";

// Rendered per request: catalog data must be current, and builds must not depend on the API.
export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-w-[320px] min-h-screen bg-white">
      <div className="w-full max-w-8xl">
        <HeroSection />
        {/* Only the carousel needs the API: stream it in so the rest of the page shows at once. */}
        <Suspense fallback={<CarouselSkeleton />}>
          <Carousel />
        </Suspense>
        <CategorySection />
        <ArticlesSection />
      </div>
    </div>
  );
}
