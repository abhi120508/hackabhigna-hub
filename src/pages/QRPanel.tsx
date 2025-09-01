import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Scan, CheckCircle, Users, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScannedTeam {
  teamName: string;
  teamId: string;
  gitUsername: string;
  participants: string[];
  domain: string;
}

const QRPanel = () => {
  const [scannedData, setScannedData] = useState<ScannedTeam | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  // Mock QR scan function
  const simulateQRScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      // Simulate scanned QR data
      const mockData: ScannedTeam = {
        teamName: "Code Warriors",
        teamId: "team-001",
        gitUsername: "hackabhigna-org",
        participants: ["John Doe", "Jane Smith", "Bob Wilson"],
        domain: "Web Development"
      };
      
      setScannedData(mockData);
      setIsScanning(false);
      
      toast({
        title: "QR Code Scanned Successfully",
        description: `Team "${mockData.teamName}" information loaded`
      });
    }, 2000);
  };

  const handleActivateRepository = async () => {
    if (!scannedData) return;
    
    setIsActivating(true);
    
    // Simulate repository activation
    setTimeout(() => {
      const repoUrl = `https://github.com/${scannedData.gitUsername}/${scannedData.teamId}`;
      
      toast({
        title: "Repository Activated!",
        description: `Repository activated and email sent to team lead with access details.`
      });
      
      setIsActivating(false);
      
      // Reset for next scan
      setTimeout(() => {
        setScannedData(null);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">QR Panel</h1>
          <p className="text-muted-foreground">
            Scan team QR codes to activate repositories on hackathon day
          </p>
        </div>

        <div className="grid gap-8">
          {/* QR Scanner */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <QrCode className="w-6 h-6 text-primary" />
                QR Code Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {!scannedData ? (
                <>
                  <div className="w-64 h-64 mx-auto border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20">
                    {isScanning ? (
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Scanning QR Code...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Scan className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click scan to read QR code</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={simulateQRScan}
                    disabled={isScanning}
                    variant="hero"
                    size="lg"
                  >
                    {isScanning ? "Scanning..." : "Scan QR Code"}
                  </Button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-2">
                    QR Code Scanned Successfully
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Information */}
          {scannedData && (
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Team Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Team Name</h4>
                      <p className="text-lg font-medium">{scannedData.teamName}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Team ID</h4>
                      <p className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                        {scannedData.teamId}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Domain</h4>
                      <Badge variant="outline">{scannedData.domain}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">Team Members</h4>
                      <div className="space-y-1">
                        {scannedData.participants.map((participant, index) => (
                          <p key={index} className="text-sm">{participant}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                        Repository URL
                      </h4>
                      <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded break-all">
                        https://github.com/{scannedData.gitUsername}/{scannedData.teamId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t text-center">
                  <Button
                    onClick={handleActivateRepository}
                    disabled={isActivating}
                    variant="hero"
                    size="lg"
                    className="px-8"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    {isActivating ? "Activating Repository..." : "Activate Repository"}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will unlock the repository and send access details to the team lead
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRPanel;