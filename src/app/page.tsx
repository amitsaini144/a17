import Carousel from "@/components/homepage/Carousel";
import CategorySection from "@/components/homepage/CategorySection";
import HeroSection from "@/components/homepage/HeroSection";
import Navbar from "@/components/homepage/Navbar";
import ArticlesSection from "@/components/homepage/ArticlesSection";
import SubscribeCard from "@/components/homepage/SubscribeCard";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <Carousel />
      <CategorySection />
      <ArticlesSection />
      <SubscribeCard />
    </div>
  );
}
