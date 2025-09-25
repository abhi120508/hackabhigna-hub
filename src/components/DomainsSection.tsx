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
    <section className="w-full bg-gradient-to-br from-background to-muted/20 py-10 scroll-mt-32 mb-15 border-border/50 mt-10"> 
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {/* CHANGE 1: Reduced header font size from 2.5rem to 2rem via inline style */}
          <h2 
            className="dom_text" 
            style={{ fontSize: '2.5rem' }}
          >
            Competition Domains
          </h2>
          {/* CHANGE 2: Reduced description font size from text-xl to text-lg */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-white">
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
                      {/* CHANGE 3: Reduced icon size from w-6 h-6 to w-5 h-5 */}
                      <Icon className="w-6 h-6" />
                    </div>
                    {/* CHANGE 4: Reduced card title font size from text-xl to text-lg */}
                    <CardTitle className="text-xl">{domain.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* CHANGE 5: Added inline style to reduce description font size from 1rem to 0.875rem */}
                  <p 
                    className="domain-description" 
                    style={{ fontSize: '0.875rem' }}
                  >
                    {domain.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}