import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  MinusCircle,
  Upload,
  Users,
  Mail,
  Github,
  CreditCard,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";

interface Participant {
  name: string;
  email: string;
  college: string;
  mobile?: string;
}

interface DomainSetting {
  domain: string;
  slotsLeft: number;
  paused: boolean;
}

const domains = [
  {
    value: "GenAI/AgenticAI in Agriculture",
    label: "GenAI/AgenticAI in Agriculture",
  },
  {
    value: "GenAI/AgenticAI in Education",
    label: "GenAI/AgenticAI in Education",
  },
  {
    value: "Wildcard - Environment",
    label: "Wildcard - Environment",
  },
  {
    value: "Wildcard - Food Production",
    label: "Wildcard - Food Production",
  },
];

export function RegistrationForm() {
  const [teamName, setTeamName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", email: "", college: "", mobile: "" },
    { name: "", email: "", college: "", mobile: "" },
  ]);
  const [leaderIndex, setLeaderIndex] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [gitRepo, setGitRepo] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [leaderMobile, setLeaderMobile] = useState("");
  const [alternateMobile, setAlternateMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domainSlotsLeft, setDomainSlotsLeft] = useState<
    Record<string, number>
  >({});
  const [domainPaused, setDomainPaused] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Fetch real domain settings including slots left from backend
    // Poll every 10 seconds for real-time updates
    const fetchDomainSettings = async () => {
      try {
        const response = await axios.get(
          "https://hackabhigna-hub.onrender.com/domain-settings"
        );
        const slotsMap: { [key: string]: number } = {};
        const pausedMap: { [key: string]: boolean } = {};
        response.data.forEach((domainSetting: any) => {
          // Defensive check for slotsLeft property existence and type
          const slotsLeft =
            typeof domainSetting.slotsLeft === "number"
              ? domainSetting.slotsLeft
              : 0;
          // Defensive check for paused property
          const paused = Boolean(domainSetting.paused);
          // Defensive check for domain property existence and type
          const domain =
            typeof domainSetting.domain === "string"
              ? domainSetting.domain.toLowerCase()
              : "";
          if (domain) {
            slotsMap[domain] = slotsLeft;
            pausedMap[domain] = paused;
          }
        });
        setDomainSlotsLeft(slotsMap);
        setDomainPaused(pausedMap);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching domain slots",
          description: error.message || "Failed to fetch domain slots left",
        });
      }
    };
    fetchDomainSettings();
    const interval = setInterval(fetchDomainSettings, 10000);
    return () => clearInterval(interval);
  }, [toast]);

  const addParticipant = () => {
    if (participants.length < 4) {
      setParticipants([
        ...participants,
        { name: "", email: "", college: "", mobile: "" },
      ]);
    }
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 2) {
      const newParticipants = participants.filter((_, i) => i !== index);
      setParticipants(newParticipants);
      if (index === leaderIndex) {
        setLeaderIndex(0);
      } else if (index < leaderIndex) {
        setLeaderIndex(leaderIndex - 1);
      }
    }
  };

  const updateParticipant = (
    index: number,
    field: keyof Participant,
    value: string
  ) => {
    const updated = participants.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    setParticipants(updated);
  };

  const validateForm = () => {
    if (!teamName.trim()) return "Team name is required";
    if (!selectedDomain) return "Please select a domain";
    if (!gitRepo.trim()) return "Git repository URL is required";
    if (!utrNumber.trim()) return "UTR number is required"; // Added UTR validation
    if (!paymentProof) return "Payment proof is required";
    if (!leaderMobile.trim()) return "Team leader mobile number is required";
    if (!alternateMobile.trim()) return "Alternate mobile number is required";

    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(gitRepo)) return "Please enter a valid repository URL";

    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(leaderMobile))
      return "Please enter a valid leader mobile number";
    if (!mobilePattern.test(alternateMobile))
      return "Please enter a valid alternate mobile number";

    for (const participant of participants) {
      if (!participant.name.trim()) return "All participant names are required";
      if (!participant.email.trim())
        return "All participant emails are required";
      if (!participant.college.trim())
        return "All participant colleges are required";

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(participant.email))
        return "Please enter valid email addresses";
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or PDF file.",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
        });
        return;
      }
      setPaymentProof(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: error,
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    const teamData = {
      teamName,
      participants,
      leaderIndex,
      domain: selectedDomain,
      gitRepo,
      utrNumber,
      leaderMobile,
      alternateMobile,
    };
    formData.append("team", JSON.stringify(teamData));
    if (paymentProof) {
      formData.append("paymentProof", paymentProof);
    }

    try {
      const response = await axios.post(
        "https://hackabhigna-hub.onrender.com/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        title: "Registration Successful!",
        description: response.data.message,
      });
      // Reset form
      setTeamName("");
      setParticipants([
        { name: "", email: "", college: "", mobile: "" },
        { name: "", email: "", college: "", mobile: "" },
      ]);
      setLeaderIndex(0);
      setSelectedDomain("");
      setGitRepo("");
      setPaymentProof(null);
      setLeaderMobile("");
      setAlternateMobile("");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description:
          axiosError.response?.data?.message ||
          "An error occurred while registering your team.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gradient">
          Register Your Team
        </CardTitle>
        <p className="text-muted-foreground">
          Join HackAbhigna and showcase your innovation
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="team-name" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Name
            </Label>
            <Input
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              className="bg-input/50"
            />
          </div>

          {/* Participants */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Team Members (2-4 people) - Select a Leader
            </Label>
            {participants.map((participant, index) => (
              <div key={index} className="space-y-2">
                <div className="relative">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 relative">
                      <div className="relative flex-1">
                        <Input
                          value={participant.name}
                          onChange={(e) =>
                            updateParticipant(index, "name", e.target.value)
                          }
                          placeholder={`Member ${index + 1} Name`}
                          className="bg-input/50 pr-32"
                        />
                        <Button
                          type="button"
                          variant={
                            leaderIndex === index ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setLeaderIndex(index)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 h-7 text-xs"
                        >
                          {leaderIndex === index ? "Leader" : "Set Leader"}
                        </Button>
                      </div>
                      {participants.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeParticipant(index)}
                          className="px-3"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      type="email"
                      value={participant.email}
                      onChange={(e) =>
                        updateParticipant(index, "email", e.target.value)
                      }
                      placeholder={`Member ${index + 1} Email`}
                      className="bg-input/50 flex-1"
                    />
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        College Name
                      </Label>
                      <Input
                        value={participant.college}
                        onChange={(e) =>
                          updateParticipant(index, "college", e.target.value)
                        }
                        placeholder={`Enter college name`}
                        className="bg-input/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {participants.length < 4 && (
              <Button
                type="button"
                variant="outline"
                onClick={addParticipant}
                className="w-full"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            )}
          </div>

          {/* Mobile Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="leader-mobile"
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Team Leader Mobile *
              </Label>
              <Input
                id="leader-mobile"
                type="tel"
                value={leaderMobile}
                onChange={(e) => setLeaderMobile(e.target.value)}
                placeholder="Enter leader's mobile number"
                className="bg-input/50"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="alternate-mobile"
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Alternate Mobile *
              </Label>
              <Input
                id="alternate-mobile"
                type="tel"
                value={alternateMobile}
                onChange={(e) => setAlternateMobile(e.target.value)}
                placeholder="Enter alternate mobile number"
                className="bg-input/50"
              />
            </div>
          </div>

          {/* Domain Selection */}
          <div className="space-y-2">
            <Label>Competition Domain</Label>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="bg-input/50">
                <SelectValue placeholder="Select your competition domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => {
                  // Use lowercase key to match domainSlotsLeft keys
                  const domainKey = domain.value.toLowerCase();
                  const slotsLeft = domainSlotsLeft[domainKey];
                  const paused = domainPaused[domainKey];
                  let label = domain.label;
                  if (paused) {
                    label = `${domain.label} (Paused)`;
                  }
                  return (
                    <SelectItem
                      key={domain.value}
                      value={domain.value}
                      disabled={slotsLeft === 0 || paused}
                    >
                      {domain.label}
                      <div className="text-xs text-muted-foreground ml-2">
                        {paused
                          ? "(Paused)"
                          : slotsLeft !== undefined
                          ? `(${slotsLeft} slots left)`
                          : ""}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Git Repository */}
          <div className="space-y-2">
            <Label htmlFor="git-repo" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              Git Profile URL
            </Label>
            <Input
              id="git-repo"
              type="url"
              value={gitRepo}
              onChange={(e) => setGitRepo(e.target.value)}
              placeholder="https://github.com/yourusername"
              className="bg-input/50"
            />
          </div>

          {/* UTR Number */}
          <div className="space-y-2">
            <Label htmlFor="utr-number" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              UTR Number
            </Label>
            <Input
              id="utr-number"
              type="text"
              placeholder="Enter UTR Number"
              className="bg-input/50"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
            />
          </div>

          {/* Payment Proof */}
          <div className="space-y-2">
            <Label htmlFor="payment-proof" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Proof
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="payment-proof"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="bg-input/50"
              />
              {paymentProof && (
                <span className="text-sm text-accent">{paymentProof.name}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload proof of registration fee payment (JPEG, PNG, or PDF, max
              5MB)
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="hero"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register Team"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
