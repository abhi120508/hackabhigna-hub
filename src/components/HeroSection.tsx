import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { CountdownTimer } from "@/components/CountdownTimer";

export function HeroSection() {
  const scrollToRegistration = () => {
    document
      .getElementById("registration")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="HackAbhigna hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <Badge variant="outline" className="mb-4 bg-card/50 backdrop-blur-sm">
          Registration Open
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-gradient">Hack</span>
          <span className="text-accent-gradient">Abhigna</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Where Innovation Meets Excellence. Join the ultimate hackathon
          experience and turn your ideas into reality.
        </p>

        {/* Countdown Timer */}
        <div className="mb-8">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-foreground">
            Event Starts In:
          </h3>
          <CountdownTimer />
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Oct 17-18, 2024</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            <span>AIT Campus</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-foreground">
            <Trophy className="w-5 h-5 text-primary" />
            <span>₹1,00,000 Prize</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="hero"
            size="lg"
            onClick={scrollToRegistration}
            className="text-lg px-8 py-6"
          >
            <Users className="w-5 h-5 mr-2" />
            Register Now
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 bg-card/50 backdrop-blur-sm border-border/50"
          >
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Participants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">4</div>
            <div className="text-sm text-muted-foreground">Domains</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">24</div>
            <div className="text-sm text-muted-foreground">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">₹1L</div>
            <div className="text-sm text-muted-foreground">Total Prize</div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-accent rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-secondary rounded-full animate-pulse delay-500" />
      </div>
    </section>
  );
}
