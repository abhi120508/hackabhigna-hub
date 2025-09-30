import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Footer } from "./Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Typing animation component
  const TypingAnimation = () => {
    const [displayText, setDisplayText] = useState("");
    const fullText = "HACKABHIGNA";

    useEffect(() => {
      if (!isLoading) {
        setDisplayText("");
        return;
      }

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          // Reset and start again
          currentIndex = 0;
        }
      }, 150); // Typing speed

      return () => clearInterval(interval);
    }, [isLoading]);

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-bold text-blue-400 mb-4 font-mono">
            {displayText}
            <span className="animate-pulse">|</span>
          </div>
          <div className="text-white text-lg">Sending your message...</div>
        </div>
      </div>
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "https://hackabhigna-hub.onrender.com"
        }/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting message:", error);
      alert(
        `Failed to send message. Error: ${
          error instanceof Error ? error.message : "Network error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "hackabhigna2025@gmail.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+91 8296590632",
      description: "Mon-Fri from 8am to 5pm",
    },
    {
      icon: MapPin,
      title: "Address",
      details: "Adichunchanagiri Institute Of Technology , Chikkamagaluru",
      description: "Visit our campus",
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: "Mon-Fri: 8am-5pm",
      description: "We're here to help",
    },
  ];

  const faqs = [
    {
      question: "How do I register for the hackathon?",
      answer:
        "You can register through our website by filling out the registration form and submitting your team details.",
    },
    {
      question: "What is the team size limit?",
      answer: "Teams can have 2-4 members. Solo participation is not allowed.",
    },
    {
      question: "Is there a registration fee?",
      answer:
        "Yes, there is a nominal registration fee. Details are available in the brochure.",
    },
    {
      question: "What should I bring to the event?",
      answer:
        "Bring your laptop, charger, student ID, and any necessary development tools. Food and refreshments will be provided.",
    },
  ];

  return (
    <div
      id="contact"
      className="w-full bg-gradient-to-br from-background to-muted/20 py-20 scroll-mt-32 mb-0"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 text-white text-2xl font-bold bg-transparent border-none">
            Get In Touch
          </Badge>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ color: "#60a5fa" }}
          >
            Contact Us
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about HackAbhigna? We're here to help! Reach out to
            us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare
                  className="w-6 h-6"
                  style={{ color: "#60a5fa" }}
                />
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                  style={{
                    backgroundColor: "#1d4ed8",
                    borderColor: "#1d4ed8",
                  }}
                >
                  <Send className="w-4 h-4" />
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const isAddress = info.title === "Address";

              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "rgba(96, 165, 250, 0.1)" }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: "#60a5fa" }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p
                          className="font-medium mb-1"
                          style={{ color: "#60a5fa" }}
                        >
                          {info.details}
                        </p>
                        {isAddress ? (
                          <button
                            className="text-sm text-muted-foreground hover:text-blue-400 transition-colors duration-300 cursor-pointer underline"
                            onClick={() =>
                              window.open(
                                "https://maps.app.goo.gl/DZxJNrAsFtXdQar7A",
                                "_blank"
                              )
                            }
                          >
                            {info.description}
                          </button>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {info.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6" style={{ color: "#60a5fa" }} />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold" style={{ color: "#60a5fa" }}>
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {isLoading && <TypingAnimation />}
      <Footer />
    </div>
  );
}
