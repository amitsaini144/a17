import HeroSection from "@/components/homepage/HeroSection";
import Navbar from "@/components/homepage/Navbar";
export default function Home() {
  return (
    <div className="flex flex-col items-center w-full h-screen bg-white">
      <Navbar />
      <HeroSection />
    </div>
  );
}
