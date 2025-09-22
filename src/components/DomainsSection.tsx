import "./domains.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Smartphone, Brain, Lightbulb } from "lucide-react";
import "./global.css";

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
    <section className="w-full bg-gradient-to-br from-background to-muted/20 py-20 scroll-mt-32 mb-40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="dom_text">Competition Domains</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-white">
            Choose your battleground and showcase your skills in these exciting
            domains
          </p>
        </div>

        <div className="domains-grid">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <Card key={index} className="cards">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`domain-icon ${domain.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{domain.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="domain-description">{domain.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {domain.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} className="domain-badge">
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
