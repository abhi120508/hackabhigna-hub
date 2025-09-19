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

export function Brochure() {
  const handleDownload = () => {
    // In a real app, this would download the actual brochure PDF
    alert("Brochure download will be available soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">HackAbhigna</span>
            <span className="text-accent-gradient"> 2024</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Official Event Brochure
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <FileText className="w-6 h-6" />
              Event Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Date</h3>
                    <p className="text-sm text-muted-foreground">
                      October 16-17, 2024
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Venue</h3>
                    <p className="text-sm text-muted-foreground">
                      AIT Campus, Bangalore
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Team Size</h3>
                    <p className="text-sm text-muted-foreground">
                      2-4 members per team
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Duration</h3>
                    <p className="text-sm text-muted-foreground">24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Prize Pool</h3>
                    <p className="text-sm text-muted-foreground">₹1,00,000+</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Domains</h3>
                    <p className="text-sm text-muted-foreground">
                      4 innovative domains
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-6">
              <Button onClick={handleDownload} size="lg" className="gap-2">
                <Download className="w-5 h-5" />
                Download Brochure
              </Button>
            </div>
          </CardContent>
        </Card>

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
