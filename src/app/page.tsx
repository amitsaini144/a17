
import Carousel from "@/components/homepage/Carousel";
import HeroSection from "@/components/homepage/HeroSection";
import Navbar from "@/components/homepage/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <Carousel />
    </div>
  );
}
