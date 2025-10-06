import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Globe, Smartphone, Brain, Lightbulb } from "lucide-react";
import "./domains.css";
import "./global.css";
import { useState } from "react";
import jsPDF from "jspdf";

const domains = [
  {
    icon: Globe,
    title: "AI-Powered Autonomous SEO & Marketing Optimization",
    description:
      "AI agents that continuously improve SEO, AEO, content, and marketing campaigns",
    color: "text-primary",
    problemStatements: [
      {
        title: "Autonomous SEO & AEO Optimization Agent",
        description:
          "Businesses struggle to optimize websites and app listings across multiple platforms. Build an AI agent that continuously monitors pages, predicts search rankings, and automatically suggests or implements improvements.",
        objectives: [
          "Evaluate content, meta tags, keywords, and technical SEO.",
          "Score SEO/AEO performance for website/app pages.",
          "Recommend or auto-update content for better rankings.",
        ],
        technicalComponents:
          "NLP for keyword & meta analysis, web crawling, backend AI processing, frontend dashboard with live results.",
        expectedOutput:
          "Real-time SEO/AEO score dashboard with actionable recommendations.",
      },
      {
        title: "Predictive Content & Keyword Generator",
        description:
          "Content creation often lacks data-driven strategy. Build a system that generates optimized content and keywords, predicts engagement and ranking improvements, and suggests posting schedule.",
        objectives: [
          "Generate blogs, landing pages, or app descriptions optimized for SEO/AEO.",
          "Predict search ranking or engagement improvement.",
          "Suggest posting schedule for maximum visibility.",
        ],
        technicalComponents:
          "GPT/NLP models for content, predictive analytics for engagement, API for posting schedule suggestions.",
        expectedOutput:
          "Suggested content with predicted SEO/AEO impact, keywords, and posting recommendations.",
      },
      {
        title: "Multi-Channel Search Performance Predictor",
        description:
          "Digital marketers lack an integrated view across platforms. Build an agent that predicts traffic and engagement based on SEO, AEO, and social media metrics.",
        objectives: [
          "Aggregate metrics from websites, app stores, and social media.",
          "Predict keyword and content performance across channels.",
          "Suggest actions for campaigns based on predicted trends.",
        ],
        technicalComponents:
          "Multi-source API integration, AI predictive modeling, real-time dashboard visualization.",
        expectedOutput:
          "Multi-channel predictions with actionable recommendations.",
      },
      {
        title: "Autonomous On-Page & Technical SEO Auditor",
        description:
          "Technical SEO issues are hard to track and fix at scale. Build an agent that audits sites, identifies errors, and generates automated improvement plans.",
        objectives: [
          "Detect technical SEO issues (page speed, mobile-friendliness, schema, broken links).",
          "Recommend fixes and simulate impact on ranking.",
          "Optionally implement changes automatically.",
        ],
        technicalComponents:
          "Web crawlers, AI-based scoring system, automated patch suggestions, visualization dashboard.",
        expectedOutput:
          "Technical audit reports with improvement recommendations.",
      },
      {
        title: "AI-Powered SERP & Competitor Insights Agent",
        description:
          "Competitor analysis is manual and time-consuming. Build an AI agent that tracks competitor rankings, predicts trends, and recommends strategies to outperform them.",
        objectives: [
          "Monitor competitor SEO and AEO metrics.",
          "Predict changes in rankings and keyword effectiveness.",
          "Suggest proactive actions for content, keywords, and campaigns.",
        ],
        technicalComponents:
          "Web scraping, predictive AI models, competitive analysis dashboards.",
        expectedOutput:
          "Actionable competitor insights and strategy recommendations.",
      },
    ],
  },
  {
    icon: Brain,
    title: "Fullstack Marketing Analytics & Agentic Flow Platforms",
    description:
      "Platforms combining analytics, predictive AI, SEO/AEO, SMM, and automated agentic workflows",
    color: "text-secondary",
    problemStatements: [
      {
        title: "Autonomous Marketing Dashboard",
        description:
          "Businesses need a unified view of campaigns across channels. Build a platform that aggregates SEO, AEO, and social media metrics, predicts trends, and triggers AI-driven workflows.",
        objectives: [
          "Aggregate data from websites, app stores, social media, and ad platforms.",
          "Predict engagement, ranking, and ROI trends.",
          "Trigger automated campaign adjustments.",
        ],
        technicalComponents:
          "Fullstack integration (React + Node/Flask), multi-source API integration, predictive AI modules, dashboard visualizations.",
        expectedOutput:
          "Interactive dashboard with insights, predictions, and automated action triggers.",
      },
      {
        title: "Predictive Lead & Conversion Optimization Agent",
        description:
          "Marketing teams struggle to identify high-value leads. Build an agent that predicts conversion likelihood and triggers automated workflows to maximize ROI.",
        objectives: [
          "Score leads based on engagement, behavior, and demographics.",
          "Segment leads for personalized campaigns.",
          "Trigger actions (emails, notifications, ads) automatically.",
        ],
        technicalComponents:
          "ML models for lead scoring, backend automation workflows, frontend visualization of scores and actions.",
        expectedOutput:
          "Lead scoring dashboard with automated campaign triggers.",
      },
      {
        title: "AI-Driven Content Gap & Opportunity Finder",
        description:
          "Businesses fail to target all high-value content opportunities. Build a tool that identifies gaps vs. competitors, predicts content impact, and suggests optimized content strategies.",
        objectives: [
          "Analyze competitor content, engagement, and SEO.",
          "Identify underutilized keywords and topics.",
          "Recommend new content and predict engagement/ranking improvements.",
        ],
        technicalComponents:
          "NLP for content analysis, competitor data scraping, AI predictions, frontend dashboard.",
        expectedOutput:
          "Gap analysis report with actionable content opportunities.",
      },
      {
        title: "Social Media & Search Optimization Flow Agent",
        description:
          "Optimizing multi-channel campaigns manually is inefficient. Build an agent that monitors SEO/AEO metrics and social engagement, predicts trending topics, and autonomously updates campaigns.",
        objectives: [
          "Monitor multi-channel metrics in real-time.",
          "Predict high-impact topics, keywords, and posting times.",
          "Trigger content updates and campaign adjustments automatically.",
        ],
        technicalComponents:
          "AI predictive models, automated workflow engine, API integrations with social and SEO platforms.",
        expectedOutput:
          "Real-time optimization dashboard with autonomous updates.",
      },
      {
        title: "Influencer & Campaign ROI Prediction Agent",
        description:
          "Companies invest in influencers without precise ROI tracking. Build a system that predicts campaign ROI based on engagement, SEO, and AEO metrics, and reallocates resources dynamically.",
        objectives: [
          "Track influencer campaigns and multi-channel engagement.",
          "Predict ROI using AI models.",
          "Reallocate budgets or adjust campaigns autonomously for better ROI.",
        ],
        technicalComponents:
          "Predictive AI models, backend workflow automation, dashboard visualizations, multi-channel API integration.",
        expectedOutput:
          "ROI dashboard with actionable agentic suggestions and automated adjustments.",
      },
    ],
  },
  {
    icon: Lightbulb,
    title: "Wildcard - Environment",
    description:
      "Innovate in environmental sustainability with AI-driven solutions for climate change, conservation, and green tech.",

    color: "text-accent",
    problemStatements: [
      {
        title: "Note",
        description:
          "The one on-spot Problem Statement will be given on the Hackathon Day by Environ India",
        objectives: [],
        technicalComponents: "",
        expectedOutput: "",
      },
    ],
  },

  /*
  {
    icon: Smartphone,
    title: "Wildcard - Food Production",
    description:
      "Create AI-powered innovations for food security, supply chain optimization, and advanced agricultural production.",
    color: "text-primary",
    problemStatements: [],
  },
  */
];

