import Navbar from "../components/ui/Navbar";
import HeroSection from "../components/ui/HeroSection";
import StatsSection from "../components/ui/StatsSection";
import FeaturesSection from "../components/ui/FeaturesSection";
import HowItWorks from "../components/ui/HowItWorks";
import TestimoniSection from "../components/ui/TestimoniSection";
import Footer from "../components/ui/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <StatsSection />
      <TestimoniSection />
      <Footer />
    </div>
  );
};

export default LandingPage;