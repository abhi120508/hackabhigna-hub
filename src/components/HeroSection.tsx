import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import "./HeroSection.css";
import "./global.css";

export function HeroSection() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const scrollToRegistration = () => {
    document
      .getElementById("registration")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[calc(100vh-3.5rem)] flex flex-col justify-start items-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 w-full h-full flex flex-col justify-start items-center pt-4">
        <div className="flex flex-col items-center space-y-2">
          <Badge
            variant="outline"
            className={`registration-open transition-all duration-700 transform bg-card/50 backdrop-blur-sm ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Registration Open
          </Badge>

          {/* Title */}
          <h1
            className={`hack-text transition-all duration-700 transform text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-gradient">Hack</span>
            <span className="text-accent-gradient">Abhigna</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`innovate-conquer transition-all duration-700 transform text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Where Innovation Meets Excellence. Join the ultimate hackathon
            experience and turn your ideas into reality.
          </p>

          {/* Countdown */}
          <div
            className={`mt-4 transition-all duration-700 transform ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-2 text-foreground">
              Event Starts In:
            </h3>
            <CountdownTimer />
          </div>

          {/* Event Details */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-md mx-auto mt-4 transition-all duration-700 transform ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div
              className="flex items-center justify-center gap-1 text-foreground font-subtitle text-white text-xs"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <Calendar
                className="w-3 h-3 text-primary"
                style={{ color: "rgb(201, 114, 219)" }}
              />
              <span>Oct 30–31</span>
            </div>
            <div
              className="flex items-center justify-center gap-1 text-foreground font-subtitle text-white text-xs"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <MapPin
                className="w-3 h-3 text-primary"
                style={{ color: "rgb(201, 114, 219)" }}
              />
              <span>AIT Campus</span>
            </div>
            <div
              className="flex items-center justify-center gap-1 text-foreground font-subtitle text-white text-xs"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <Trophy
                className="w-3 h-3 text-primary"
                style={{ color: "rgb(201, 114, 219)" }}
              />
              <span>₹1,00,000 Prize</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 justify-center mt-6 transition-all duration-700 transform ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Button
              variant="hero"
              size="lg"
              className="text-sm sm:text-base px-6 py-3 custom-white-button font-body min-w-[140px]"
              onClick={scrollToRegistration}
            >
              <Users className="w-4 h-4 mr-2" />
              Register Now
            </Button>
          </div>

          {/* Stats - Smaller and at bottom if needed, but centered */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mt-8 w-full transition-all duration-700 transform">
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-primary">
                500+
              </div>
              <div className="text-xs text-muted-foreground">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-accent">
                4
              </div>
              <div className="text-xs text-muted-foreground">Domains</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-secondary">
                24
              </div>
              <div className="text-xs text-muted-foreground">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg font-bold text-primary">
                ₹1L+
              </div>
              <div className="text-xs text-muted-foreground">Total Prize</div>
            </div>
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
