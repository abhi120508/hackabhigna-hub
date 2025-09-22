import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import "./HeroSection.css"; // Updated styles
import "./global.css";

export function HeroSection() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <section className="hero-section">
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 space-y-4">
        {/* Badge */}
        <span
          className={`registration-badge font-ui-label transition-all duration-700 transform ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          REGISTRATION OPEN
        </span>

        {/* Title */}
        <h1
          className={`hack-text transition-all duration-700 transform ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          HACK <br /> ABHiGNA
        </h1>

        {/* Subtitle */}
        <p
          className={`hack-subtitle transition-all duration-700 transform ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          INNOVATE / CODE / CONQUER
        </p>

        {/* Countdown */}
        {/* Countdown */}
        <div
          className={`mb-8 transition-all duration-700 transform ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3 className="text-2xl md:text-4xl font-subtitle text-white mb-2">
            Event Starts In:
          </h3>
          <CountdownTimer />
        </div>

        {/* Event Details */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto transition-all duration-700 transform ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center justify-center gap-2 font-subtitle text-white text-2xl md:text-3xl">
            <Calendar className="w-6 h-6" /> Oct 16–17
          </div>
          <div className="flex items-center justify-center gap-2 font-subtitle text-white text-2xl md:text-3xl">
            <MapPin className="w-6 h-6" /> AIT Campus
          </div>
          <div className="flex items-center justify-center gap-2 font-subtitle text-white text-2xl md:text-3xl">
            <Trophy className="w-6 h-6" /> ₹1,00,000 Prize
          </div>
        </div>

        {/* Register Button */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 transform ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Button variant="hero" size="lg" className="px-8 py-6 font-body">
            <Users className="w-5 h-5 mr-2" /> Register Now
          </Button>
        </div>
      </div>
    </section>
  );
}
