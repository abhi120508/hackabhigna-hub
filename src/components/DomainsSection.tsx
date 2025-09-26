import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Smartphone, Brain, Lightbulb } from "lucide-react";
import "./domains.css";
import "./global.css";

const domains = [
  {
    icon: Globe,
    title: "GenAI/AgenticAI in Agriculture",
    description:
      "Leverage AI to revolutionize farming practices, crop monitoring, and sustainable agriculture solutions.",
    technologies: ["Python", "TensorFlow", "Computer Vision", "IoT"],
    color: "text-primary",
  },
  {
    icon: Brain,
    title: "GenAI/AgenticAI in Education",
    description:
      "Develop intelligent systems using machine learning and AI technologies to transform learning experiences.",
    technologies: ["Python", "TensorFlow", "PyTorch", "OpenAI"],
    color: "text-secondary",
  },
  {
    icon: Lightbulb,
    title: "Wildcard - Environment",
    description:
      "Innovate in environmental sustainability with AI-driven solutions for climate change, conservation, and green tech.",
    technologies: [
      "Machine Learning",
      "Data Analytics",
      "IoT Sensors",
      "Predictive Modeling",
    ],
    color: "text-accent",
  },
  {
    icon: Smartphone,
    title: "Wildcard - Food Production",
    description:
      "Create AI-powered innovations for food security, supply chain optimization, and advanced agricultural production.",
    technologies: [
      "AI Optimization",
      "Blockchain",
      "Robotics",
      "Supply Chain AI",
    ],
    color: "text-primary",
  },
];

export function DomainsSection() {
  return (
    <section className="w-full bg-gradient-to-br from-background to-muted/20 py-10 scroll-mt-32 mb-15 border-border/50 mt-10">
      <div className="max-w-6xl mx-auto px-0">
        <div className="text-center mb-16">
          <h2
            className="dom_text text-4xl font-bold mb-4"
            style={{ fontSize: "2.5rem" }}
          >
            <span className="text-gradient">Competition Domains</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-white">
            Choose your battleground and showcase your skills in these exciting
            domains
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <Card
                key={index}
                className="cards bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`domain-icon p-2 rounded-lg bg-muted/50 ${domain.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{domain.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p
                    className="domain-description text-muted-foreground"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {domain.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {domain.technologies.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="secondary"
                        className="bg-muted/50 text-foreground"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
