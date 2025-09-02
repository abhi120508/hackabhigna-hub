import { useState } from "react";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Participant {
  name: string;
  email: string;
}

const domains = [
  { value: "web", label: "Web Development" },
  { value: "mobile", label: "Mobile Development" },
  { value: "ai", label: "Artificial Intelligence" },
  { value: "wildcard", label: "Wildcard (Open Innovation)" },
];

export function RegistrationForm() {
  const [teamName, setTeamName] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", email: "" },
    { name: "", email: "" },
  ]);
  const [leaderIndex, setLeaderIndex] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [gitRepo, setGitRepo] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addParticipant = () => {
    if (participants.length < 4) {
      setParticipants([...participants, { name: "", email: "" }]);
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
    if (!paymentProof) return "Payment proof is required";

    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(gitRepo)) return "Please enter a valid repository URL";

    for (const participant of participants) {
      if (!participant.name.trim()) return "All participant names are required";
      if (!participant.email.trim())
        return "All participant emails are required";

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
    };
    formData.append("team", JSON.stringify(teamData));
    if (paymentProof) {
      formData.append("paymentProof", paymentProof);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        title: "Registration Successful!",
        description: response.data,
      });
      // Reset form
      setTeamName("");
      setParticipants([
        { name: "", email: "" },
        { name: "", email: "" },
      ]);
      setLeaderIndex(0);
      setSelectedDomain("");
      setGitRepo("");
      setPaymentProof(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An error occurred while registering your team.",
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
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1 space-y-2">
                  <Input
                    value={participant.name}
                    onChange={(e) =>
                      updateParticipant(index, "name", e.target.value)
                    }
                    placeholder={`Member ${index + 1} Name`}
                    className="bg-input/50"
                  />
                  <Input
                    type="email"
                    value={participant.email}
                    onChange={(e) =>
                      updateParticipant(index, "email", e.target.value)
                    }
                    placeholder={`Member ${index + 1} Email`}
                    className="bg-input/50"
                  />
                </div>
                <Button
                  type="button"
                  variant={leaderIndex === index ? "default" : "outline"}
                  size="xs"
                  onClick={() => setLeaderIndex(index)}
                  className="flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {leaderIndex === index ? "Leader" : "Set Leader"}
                </Button>
                {participants.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => removeParticipant(index)}
                  >
                    <MinusCircle className="w-4 h-4" />
                  </Button>
                )}
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

          {/* Domain Selection */}
          <div className="space-y-2">
            <Label>Competition Domain</Label>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="bg-input/50">
                <SelectValue placeholder="Select your competition domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain.value} value={domain.value}>
                    {domain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Git Repository */}
          <div className="space-y-2">
            <Label htmlFor="git-repo" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              Git Repository URL
            </Label>
            <Input
              id="git-repo"
              type="url"
              value={gitRepo}
              onChange={(e) => setGitRepo(e.target.value)}
              placeholder="https://github.com/yourusername/repository"
              className="bg-input/50"
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
