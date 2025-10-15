import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy, Users, CreditCard } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { PaymentMethod } from "@/components/PaymentMethod";
import "./HeroSection.css";
import "./global.css";

import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <section className="hero-section">
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 space-y-2 w-full">
        {" "}
        {/* Added w-full for better mobile centering */}
        <p
          className={`registration-open transition-all duration-700 transform ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Registrations closed :(
        </p>
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
          className={`innovate-conquer transition-all duration-700 transform ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          INNOVATE / CODE / CONQUER
        </p>
        {/* Countdown */}
        <div
          className={`mb-4 transition-all duration-700 transform ${
            /* Reduced mb from 8 to 4 */
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h3
            className="text-xl md:text-3xl font-subtitle text-white mb-2" /* Reduced text size */
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Event Starts In:
          </h3>
          <CountdownTimer />
        </div>
        {/* Event Details */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 max-w-2xl mx-auto transition-all duration-700 transform ${
            /* Reduced mb from 8 to 4 */
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            className="flex items-center justify-center gap-2 font-subtitle text-white text-sm md:text-base"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            <Calendar
              className="w-6 h-6 md:w-8 md:h-8" /* Reduced icon sizes */
              style={{ color: "#60a5fa" }}
            />
            Oct 29–30
          </div>
          <button
            className="flex items-center justify-center gap-2 font-subtitle text-white text-sm md:text-base hover:text-blue-400 transition-colors duration-300 cursor-pointer whitespace-nowrap"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
            onClick={() =>
              window.open("https://maps.app.goo.gl/DZxJNrAsFtXdQar7A", "_blank")
            }
          >
            <MapPin
              className="w-6 h-6 md:w-8 md:h-8" /* Reduced icon sizes */
              style={{ color: "#60a5fa" }}
            />
            <span>AIT, Chikkamagaluru</span>
          </button>
          <div
            className="flex items-center justify-center gap-2 font-subtitle text-white text-sm md:text-base"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            <Trophy
              className="w-6 h-6 md:w-8 md:h-8" /* Reduced icon sizes */
              style={{ color: "#60a5fa" }}
            />
            ₹1,00,000 Prize
          </div>
        </div>
        {/* Register Button */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 transform ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Button
            className="register-btn px-6 py-4 font-body"
            onClick={() => {
              // If we're on home page, smooth scroll to registration section
              const el = document.getElementById("registration");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              } else {
                // Navigate to home and scroll there
                navigate("/", { state: { scrollTo: "registration" } });
              }
            }}
          >
            <Users className="w-4 h-4 mr-2" />
            Register Now
          </Button>
          <Button
            className="register-btn px-6 py-4 font-body"
            onClick={() => {
              // Scroll to payment method section
              const el = document.getElementById("payment-method");
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            View Payment Method
          </Button>
        </div>
      </div>
    </section>
  );
}
