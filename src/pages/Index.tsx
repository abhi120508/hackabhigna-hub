import { HeroSection } from "@/components/HeroSection";
import { DomainsSection } from "@/components/DomainsSection";
import { RegistrationForm } from "@/components/RegistrationForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <DomainsSection />
      
      {/* Registration Section */}
      <section id="registration" className="py-20 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Ready to Compete?</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Register your team now and secure your spot in HackAbhigna 2024
          </p>
        </div>
        <RegistrationForm />
      </section>
    </div>
  );
};

export default Index;
