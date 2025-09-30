import { HeroSection } from "@/components/HeroSection";
import { DomainsSection } from "@/components/DomainsSection";
// import { Collaborations } from "@/components/Collaborations";
// import { Judges } from "@/components/Judges";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Brochure } from "@/components/Brochure";
import { AboutUs } from "@/components/AboutUs";
import Contact from "@/components/Contact";
import { PaymentMethod } from "@/components/PaymentMethod";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  // If navigated here with { state: { scrollTo: "section-id" } }, perform smooth scroll
  useEffect(() => {
    const state = location.state as unknown as { scrollTo?: string };
    const targetId = state?.scrollTo;
    if (targetId) {
      // Defer to ensure DOM is ready
      setTimeout(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 0);
      // Clear the history state so it doesn't re-trigger on back/forward
      try {
        window.history.replaceState(
          {},
          "",
          window.location.pathname +
            window.location.search +
            window.location.hash
        );
      } catch {
        // no-op
      }
    }
  }, [location]);
  return (
    <div className="w-full relative z-10">
      {/* Hero */}
      <HeroSection />

      {/* Domains */}
      <section
        className="min-h-screen py-0 bg-transparent scroll-mt-14 md:scroll-mt-16"
        id="domains"
      >
        <DomainsSection />
      </section>

      {/* Collaborations - Disabled for now */}
      {/* 
      <section
        id="collaborations"
        className="min-h-screen py-0 scroll-mt-14 md:scroll-mt-16 bg-transparent"
      >
        <Collaborations />
      </section>
      */}

      {/* Judges - Disabled for now */}
      {/* 
      <section
        id="judges"
        className="min-h-screen py-0 scroll-mt-14 md:scroll-mt-16 bg-transparent"
      >
        <Judges />
      </section>
      */}

      {/* Payment Method */}
      <section
        id="payment-method"
        className="min-h-screen py-20 scroll-mt-14 md:scroll-mt-16 bg-transparent"
      >
        <PaymentMethod />
      </section>

      {/* Registration */}
      <section
        id="registration"
        className="min-h-screen py-0 scroll-mt-14 md:scroll-mt-16 bg-transparent"
      >
        <RegistrationForm />
      </section>

      {/* Brochure */}
      <section
        id="brochure"
        className="min-h-screen py-0 scroll-mt-14 md:scroll-mt-16 bg-transparent"
      >
        <Brochure />
      </section>

      {/* About Us */}
      <section
        id="about-us"
        className="min-h-screen py-0 scroll-mt-14 md:scroll-mt-16 bg-transparent"
      >
        <AboutUs />
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="min-h-screen py-0 scroll-mt-14 md:scroll-mt-16 bg-transparent"
      >
        <Contact />
      </section>
    </div>
  );
};

export default Index;
