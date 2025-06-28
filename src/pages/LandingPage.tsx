// src/pages/LandingPage.tsx

import { Navbar } from "../components/landingpage/Navbar";
import { MainContent } from "../components/landingpage/MainContent";
import { PricingSection } from "../components/landingpage/PricingSection";
import { ContactSection } from "../components/landingpage/ContactSection";
import { Footer } from "../components/landingpage/Footer";

export const LandingPage = () => {
  return (
    <>
      <Navbar />
      <MainContent />
      <PricingSection />
      <ContactSection />
      <Footer />
    </>
  );
};
