// Mock Backend Data and Utilities

export interface TeamRegistration {
  id?: string;
  teamCode?: string; // renamed from uniqueId
  teamName: string;
  participants: Array<{
    name: string;
    email: string;
    college: string;
    mobile?: string;
  }>;
  leaderIndex: number;
  domain: string;
  gitRepo: string;
  utrNumber?: string;
  leaderMobile: string;
  alternateMobile: string;
  paymentProof: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  approvedAt?: string;
  qrCodeImageUrl?: string; // renamed from qrCode
  qrCode?: string; // Cloudinary URL for QR code image
  githubRepo?: string;
  scores?: {
    [round: string]: {
      score: number;
      remarks: string;
      judge: string;
    };
  };
}

// Mock registration counter for unique ID generation
let registrationCounter = 1;

// Generate unique ID: first 2 letters from domain + first 2 from team name + registration number
export function generateUniqueId(domain: string, teamName: string): string {
  const domainPrefix = domain.substring(0, 2).toUpperCase();
  const teamPrefix = teamName.substring(0, 2).toUpperCase();
  const number = String(registrationCounter).padStart(3, "0");
  registrationCounter++;
  return `${domainPrefix}${teamPrefix}${number}`;
}

// Generate mock GitHub repository URL
export function generateGithubRepo(uniqueId: string): string {
  return `https://github.com/hackabhigna/${uniqueId.toLowerCase()}`;
}

// Generate QR code data (mock URL for now)
export function generateQRCodeData(uniqueId: string): string {
  return `https://hackabhigna.com/qr/${uniqueId}`;
}

// Mock database storage
export class MockDatabase {
  private static registrations: TeamRegistration[] = [
    {
      id: "1",
      teamCode: "WETE001",
      teamName: "TechInnovators",
      participants: [
        {
          name: "John Doe",
          email: "john@example.com",
          college: "MIT",
          mobile: "9876543210",
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          college: "Stanford",
          mobile: "9876543211",
        },
      ],
      leaderIndex: 0,
      domain: "web",
      gitRepo: "https://github.com/johndoe",
      leaderMobile: "9876543210",
      alternateMobile: "9876543220",
      paymentProof: "payment_proof_1.jpg",
      status: "approved",
      submittedAt: "2024-09-01T10:00:00Z",
      approvedAt: "2024-09-02T14:30:00Z",
      qrCodeImageUrl: "https://hackabhigna.com/qr/WETE001",
      githubRepo: "https://github.com/hackabhigna/wete001",
    },
    {
      id: "2",
      teamCode: "AICO002",
      teamName: "CodeMasters",
      participants: [
        {
          name: "Alice Johnson",
          email: "alice@example.com",
          college: "Harvard",
          mobile: "9876543212",
        },
        {
          name: "Bob Wilson",
          email: "bob@example.com",
          college: "Yale",
          mobile: "9876543213",
        },
        {
          name: "Charlie Brown",
          email: "charlie@example.com",
          college: "Princeton",
          mobile: "9876543214",
        },
      ],
      leaderIndex: 0,
      domain: "ai",
      gitRepo: "https://github.com/alice",
      leaderMobile: "9876543212",
      alternateMobile: "9876543221",
      paymentProof: "payment_proof_2.jpg",
      status: "pending",
      submittedAt: "2024-09-02T11:00:00Z",
    },
    {
      id: "3",
      teamCode: "MOAP003",
      teamName: "AppBuilders",
      participants: [
        {
          name: "David Lee",
          email: "david@example.com",
          college: "Caltech",
          mobile: "9876543215",
        },
        {
          name: "Emma Davis",
          email: "emma@example.com",
          college: "Berkeley",
          mobile: "9876543216",
        },
      ],
      leaderIndex: 0,
      domain: "mobile",
      gitRepo: "https://github.com/david",
      leaderMobile: "9876543215",
      alternateMobile: "9876543222",
      paymentProof: "payment_proof_3.jpg",
      status: "approved",
      submittedAt: "2024-09-03T09:30:00Z",
      approvedAt: "2024-09-03T16:45:00Z",
      qrCodeImageUrl: "https://hackabhigna.com/qr/MOAP003",
      githubRepo: "https://github.com/hackabhigna/moap003",
    },
  ];

  static getAllRegistrations(): TeamRegistration[] {
    return this.registrations;
  }

  static getRegistrationByDomain(domain: string): TeamRegistration[] {
    return this.registrations.filter((reg) => reg.domain === domain);
  }

