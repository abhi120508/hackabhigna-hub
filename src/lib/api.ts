// Real API service for HackAbhigna backend
const API_BASE_URL = "https://hackabhigna-hub.onrender.com";

export interface TeamRegistration {
  id?: string;
  teamCode?: string;
  teamName: string;
  participants: Array<{
    name: string;
    email: string;
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
  qrCodeImageUrl?: string;
  qrCode?: string;
  githubRepo?: string;
  scores?: {
    [round: string]: {
      score: number;
      remarks: string;
      judge: string;
    };
  };
}

// API service functions
export const API = {
  // Register a new team
  registerTeam: async (
    teamData: Omit<TeamRegistration, "id" | "submittedAt" | "status">,
    paymentProof: File
  ): Promise<{
    success: boolean;
    message: string;
    data?: TeamRegistration;
  }> => {
    try {
      const formData = new FormData();
      formData.append("paymentProof", paymentProof);
      formData.append("team", JSON.stringify(teamData));

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: result.message,
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: result.message || "Registration failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  },

  // Get all registrations (for admin)
  getRegistrations: async (): Promise<TeamRegistration[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/registrations`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching registrations:", error);
      return [];
    }
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
    try {
      const response = await fetch(
        `${API_BASE_URL}/registrations/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: result.message,
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: result.message || "Update failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  },

  // Get team by QR team code
  getTeamByQR: async (
    teamCode: string
  ): Promise<{
    success: boolean;
    data?: TeamRegistration;
    message?: string;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamCode}`);
      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: result.message || "Team not found",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  },

  // Participant login
  participantLogin: async (
    uniqueId: string,
    email: string
  ): Promise<{
    success: boolean;
    message: string;
    data?: TeamRegistration;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uniqueId, email }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: result.message,
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: result.message || "Login failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  },

  // Get statistics
  getStatistics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        byDomain: {},
      };
    }
  },

  // Get domain settings
  getDomainSettings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/domain-settings`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching domain settings:", error);
      return [];
    }
  },

  // Get leaderboard
  getLeaderboard: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  },

  // Submit score
  submitScore: async (
    teamId: string,
    round: string,
    score: number,
    remarks: string,
    judge: string
  ): Promise<{
    success: boolean;
    message: string;
    data?: TeamRegistration;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}/score`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ round, score, remarks, judge }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: result.message,
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: result.message || "Score submission failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  },
};
