<<<<<<< HEAD
=======


// Brochure.tsx
>>>>>>> friend-updates
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  FileText,
  Award,
  Users,
  Clock,
  Trophy,
  Calendar,
  MapPin,
} from "lucide-react";
<<<<<<< HEAD

export function Brochure() {
  const handleDownload = () => {
    // In a real app, this would download the actual brochure PDF
=======
import "./global.css";
import "./Brochure.css";

export function Brochure() {
  const handleDownload = () => {
>>>>>>> friend-updates
    alert("Brochure download will be available soon!");
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">HackAbhigna</span>
            <span className="text-accent-gradient"> 2025</span>
          </h1>
          <p className="text-xl text-muted-foreground">
=======
    <section
      className="w-full bg-gradient-to-br from-background to-muted/20 py-20 scroll-mt-102 mb-10"
      style={{ marginTop: "180px" }}

            
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span
              className="text-white font-bold"
              style={{
                fontFamily: "Orbitron, sans-serif",
                color: "rgb(201, 114, 219)",
              }}
            >
              HackAbhigna&nbsp;2025
            </span>
          </h1>
          <p
            className="text-white font-bold"
            style={{ fontSize: "1.25em" }}
          >
>>>>>>> friend-updates
            Official Event Brochure
          </p>
        </div>

<<<<<<< HEAD
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <FileText className="w-6 h-6" />
=======
        {/* Event Overview Card */}
        <Card className="mb-8 mt-20">
          <CardHeader className="text-center">
            <CardTitle
              className="flex items-center justify-center gap-2"
              style={{ fontSize: "20px" }}
            >
              <FileText className="w-6 h-6 custom-purple-icon" />
>>>>>>> friend-updates
              Event Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Date</h3>
                    <p className="text-sm text-muted-foreground">
                      October 16-17, 2025
=======
                  <Calendar className="w-5 h-5 custom-purple-icon" />
                  <div>
                    <h3 className="font-semibold">Date</h3>
                    <p className="text-sm text-muted-foreground">
                      October 16–17, 2025
>>>>>>> friend-updates
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <MapPin className="w-5 h-5 text-primary" />
=======
                  <MapPin className="w-5 h-5 custom-purple-icon" />
>>>>>>> friend-updates
                  <div>
                    <h3 className="font-semibold">Venue</h3>
                    <p className="text-sm text-muted-foreground">
                      AIT Campus, Chikkamagaluru
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Team Size</h3>
                    <p className="text-sm text-muted-foreground">
                      2-4 members per team
=======
                  <Users className="w-5 h-5 custom-purple-icon" />
                  <div>
                    <h3 className="font-semibold">Team Size</h3>
                    <p className="text-sm text-muted-foreground">
                      2–4 members per team
>>>>>>> friend-updates
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <Clock className="w-5 h-5 text-primary" />
=======
                  <Clock className="w-5 h-5 custom-purple-icon" />
>>>>>>> friend-updates
                  <div>
                    <h3 className="font-semibold">Duration</h3>
                    <p className="text-sm text-muted-foreground">24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <Trophy className="w-5 h-5 text-primary" />
=======
                  <Trophy className="w-5 h-5 custom-purple-icon" />
>>>>>>> friend-updates
                  <div>
                    <h3 className="font-semibold">Prize Pool</h3>
                    <p className="text-sm text-muted-foreground">₹1,00,000+</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
<<<<<<< HEAD
                  <Award className="w-5 h-5 text-primary" />
=======
                  <Award className="w-5 h-5 custom-purple-icon" />
>>>>>>> friend-updates
                  <div>
                    <h3 className="font-semibold">Domains</h3>
                    <p className="text-sm text-muted-foreground">
                      4 innovative domains
                    </p>
                  </div>
                </div>
              </div>
            </div>

<<<<<<< HEAD
            <div className="text-center pt-6">
              <Button onClick={handleDownload} size="lg" className="gap-2">
=======
            {/* Button */}
            <div className="text-center pt-6">
              <Button
                onClick={handleDownload}
                size="lg"
                className="gap-2 custom-brochure-button"
              >
>>>>>>> friend-updates
                <Download className="w-5 h-5" />
                Download Brochure
              </Button>
            </div>
          </CardContent>
        </Card>
<<<<<<< HEAD

        <Card>
          <CardHeader>
            <CardTitle>Competition Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Web Development</h3>
                <p className="text-sm text-muted-foreground">
                  Build innovative web applications and platforms
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Mobile Development</h3>
                <p className="text-sm text-muted-foreground">
                  Create cutting-edge mobile applications
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Artificial Intelligence</h3>
                <p className="text-sm text-muted-foreground">
                  Develop AI-powered solutions and models
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Wildcard</h3>
                <p className="text-sm text-muted-foreground">
                  Open innovation - anything goes!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
=======
      </div>
    </section>
  );
}
>>>>>>> friend-updates
