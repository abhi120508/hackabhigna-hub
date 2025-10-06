import React, { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";

const collaborations = [
  {
    name: "Google Gemini",
    description: `We’re thrilled to collaborate with Google Gemini, a leader in generative AI innovation. Gemini represents Google’s cutting-edge advancement in multimodal intelligence, empowering developers and creators to explore new frontiers of problem-solving and creativity. For this hackathon, Google Gemini is proudly providing official participation certificates and exclusive goodies to recognize and reward the innovation, effort, and talent of all participants. This partnership highlights our shared vision of encouraging AI-driven creativity and impactful solutions for the future.`,
    // use the new high-contrast asset for both background and badge
    image: "/collabs/Gemini.png",
    // use a smaller high-contrast logo for the foreground badge (placed in public/collabs)
    logo: "/collabs/Gemini.png",
  },
  {
    name: "StreamzAI",
    description: `We’re proud to have StreamzAI as our Problem Statement and Judging Partner. StreamzAI is a forward-thinking company specializing in AI-driven analytics and intelligent automation solutions. For this hackathon, StreamzAI has contributed by defining real-world problem statements that challenge participants to apply innovative thinking and cutting-edge technologies. In addition, expert judges from StreamzAI will be evaluating the projects, ensuring fair and insightful assessments that recognize creativity, technical depth, and practical impact.`,
    // StreamzAI assets
    image: "/collabs/steamz.png",
    logo: "/collabs/steamz.png",
    // make the circular badge have white background for better contrast
    logoBg: "bg-white",
    imgClass: "object-contain",
  },
  {
    name: "Environ India",
    description: `We’re delighted to collaborate with Environ India, a sustainability-focused organization dedicated to promoting eco-friendly innovation and environmental responsibility. For this hackathon, Environ India has introduced an exclusive Wildcard Problem Statement, offering participants a unique opportunity to tackle real-world sustainability challenges. The company is also providing expert mentors to guide participants throughout the event, and will be awarding a special cash prize for the best solution in the Wildcard domain, encouraging creativity and impactful green tech solutions.`,
    // Environ
    image: "/collabs/Environ.jpg",
    logo: "/collabs/Environ.jpg",
    // ensure the Environ logo sits well inside the round badge
    logoBg: "bg-transparent",
    imgClass: "object-contain p-1 bg-white rounded-full",
  },
  {
    name: "ICT Academy",
    description: `We’re honored to have ICT Academy as our Knowledge Partner for the hackathon. ICT Academy is a premier initiative that bridges the gap between industry and academia by empowering students and educators with essential skills in emerging technologies. Through this collaboration, ICT Academy supports our vision of fostering innovation, digital literacy, and experiential learning — enabling participants to gain valuable insights and exposure to industry-relevant knowledge throughout the event.`,
    // ICT
    image: "/collabs/ict.png",
    logo: "/collabs/ict.png",
    // white circular background for ICT logo
    logoBg: "bg-white",
    imgClass: "object-contain",
  },
];

interface CarouselApi {
  scrollNext: () => void;
}

export const Collaborations = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const api = (carouselRef.current as unknown as { api: CarouselApi | null })
      .api;
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-12 bg-gradient-to-b from-transparent to-black/20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">
          Our Collaborations
        </h2>
        <div className="relative -mx-4 sm:-mx-6">
          <div className="hidden sm:block">
            <Carousel
            ref={carouselRef}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-4">
              {collaborations.map((collab, index) => (
                <CarouselItem key={index} className="basis-full pl-4">
                  <div className="relative h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
                    {/* Semi-transparent background (keep badge visible) */}
                    <div className="absolute inset-0 bg-black/40 rounded-3xl backdrop-blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-3xl pointer-events-none" />
                    {/* Company Logo (foreground) */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 flex items-center justify-center border border-white/20 shadow-md backdrop-blur-sm ${collab.logoBg || 'bg-white/10'}`}>
                        <img
                          src={collab.logo || collab.image}
                          alt={`${collab.name} logo`}
                          className={`w-full h-full ${collab.imgClass || 'object-contain'} rounded-full`}
                        />
                      </div>
                    </div>

                    {/* Company Name at Top Center (moved down to avoid overlap with logo) */}
                    <div className="absolute top-24 sm:top-28 left-1/2 transform -translate-x-1/2 text-center z-20 px-4">
                      <h3 className="text-base sm:text-xl lg:text-3xl font-bold text-white drop-shadow-2xl">
                        {collab.name}
                      </h3>
                    </div>
                    {/* Description positioned closer under the title to avoid large empty space */}
                    <div className="absolute left-3 right-3 z-10 top-36 sm:top-40 md:top-44 lg:top-48">
                      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 sm:p-5 text-white border border-white/10 max-h-[40vh] md:max-h-[34vh] overflow-y-auto">
                        <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                          {collab.description}
                        </p>
                        {/* role / more info removed as requested */}
                      </div>
                    </div>
                    <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/50 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 lg:w-12 lg:h-12 shadow-lg z-20 flex items-center justify-center" />
                    <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/50 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 lg:w-12 lg:h-12 shadow-lg z-20 flex items-center justify-center" />

                    {/* Pagination dots - centered at bottom */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-30">
                      <CarouselDots />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            </Carousel>
          </div>

          {/* Mobile fallback: stacked cards (carousel hidden on small screens) */}
          <div className="block sm:hidden px-4">
            <div className="space-y-6">
              {collaborations.map((collab, i) => (
                <div key={i} className="rounded-3xl bg-black/40 backdrop-blur-sm p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-16 h-16 rounded-full overflow-hidden border border-white/20 flex items-center justify-center ${collab.logoBg || 'bg-white/10'}`}>
                      <img src={collab.logo || collab.image} alt={`${collab.name} logo`} className={`w-full h-full ${collab.imgClass || 'object-contain'}`} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{collab.name}</h3>
                    <p className="text-sm text-white/90">{collab.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
