import Carousel from "@/components/homepage/Carousel";
import CategorySection from "@/components/homepage/CategorySection";
import HeroSection from "@/components/homepage/HeroSection";
import Navbar from "@/components/homepage/Navbar";
import ArticlesSection from "@/components/homepage/ArticlesSection";
import SubscribeCard from "@/components/homepage/SubscribeCard";
import Footer from "@/components/homepage/Footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-w-[320px] min-h-screen bg-white">
      <div className="w-full max-w-[1349px]">
        <Navbar />
        <HeroSection />
        <Carousel />
        <CategorySection />
        <ArticlesSection />
        <SubscribeCard />
        <Footer />
      </div>
    </div>
  );
}
