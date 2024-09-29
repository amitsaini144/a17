import Carousel from "@/components/homepage/Carousel";
import CategorySection from "@/components/homepage/CategorySection";
import HeroSection from "@/components/homepage/HeroSection";
import ArticlesSection from "@/components/homepage/ArticlesSection";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-w-[320px] min-h-screen bg-white">
      <div className="w-full max-w-[1349px]">
        <HeroSection />
        <Carousel />
        <CategorySection />
        <ArticlesSection />
      </div>
    </div>
  );
}
