import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const judges = [
  {
    name: "Dr. Jane Smith",
    title: "AI Expert & Professor",
    description: "Renowned researcher in machine learning and ethics.",
    image: "https://via.placeholder.com/400x300?text=Dr.+Jane+Smith",
  },
  {
    name: "Prof. John Doe",
    title: "Tech Entrepreneur",
    description: "Founder of multiple startups in fintech and blockchain.",
    image: "https://via.placeholder.com/400x300?text=Prof.+John+Doe",
  },
  {
    name: "Ms. Alice Johnson",
    title: "Industry Veteran",
    description: "20+ years in software engineering and innovation.",
    image: "https://via.placeholder.com/400x300?text=Ms.+Alice+Johnson",
  },
  {
    name: "Dr. Bob Wilson",
    title: "Sustainability Specialist",
    description: "Expert in green tech and environmental AI applications.",
    image: "https://via.placeholder.com/400x300?text=Dr.+Bob+Wilson",
  },
];

export const Judges = () => {
  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Our Judges
        </h2>
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent className="-ml-1">
            {judges.map((judge, index) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="border-0 bg-transparent backdrop-blur-sm">
                    <CardHeader>
                      <img
                        src={judge.image}
                        alt={judge.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardTitle className="text-xl font-semibold text-white mb-1">
                        {judge.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground mb-2">
                        {judge.title}
                      </CardDescription>
                      <CardDescription className="text-muted-foreground">
                        {judge.description}
                        {/* Space for more info */}
                        <div className="mt-4 p-4 border-t border-border/20">
                          <p className="text-sm">
                            Add bio, expertise, etc. here.
                          </p>
                        </div>
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-primary/80 hover:bg-primary text-primary-foreground" />
          <CarouselNext className="bg-primary/80 hover:bg-primary text-primary-foreground" />
        </Carousel>
      </div>
    </section>
  );
};