  static getRegistrationByTeamCode(
    teamCode: string
  ): TeamRegistration | undefined {
    return this.registrations.find((reg) => reg.teamCode === teamCode);
  }

  static addRegistration(
    registration: Omit<TeamRegistration, "id" | "submittedAt">
  ): TeamRegistration {
    const newRegistration: TeamRegistration = {
      ...registration,
      id: String(this.registrations.length + 1),
      submittedAt: new Date().toISOString(),
    };
    this.registrations.push(newRegistration);
    return newRegistration;
  }

  static updateRegistrationStatus(
    id: string,
    status: "approved" | "rejected"
  ): TeamRegistration | null {
    const registrationIndex = this.registrations.findIndex(
      (reg) => reg.id === id
    );
    if (registrationIndex === -1) return null;

    const registration = this.registrations[registrationIndex];
    registration.status = status;

    if (status === "approved") {
      registration.approvedAt = new Date().toISOString();
      if (!registration.teamCode) {
        registration.teamCode = generateUniqueId(
          registration.domain,
          registration.teamName
        );
      }
      registration.qrCodeImageUrl = generateQRCodeData(registration.teamCode);
      registration.githubRepo = generateGithubRepo(registration.teamCode);
    }

    this.registrations[registrationIndex] = registration;
    return registration;
  }

  static getApprovedTeams(): TeamRegistration[] {
    return this.registrations.filter((reg) => reg.status === "approved");
  }

  static getPendingTeams(): TeamRegistration[] {
    return this.registrations.filter((reg) => reg.status === "pending");
  }

  static getStatistics() {
    const total = this.registrations.length;
    const approved = this.registrations.filter(
      (reg) => reg.status === "approved"
    ).length;
    const pending = this.registrations.filter(
      (reg) => reg.status === "pending"
    ).length;
    const rejected = this.registrations.filter(
      (reg) => reg.status === "rejected"
    ).length;

    return {
      total,
      approved,
      pending,
      rejected,
      byDomain: {
        web: this.registrations.filter((reg) => reg.domain === "web").length,
        mobile: this.registrations.filter((reg) => reg.domain === "mobile")
          .length,
        ai: this.registrations.filter((reg) => reg.domain === "ai").length,
        wildcard: this.registrations.filter((reg) => reg.domain === "wildcard")
          .length,
      },
    };
  }
}

// Mock API functions
export const MockAPI = {
  // Register a new team
  registerTeam: async (
    teamData: Omit<TeamRegistration, "id" | "submittedAt" | "status">
  ): Promise<{
    success: boolean;
    message: string;
    data?: TeamRegistration;
  }> => {
    try {
      const registration = MockDatabase.addRegistration({
        ...teamData,
        status: "pending",
      });

      return {
        success: true,
        message: "Team registered successfully!",
        data: registration,
      };
    } catch (error) {
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }
  },

  // Get all registrations (for admin)
  getRegistrations: async (): Promise<TeamRegistration[]> => {
    return MockDatabase.getAllRegistrations();
  },

  // Approve or reject a team
  updateTeamStatus: async (
    id: string,
    status: "approved" | "rejected"
  ): Promise<{
    success: boolean;
    message: string;
    data?: TeamRegistration;
  }> => {
    const updatedTeam = MockDatabase.updateRegistrationStatus(id, status);

    if (updatedTeam) {
      return {
        success: true,
        message: `Team ${status} successfully!`,
        data: updatedTeam,
      };
    }

    return {
      success: false,
      message: "Team not found.",
    };
  },

  // Get team by QR team code
  getTeamByQR: async (
    teamCode: string
  ): Promise<{
    success: boolean;
    data?: TeamRegistration;
    message?: string;
  }> => {
    const team = MockDatabase.getRegistrationByTeamCode(teamCode);

    if (team) {
      return {
        success: true,
        data: team,
      };
    }

    return {
      success: false,
      message: "Team not found.",
    };
  },

  // Send email with QR code (mock)
  sendQRCodeEmail: async (
    teamData: TeamRegistration
  ): Promise<{ success: boolean; message: string }> => {
    // Mock email sending
    console.log(`Sending QR code email to team: ${teamData.teamName}`);
    console.log(`QR Code: ${teamData.qrCodeImageUrl}`);
    console.log(`GitHub Repo: ${teamData.githubRepo}`);

    return {
      success: true,
      message: "QR code sent successfully!",
    };
  },
};
