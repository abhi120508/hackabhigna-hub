import { useEffect, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { DomainsSection } from "@/components/DomainsSection";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Brochure } from "@/components/Brochure";
import { AboutUs } from "@/components/AboutUs";
import { Contact } from "@/components/Contact";

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.25; // 👈 Play at half speed
    }
  }, []);

  return (
    <>
      {/* Background Video */}
      <div className="fixed top-16 inset-x-0 bottom-0 -z-10">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover brightness-30"
          src="robo.mp4"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="w-full relative z-10">
        {/* Hero */}
        <section className="h-screen bg-transparent">
          <HeroSection />
        </section>

        {/* Domains */}
        <section className="h-screen bg-transparent">
          <DomainsSection />
        </section>

        {/* Registration */}
        <section id="registration" className="h-screen scroll-mt-20 bg-transparent">
          <RegistrationForm />
        </section>

        {/* Brochure */}
        <section id="brochure" className="h-screen scroll-mt-20 bg-transparent">
          <Brochure />
        </section>

        {/* About Us */}
        <section id="about-us" className="scroll-mt-20 bg-transparent">
          <AboutUs />
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20 bg-transparent">
          <Contact />
        </section>
      </div>
    </>
  );
};

export default Index;
