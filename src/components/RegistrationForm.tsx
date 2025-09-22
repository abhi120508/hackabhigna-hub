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
import { useToast } from "@/hooks/use-toast";
import {
  PlusCircle,
  MinusCircle,
  Github,
  CreditCard,
  Phone,
  Mail,
  Users,
} from "lucide-react";
import axios, { AxiosError } from "axios";

interface Participant {
  name: string;
  email: string;
  mobile?: string;
}

const domains = [
  { value: "GenAI/AgenticAI in Agriculture", label: "GenAI/AgenticAI in Agriculture" },
  { value: "GenAI/AgenticAI in FinTech", label: "GenAI/AgenticAI in FinTech" },
  { value: "GenAI/AgenticAI in Education", label: "GenAI/AgenticAI in Education" },
  { value: "Wildcard", label: "Wildcard" },
];

export function RegistrationForm() {
  const [teamName, setTeamName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", email: "", mobile: "" },
    { name: "", email: "", mobile: "" },
  ]);
  const [leaderIndex, setLeaderIndex] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [gitRepo, setGitRepo] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [leaderMobile, setLeaderMobile] = useState("");
  const [alternateMobile, setAlternateMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domainSlotsLeft, setDomainSlotsLeft] = useState<Record<string, number>>({});
  const [domainPaused, setDomainPaused] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchDomainSettings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/domain-settings");
        const slotsMap: Record<string, number> = {};
        const pausedMap: Record<string, boolean> = {};
        response.data.forEach((d: any) => {
          const domain = d.domain?.toLowerCase();
          if (domain) {
            slotsMap[domain] = typeof d.slotsLeft === "number" ? d.slotsLeft : 0;
            pausedMap[domain] = !!d.paused;
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

  const validateForm = () => {
    if (!teamName.trim()) return "Team name is required";
    if (!selectedDomain) return "Please select a domain";
    if (!gitRepo.trim()) return "Git repository URL is required";
    if (!utrNumber.trim()) return "UTR number is required";
    if (!paymentProof) return "Payment proof is required";
    if (!leaderMobile.trim()) return "Team leader mobile number is required";
    if (!alternateMobile.trim()) return "Alternate mobile number is required";

    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(gitRepo)) return "Enter a valid repository URL";

    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(leaderMobile)) return "Enter a valid leader mobile number";
    if (!mobilePattern.test(alternateMobile)) return "Enter a valid alternate mobile number";

    for (const participant of participants) {
      if (!participant.name.trim()) return "All participant names are required";
      if (!participant.email.trim()) return "All participant emails are required";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(participant.email)) return "Enter valid email addresses";
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Upload JPEG, PNG, or PDF only.",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Upload file smaller than 5MB.",
        });
        return;
      }
      setPaymentProof(file);
    }
  };

  const addParticipant = () => {
    if (participants.length < 4) {
      setParticipants([...participants, { name: "", email: "", mobile: "" }]);
    }
  };

  const removeParticipant = (index: number) => {
    if (participants.length > 2) {
      const newParticipants = participants.filter((_, i) => i !== index);
      setParticipants(newParticipants);
      if (index === leaderIndex) setLeaderIndex(0);
      else if (index < leaderIndex) setLeaderIndex(leaderIndex - 1);
    }
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const updated = participants.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    setParticipants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast({ variant: "destructive", title: "Validation Error", description: error });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append(
      "team",
      JSON.stringify({
        teamName,
        participants,
        leaderIndex,
        domain: selectedDomain,
        gitRepo,
        utrNumber,
        leaderMobile,
        alternateMobile,
      })
    );
    if (paymentProof) formData.append("paymentProof", paymentProof);

    try {
      const response = await axios.post("http://localhost:5000/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({
        title: "Registration Successful!",
        description: response.data.message,
      });
      setTeamName("");
      setParticipants([
        { name: "", email: "", mobile: "" },
        { name: "", email: "", mobile: "" },
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
          axiosError.response?.data?.message || "An error occurred while registering your team.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border-border/50 mt-20 mb-100">
      <CardHeader className="text-center space-y-4">
        <CardTitle className="text-4xl " style={{ color: ' rgb(201, 114, 219)'}}>Register Your Team</CardTitle>
        <p className="text-xl text-muted-foreground">
          Join HackAbhigna and showcase your innovation
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="team-name" className="flex items-center gap-2 text-base font-medium">
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
            <Label className="flex items-center gap-2 text-base font-medium">
              <Mail className="w-4 h-4" />
              Team Members (2-4 people) – Select a Leader
            </Label>
            {participants.map((participant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                {/* Name with Leader Button */}
                <div className="relative">
                  <Input
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, "name", e.target.value)}
                    placeholder={`Member ${index + 1} Name`}
                    className="bg-input/50 pr-28"
                  />
                  <Button
                    type="button"
                    variant={leaderIndex === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLeaderIndex(index)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 h-7 text-xs"
                  >
                    {leaderIndex === index ? "Leader" : "Set Leader"}
                  </Button>
                </div>

                {/* Email */}
                <Input
                  type="email"
                  value={participant.email}
                  onChange={(e) => updateParticipant(index, "email", e.target.value)}
                  placeholder={`Member ${index + 1} Email`}
                  className="bg-input/50"
                />

                {/* Remove Button */}
                {participants.length > 2 && (
                  <div className="md:col-span-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeParticipant(index)}
                      className="w-full justify-center"
                    >
                      <MinusCircle className="w-4 h-4 mr-2" />
                      Remove Member
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {participants.length < 4 && (
              <Button type="button" variant="outline" onClick={addParticipant} className="w-full">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            )}
          </div>

          {/* Mobile Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leader-mobile" className="flex items-center gap-2 text-base font-medium">
                <Phone className="w-4 h-4" />
                Team Leader Mobile
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
              <Label htmlFor="alternate-mobile" className="flex items-center gap-2 text-base font-medium">
                <Phone className="w-4 h-4" />
                Alternate Mobile
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
                  const key = domain.value.toLowerCase();
                  const paused = domainPaused[key];
                  const slots = domainSlotsLeft[key];
                  return (
                    <SelectItem
                      key={domain.value}
                      value={domain.value}
                      disabled={slots === 0 || paused}
                    >
                      {domain.label}{" "}
                      <span className="text-xs text-muted-foreground ml-2">
                        {paused ? "(Paused)" : slots !== undefined ? `(${slots} slots left)` : ""}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <Label htmlFor="git-repo" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub Profile URL
            </Label>
            <Input
              id="git-repo"
              type="url"
              value={gitRepo}
              onChange={(e) => setGitRepo(e.target.value)}
              placeholder="https://github.com/yourteam"
              className="bg-input/50"
            />
          </div>

          {/* UTR */}
          <div className="space-y-2">
            <Label htmlFor="utr-number" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              UTR Number
            </Label>
            <Input
              id="utr-number"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="Enter UTR Number"
              className="bg-input/50"
            />
          </div>

          {/* Payment Proof */}
          <div className="space-y-2">
            <Label htmlFor="payment-proof" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Proof
            </Label>
            <Input
              id="payment-proof"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              className="bg-input/50"
            />
            {paymentProof && <p className="text-sm text-accent">{paymentProof.name}</p>}
            <p className="text-xs text-muted-foreground">
              Upload proof of registration fee payment (JPEG, PNG, or PDF, max 5MB)
            </p>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" variant="hero" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register Team"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
