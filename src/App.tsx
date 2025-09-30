import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Register from "./pages/Register";
import { Brochure } from "@/components/Brochure";
import { AboutUs } from "@/components/AboutUs";
import { Contact } from "@/components/Contact";
import AdminPanel from "./pages/AdminPanel";
import QRPanel from "./pages/QRPanel";
import JudgePanel from "./pages/JudgePanel";
import ParticipantPanel from "./pages/ParticipantPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.2; // slower playback
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          {/* Background Video - Responsive for mobile */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover brightness-50 md:object-fill"
              src="/robo.mp4"
              style={{ filter: "grayscale(10%) contrast(1.1) brightness(0.5)" }}
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
          <Navigation />
          <main className="pt-14 md:pt-16 min-h-screen w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/brochure" element={<Brochure />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/qr-panel" element={<QRPanel />} />
              <Route path="/judge" element={<JudgePanel />} />
              <Route path="/participant" element={<ParticipantPanel />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
