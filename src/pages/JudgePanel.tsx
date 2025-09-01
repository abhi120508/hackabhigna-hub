import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Scale, Github, GitCommit, GitBranch, Activity, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Team {
  id: string;
  name: string;
  domain: string;
  repository: string;
  participants: string[];
  activity: {
    commits: number;
    branches: number;
    pushes: number;
    lastActivity: string;
  };
  scores: {
    round1?: { score: number; remarks: string; judge: string };
    round2?: { score: number; remarks: string; judge: string };
    final?: { score: number; remarks: string; judge: string };
  };
}

// Mock data
const mockTeams: Team[] = [
  {
    id: "team-001",
    name: "Code Warriors",
    domain: "Web Development",
    repository: "https://github.com/hackabhigna-org/team-001",
    participants: ["John Doe", "Jane Smith", "Bob Wilson"],
    activity: {
      commits: 45,
      branches: 3,
      pushes: 12,
      lastActivity: "2 minutes ago"
    },
    scores: {
      round1: { score: 85, remarks: "Great initial implementation", judge: "Judge A" }
    }
  },
  {
    id: "team-002", 
    name: "Innovation Squad",
    domain: "AI",
    repository: "https://github.com/hackabhigna-org/team-002",
    participants: ["Alice Johnson", "Mike Chen"],
    activity: {
      commits: 32,
      branches: 2,
      pushes: 8,
      lastActivity: "5 minutes ago"
    },
    scores: {}
  }
];

const JudgePanel = () => {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedRound, setSelectedRound] = useState<string>("round1");
  const [score, setScore] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [judgeName, setJudgeName] = useState<string>("Judge A");
  const { toast } = useToast();

  const handleSubmitScore = () => {
    if (!selectedTeam || !score || !remarks) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields"
      });
      return;
    }

    const scoreValue = parseInt(score);
    if (scoreValue < 0 || scoreValue > 100) {
      toast({
        variant: "destructive", 
        title: "Invalid Score",
        description: "Score must be between 0 and 100"
      });
      return;
    }

    setTeams(prev => prev.map(team => 
      team.id === selectedTeam.id 
        ? {
            ...team,
            scores: {
              ...team.scores,
              [selectedRound]: {
                score: scoreValue,
                remarks,
                judge: judgeName
              }
            }
          }
        : team
    ));

    toast({
      title: "Score Submitted",
      description: `Score for ${selectedTeam.name} in ${selectedRound} has been saved`
    });

    // Reset form
    setScore("");
    setRemarks("");
  };

  const getRoundDisplayName = (round: string) => {
    switch (round) {
      case "round1": return "Round 1";
      case "round2": return "Round 2"; 
      case "final": return "Final Round";
      default: return round;
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Judge Panel</h1>
          <p className="text-muted-foreground">
            Evaluate team performance and submit scores
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teams List */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teams.map((team) => (
                  <Button
                    key={team.id}
                    variant={selectedTeam?.id === team.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedTeam(team)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{team.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {team.domain}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Team Details & Scoring */}
          <div className="lg:col-span-2">
            {selectedTeam ? (
              <Tabs defaultValue="activity" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="activity">Repository Activity</TabsTrigger>
                  <TabsTrigger value="scoring">Scoring</TabsTrigger>
                  <TabsTrigger value="history">Score History</TabsTrigger>
                </TabsList>

                <TabsContent value="activity">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Github className="w-5 h-5" />
                        {selectedTeam.name} - Repository Activity
                      </CardTitle>
                      <Badge variant="outline">{selectedTeam.domain}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Team Members</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedTeam.participants.map((participant, index) => (
                            <Badge key={index} variant="secondary">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Repository</h4>
                        <a 
                          href={selectedTeam.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedTeam.repository}
                        </a>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <GitCommit className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <div className="text-2xl font-bold">{selectedTeam.activity.commits}</div>
                            <div className="text-sm text-muted-foreground">Commits</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <GitBranch className="w-6 h-6 mx-auto mb-2 text-accent" />
                            <div className="text-2xl font-bold">{selectedTeam.activity.branches}</div>
                            <div className="text-sm text-muted-foreground">Branches</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Activity className="w-6 h-6 mx-auto mb-2 text-secondary" />
                            <div className="text-2xl font-bold">{selectedTeam.activity.pushes}</div>
                            <div className="text-sm text-muted-foreground">Pushes</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-sm font-bold text-primary">
                              {selectedTeam.activity.lastActivity}
                            </div>
                            <div className="text-sm text-muted-foreground">Last Activity</div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="scoring">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Submit Score for {selectedTeam.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="round">Round</Label>
                          <select
                            id="round"
                            value={selectedRound}
                            onChange={(e) => setSelectedRound(e.target.value)}
                            className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md"
                          >
                            <option value="round1">Round 1</option>
                            <option value="round2">Round 2</option>
                            <option value="final">Final Round</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="judge">Judge Name</Label>
                          <Input
                            id="judge"
                            value={judgeName}
                            onChange={(e) => setJudgeName(e.target.value)}
                            placeholder="Enter judge name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="score">Score (0-100)</Label>
                          <Input
                            id="score"
                            type="number"
                            min="0"
                            max="100"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            placeholder="Enter score"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="remarks">Remarks</Label>
                        <Textarea
                          id="remarks"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Enter detailed feedback and remarks..."
                          rows={4}
                        />
                      </div>

                      <Button onClick={handleSubmitScore} variant="hero" className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Submit Score
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Score History for {selectedTeam.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(selectedTeam.scores).length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            No scores submitted yet
                          </p>
                        ) : (
                          Object.entries(selectedTeam.scores).map(([round, scoreData]) => (
                            <Card key={round}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{getRoundDisplayName(round)}</h4>
                                  <Badge variant="default" className="text-lg px-3">
                                    {scoreData.score}/100
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Judge: {scoreData.judge}
                                </p>
                                <p className="text-sm">{scoreData.remarks}</p>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Scale className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Team Selected</h3>
                  <p className="text-muted-foreground">
                    Select a team from the list to view details and submit scores
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgePanel;