import CategorySection from "@/components/CategorySection";
import DestinationsSection from "@/components/DestinationsSection ";
import HeroSection from "@/components/HeroSection";
import RouteSection from "@/components/RouteSection";
 import TravelReviews from "@/components/TravelReviews";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategorySection/>
      <DestinationsSection/>
      <RouteSection/>
       <TravelReviews />
    </main>
  );
}