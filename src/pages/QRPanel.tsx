import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { QrCode, Scan, CheckCircle, Users, Github, Shield, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MockAPI, TeamRegistration } from "@/lib/mockBackend";
import { MockQRScanner, parseQRCode } from "@/lib/qrUtils";

const domains = [
  { id: "web", label: "Web Development" },
  { id: "mobile", label: "Mobile Development" },
  { id: "ai", label: "Artificial Intelligence" },
  { id: "wildcard", label: "Wildcard" }
];

const QRPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [scannedData, setScannedData] = useState<TeamRegistration | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "volunteer123" && selectedDomains.length > 0) {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: `Volunteer access granted for ${selectedDomains.length} domain(s)`
      });
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid password or no domains selected"
      });
    }
  };

  const handleDomainChange = (domainId: string, checked: boolean) => {
    if (checked) {
      setSelectedDomains(prev => [...prev, domainId]);
    } else {
      setSelectedDomains(prev => prev.filter(id => id !== domainId));
    }
  };

  const simulateQRScan = async () => {
    setIsScanning(true);
    
    try {
      // Use mock QR scanner
      const scanResult = await MockQRScanner.startScan();
      
      if (scanResult.success && scanResult.data) {
        // Parse the QR code data
        const parsed = parseQRCode(scanResult.data);
        
        if (parsed) {
          // Get team data from backend
          const teamResult = await MockAPI.getTeamByQR(parsed.uniqueId);
          
          if (teamResult.success && teamResult.data) {
            setScannedData(teamResult.data);
            toast({
              title: "QR Code Scanned Successfully!",
              description: `Team: ${teamResult.data.teamName} (${teamResult.data.uniqueId})`,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Team Not Found",
              description: "No team found with this QR code.",
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Invalid QR Code",
            description: "QR code format is invalid.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: "Could not read QR code. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scanning Error",
        description: "An error occurred while scanning.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleActivateRepository = async () => {
    if (!scannedData || !scannedData.githubRepo) return;
    
    setIsActivating(true);
    
    // Simulate repository activation (opening in new tab)
    window.open(scannedData.githubRepo, '_blank');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Repository Opened!",
      description: `GitHub repository opened for ${scannedData.teamName}`,
    });
    
    setIsActivating(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-gradient">Volunteer Access</CardTitle>
            <p className="text-muted-foreground">Select domains and enter volunteer password</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label className="text-base font-medium">Select Domains to Manage</Label>
                <div className="mt-3 space-y-3">
                  {domains.map((domain) => (
                    <div key={domain.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={domain.id}
                        checked={selectedDomains.includes(domain.id)}
                        onCheckedChange={(checked) => handleDomainChange(domain.id, checked as boolean)}
                      />
                      <Label htmlFor={domain.id} className="text-sm font-normal cursor-pointer">
                        {domain.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="password">Volunteer Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter volunteer password"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" variant="hero">
                Access QR Scanner
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">QR Panel</h1>
          <p className="text-muted-foreground">
            Scan team QR codes to activate repositories on hackathon day
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {selectedDomains.map(domainId => {
              const domain = domains.find(d => d.id === domainId);
              return (
                <Badge key={domainId} variant="outline">
                  {domain?.label}
                </Badge>
              );
            })}
          </div>
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
                       <h4 className="font-semibold text-sm text-muted-foreground mb-1">Unique ID</h4>
                       <p className="font-mono text-sm bg-muted/50 px-2 py-1 rounded text-primary">
                         {scannedData.uniqueId}
                       </p>
                     </div>
                     <div>
                       <h4 className="font-semibold text-sm text-muted-foreground mb-1">Domain</h4>
                       <Badge variant="outline">{scannedData.domain}</Badge>
                     </div>
                     <div>
                       <h4 className="font-semibold text-sm text-muted-foreground mb-2">Contact Info</h4>
                       <div className="space-y-1 text-sm">
                         <div className="flex items-center gap-2">
                           <Phone className="w-3 h-3" />
                           <span>Leader: {scannedData.leaderMobile}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <Phone className="w-3 h-3" />
                           <span>Alt: {scannedData.alternateMobile}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="space-y-4">
                     <div>
                       <h4 className="font-semibold text-sm text-muted-foreground mb-2">Team Members</h4>
                       <div className="space-y-1">
                         {scannedData.participants.map((participant, index) => (
                           <div key={index} className="text-sm flex items-center justify-between">
                             <span>{participant.name}
                               {index === scannedData.leaderIndex && (
                                 <Badge variant="outline" className="ml-2 text-xs">Leader</Badge>
                               )}
                             </span>
                             <div className="text-xs text-muted-foreground flex items-center gap-1">
                               <Mail className="w-3 h-3" />
                               {participant.email}
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                     <div>
                       <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                         GitHub Repository
                       </h4>
                       <p className="text-sm font-mono bg-muted/50 px-2 py-1 rounded break-all text-primary">
                         {scannedData.githubRepo}
                       </p>
                     </div>
                     <div>
                       <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                         Original Repository
                       </h4>
                       <a
                         href={scannedData.gitRepo}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-sm font-mono bg-muted/50 px-2 py-1 rounded break-all text-blue-500 hover:underline block"
                       >
                         {scannedData.gitRepo}
                       </a>
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