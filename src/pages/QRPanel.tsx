import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { QrCode, Scan, CheckCircle, Users, Github, Shield, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TeamRegistration } from "@/lib/mockBackend";
import { parseQRCode } from "@/lib/qrUtils";

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

  // Backend API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Refs for camera scanning
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Manual input fallback
  const [manualInput, setManualInput] = useState("");

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

  const stopScan = () => {
    setIsScanning(false);
    try {
      const tracks = streamRef.current?.getTracks();
      tracks?.forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } catch {}
  };

  const fetchTeamByUniqueId = async (uniqueId: string) => {
    try {
      const response = await fetch(`${API_URL}/teams/${uniqueId}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            variant: "destructive",
            title: "Team Not Found",
            description: "No team found with this Unique ID.",
          });
          return;
        }
        throw new Error("Failed to fetch team");
      }
      const result = await response.json();
      if (result.success && result.data) {
        setScannedData(result.data);
        toast({
          title: "QR Code Scanned Successfully!",
          description: `Team: ${result.data.teamName} (${result.data.uniqueId})`,
        });
        stopScan();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Could not fetch team details. Please try again.",
      });
    }
  };

  const handleQRData = async (data: string) => {
    const parsed = parseQRCode(data);
    if (!parsed) {
      toast({
        variant: "destructive",
        title: "Invalid QR Code",
        description: "QR code format is invalid.",
      });
      return;
    }
    await fetchTeamByUniqueId(parsed.uniqueId);
  };

  const startCameraScan = async () => {
    setIsScanning(true);
    try {
      // Use native BarcodeDetector if available
      // @ts-ignore
      if ("BarcodeDetector" in window) {
        // @ts-ignore
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          (videoRef.current as any).srcObject = stream;
          await videoRef.current.play();
        }

        const scanLoop = async () => {
          if (!isScanning || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes && codes.length > 0) {
              await handleQRData(codes[0].rawValue);
              return;
            }
          } catch {}
          requestAnimationFrame(scanLoop);
        };
        requestAnimationFrame(scanLoop);
      } else {
        // Fallback: prompt user to paste QR content or Unique ID
        toast({
          title: "Camera scanning not supported",
          description: "Paste the QR content or enter Unique ID below.",
        });
        setIsScanning(false);
      }
    } catch (error) {
      setIsScanning(false);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Unable to access camera. Check permissions and try again.",
      });
    }
  };

  const handleManualFetch = async () => {
    if (!manualInput.trim()) return;
    await handleQRData(manualInput.trim());
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
                  <div className="w-64 h-64 mx-auto border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted/20 relative flex items-center justify-center">
                    {isScanning ? (
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <div className="text-center">
                        <Scan className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click scan to read QR code</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={isScanning ? stopScan : startCameraScan}
                    variant="hero"
                    size="lg"
                  >
                    {isScanning ? "Stop Scanning" : "Start Camera Scan"}
                  </Button>

                  <div className="space-y-2">
                    <Label htmlFor="manual-input">Or paste QR URL / Unique ID</Label>
                    <div className="flex gap-2 max-w-md mx-auto">
                      <Input
                        id="manual-input"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="https://hackabhigna.com/qr/ABCD001 or ABCD001"
                      />
                      <Button onClick={handleManualFetch} variant="outline" disabled={!manualInput.trim()}>
                        Fetch Team
                      </Button>
                    </div>
                  </div>
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