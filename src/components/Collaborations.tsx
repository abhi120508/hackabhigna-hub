import React, { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const collaborations = [
  {
    name: "Google Gemini",
    description:
      "Gemini is a family of multimodal AI models developed by Google DeepMind. It can understand text, code, images, audio, and video. Gemini was announced in December 2023 and is used in various Google products and services.",
    image: "/images/collaborations/gemini.png",
  },
  {
    name: "Company B",
    description: "Experts in sustainable energy technologies.",
    image: "https://via.placeholder.com/1200x700?text=Company+B",
  },
  {
    name: "Company C",
    description: "Pioneers in blockchain and fintech.",
    image: "https://via.placeholder.com/1200x700?text=Company+C",
  },
  {
    name: "Company D",
    description: "Global leaders in cloud computing.",
    image: "https://via.placeholder.com/1200x700?text=Company+D",
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
        <div className="relative">
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
                  <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={collab.image}
                      alt={collab.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-3xl" />
                    {/* Company Name at Top Center */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-2xl">
                        {collab.name}
                      </h3>
                    </div>
                    {/* Description Overlapping Image */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-white border border-white/20">
                        <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
                          {collab.description}
                        </p>
                        <div className="mt-4 p-3 bg-white/5 rounded-xl">
                          <p className="text-xs sm:text-sm text-gray-200">
                            Add company details, role in event, etc. here.
                          </p>
                        </div>
                      </div>
                    </div>
                    <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary text-primary-foreground rounded-full w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 shadow-xl z-20" />
                    <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary text-primary-foreground rounded-full w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 shadow-xl z-20" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};
