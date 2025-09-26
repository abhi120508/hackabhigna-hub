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
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "hackabhigna@gmail.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+91 98765 43210",
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
            style={{ color: "rgb(201, 114, 219)" }}
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
                  style={{ color: "rgb(201, 114, 219)" }}
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
                  style={{
                    backgroundColor: "rgb(201, 114, 219)",
                    borderColor: "rgb(201, 114, 219)",
                  }}
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "rgba(201, 114, 219, 0.1)" }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: "rgb(201, 114, 219)" }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{info.title}</h3>
                        <p
                          className="font-medium mb-1"
                          style={{ color: "rgb(201, 114, 219)" }}
                        >
                          {info.details}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {info.description}
                        </p>
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
              <HelpCircle
                className="w-6 h-6"
                style={{ color: "rgb(201, 114, 219)" }}
              />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3
                    className="font-semibold"
                    style={{ color: "rgb(201, 114, 219)" }}
                  >
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
