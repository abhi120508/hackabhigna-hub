import { HeroSection } from "@/components/HeroSection";
import { DomainsSection } from "@/components/DomainsSection";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Brochure } from "@/components/Brochure";
import { AboutUs } from "@/components/AboutUs";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <DomainsSection />
      <div id="registration" className="scroll-mt-20">
        <RegistrationForm />
      </div>
      <div id="brochure" className="scroll-mt-20">
        <Brochure />
      </div>
      <div id="about-us" className="scroll-mt-20">
        <AboutUs />
      </div>
      <div id="contact" className="scroll-mt-20">
        <Contact />
      </div>
    </div>
  );
};

export default Index;
