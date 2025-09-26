import { HeroSection } from "@/components/HeroSection";
import { DomainsSection } from "@/components/DomainsSection";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Brochure } from "@/components/Brochure";
import { AboutUs } from "@/components/AboutUs";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="w-full relative z-10">
      {/* Hero */}
      <HeroSection />

      {/* Domains */}
      <section className="min-h-screen py-0 bg-transparent">
        <DomainsSection />
      </section>

      {/* Registration */}
      <section
        id="registration"
        className="min-h-screen py-0 scroll-mt-20 bg-transparent"
      >
        <RegistrationForm />
      </section>

      {/* Brochure */}
      <section
        id="brochure"
        className="min-h-screen py-0 scroll-mt-20 bg-transparent"
      >
        <Brochure />
      </section>

      {/* About Us */}
      <section
        id="about-us"
        className="min-h-screen py-0 scroll-mt-20 bg-transparent"
      >
        <AboutUs />
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="min-h-screen py-0 scroll-mt-20 bg-transparent"
      >
        <Contact />
      </section>
    </div>
  );
};

export default Index;