export function DomainsSection() {
  const [selectedDomain, setSelectedDomain] = useState<
    (typeof domains)[0] | null
  >(null);
  const [open, setOpen] = useState(false);

  const handleViewProblems = (domain: (typeof domains)[0]) => {
    setSelectedDomain(domain);
    setOpen(true);
  };

  const downloadPDF = (domain: (typeof domains)[0]) => {
    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(16);
    doc.text(domain.title, 10, y);
    y += 15;

    // Note
    doc.setFontSize(10);
    doc.text(
      "Note: The below problem statements were listed by the judges and industry experts for reference. Participants can use these Problem statements or come up with their own Problem statements and solutions in that particular domain.",
      10,
      y,
      { maxWidth: 190 }
    );
    y += 20;

    // Problem Statements
    domain.problemStatements.forEach((ps, idx) => {
      doc.setFontSize(12);
      doc.text(`${idx + 1}. ${ps.title}`, 10, y);
      y += 10;

      doc.setFontSize(10);
      const descLines = doc.splitTextToSize(ps.description, 190);
      doc.text(descLines, 10, y);
      y += descLines.length * 7;

      // Objectives
      doc.text("Objectives:", 10, y);
      y += 7;
      ps.objectives.forEach((obj) => {
        const objLines = doc.splitTextToSize(`• ${obj}`, 180);
        doc.text(objLines, 15, y);
        y += objLines.length * 7;
      });
      y += 5;

      // Technical Components
      doc.text("Technical Components:", 10, y);
      y += 7;
      const techLines = doc.splitTextToSize(ps.technicalComponents, 190);
      doc.text(techLines, 10, y);
      y += techLines.length * 7;

      // Expected Output
      doc.text("Expected Output:", 10, y);
      y += 7;
      const outputLines = doc.splitTextToSize(ps.expectedOutput, 190);
      doc.text(outputLines, 10, y);
      y += outputLines.length * 7 + 10; // Extra space

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    // Judgement note
    doc.text("Check brochure for judgement criteria", 10, y);

    doc.save(
      `${domain.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_problem_statements.pdf`
    );
  };

  return (
    <>
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
              Choose your battleground and showcase your skills in these
              exciting domains
            </p>
          </div>

          <div className="domains-grid grid grid-cols-1 md:grid-cols-2 gap-6">
            {domains.map((domain, index) => {
              const Icon = domain.icon;
              const isLast = index === domains.length - 1;
              return (
                <div
                  key={index}
                  className={
                    isLast
                      ? "flex flex-col items-center md:justify-center md:col-span-2 mt-8"
                      : ""
                  }
                  style={undefined}
                >
                  <Card className="w-full cards bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div
                          className={`domain-icon p-2 rounded-lg bg-muted/50 ${domain.color}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl">
                          {domain.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p
                        className="domain-description text-muted-foreground"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {domain.description}
                      </p>
                      {domain.title === "Wildcard - Environment" ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> The one on-spot Problem
                            Statement will be given on the Hackathon Day by
                            Environ India
                          </p>
                        </div>
                      ) : domain.problemStatements &&
                        domain.problemStatements.length > 0 ? (
                        <Button
                          onClick={() => handleViewProblems(domain)}
                          className="w-full mt-4"
                        >
                          View Problem Statements
                        </Button>
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="mt-12 px-4">
            <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
              Important Notes for Participants:
            </h3>
            <ol className="list-decimal space-y-3 max-w-full sm:max-w-3xl mx-auto text-muted-foreground text-sm leading-relaxed pl-4 sm:pl-6">
              <li>
                Using AI tools to generate code is allowed and expected—but
                judges will focus on how well you interpret, integrate, and
                expand AI outputs.
              </li>
              <li>
                Autonomous decision-making (agentic flow) in your solution is
                highly encouraged.
              </li>
              <li>
                Multi-channel thinking (SEO + AEO + SMM) will be rewarded.
              </li>
              <li>
                Clear documentation and explanation of AI decisions will improve
                your score.
              </li>
            </ol>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedDomain?.title} - Problem Statements
              </DialogTitle>
            </DialogHeader>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The below problem statements were listed
                by the judges and industry experts for reference. Participants
                can use these Problem statements or come up with their own
                Problem statements and solutions in that particular domain.
              </p>
            </div>
            <div className="space-y-6">
              {selectedDomain?.problemStatements?.map((ps, idx) => (
                <div key={idx} className="border-b pb-4 last:border-b-0">
                  <h3 className="text-lg font-semibold mb-2">
                    {idx + 1}. {ps.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {ps.description}
                  </p>
                  <div className="mb-3">
                    <h4 className="font-medium mb-1">Objectives:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {ps.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <h4 className="font-medium mb-1">Technical Components:</h4>
                    <p className="text-sm text-muted-foreground">
                      {ps.technicalComponents}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Expected Output:</h4>
                    <p className="text-sm text-muted-foreground">
                      {ps.expectedOutput}
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-6 pt-4 border-t">
                <Button
                  onClick={() => selectedDomain && downloadPDF(selectedDomain)}
                  variant="outline"
                  className="w-full"
                >
                  Download Problem Statements
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Check brochure for judgement criteria
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
