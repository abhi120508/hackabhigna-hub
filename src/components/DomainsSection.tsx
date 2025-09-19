import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Smartphone, Brain, Lightbulb } from "lucide-react";

const domains = [
  {
    icon: Globe,
    title: "GenAI/AgenticAI in Agriculture",
    description:
      "Choose your battleground and showcase your skills in these exciting domains",
    technologies: ["React", "Node.js", "TypeScript", "Next.js"],
    color: "text-primary",
  },
  {
    icon: Smartphone,
    title: "GenAI/AgenticAI in FinTech",
    description:
      "Create innovative mobile applications for iOS and Android platforms.",
    technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
    color: "text-accent",
  },
  {
    icon: Brain,
    title: "GenAI/AgenticAI in Education",
    description:
      "Develop intelligent systems using machine learning and AI technologies.",
    technologies: ["Python", "TensorFlow", "PyTorch", "OpenAI"],
    color: "text-secondary",
  },
  {
    icon: Lightbulb,
    title: "Wildcard (Open Innovation)",
    description:
      "Think outside the box! Create something unique that doesn't fit traditional categories.",
    technologies: ["IoT", "Blockchain", "AR/VR", "Quantum"],
    color: "text-primary",
  },
];

export function DomainsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Competition Domains</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your battleground and showcase your skills in these exciting
            domains
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-muted/50 ${domain.color}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{domain.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{domain.description}</p>
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
