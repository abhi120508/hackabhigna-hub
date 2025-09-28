const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const QRCode = require("qrcode");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Remove static serving of uploads since we use Cloudinary
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", async () => {
  console.log("MongoDB database connection established successfully");
  // Initialize settings
  await initializeDomainSettings();
  await initializeGlobalSettings();
  // Test Cloudinary configuration
  cloudinary.api.ping((error, result) => {
    if (error) {
      console.error("Cloudinary connection failed:", error);
    } else {
      console.log("Cloudinary connection established successfully");
    }
  });
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use multer memory storage to get file buffer
const upload = multer({ storage: multer.memoryStorage() });

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  college: { type: String, required: true },
  mobile: { type: String },
});

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  participants: [participantSchema],
  leaderIndex: { type: Number, required: true },
  domain: { type: String, required: true },
  gitRepo: { type: String, required: true },
  leaderMobile: { type: String, required: true },
  alternateMobile: { type: String },
  utrNumber: { type: String, required: true }, // Added UTR number as required
  paymentProof: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  submittedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  teamCode: { type: String, unique: true, sparse: true }, // renamed from uniqueId
  githubRepo: { type: String },
  qrCodeImageUrl: { type: String }, // renamed from qrCode
  scores: {
    round1: { score: Number, remarks: String, judge: String },
    round2: { score: Number, remarks: String, judge: String },
    final: { score: Number, remarks: String, judge: String },
  },
});

const domainSettingsSchema = new mongoose.Schema({
  domain: { type: String, required: true, unique: true },
  maxSlots: { type: Number, default: 50 },
  pausedRegistrations: { type: Boolean, default: false },
});

const globalSettingsSchema = new mongoose.Schema({
  pausedLeaderboard: { type: Boolean, default: false },
});

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["new", "read", "replied"],
    default: "new",
  },
});

const Team = mongoose.model("Team", teamSchema);

const DomainSettings = mongoose.model("DomainSettings", domainSettingsSchema);

const GlobalSettings = mongoose.model("GlobalSettings", globalSettingsSchema);

const Message = mongoose.model("Message", messageSchema);

// Helper to extract domain name from full domain string
const extractDomainName = (fullDomain) => {
  // Extract the domain name from strings like "GenAI/AgenticAI in Agriculture"
  const domainMatch = fullDomain.match(/in\s+([A-Za-z]+)/);
  if (domainMatch) {
    return domainMatch[1];
  }

  // For Wildcard sub-domains
  if (fullDomain === "Wildcard - Environment") {
    return "Environment";
  }
  if (fullDomain === "Wildcard - Food Production") {
    return "Food Production";
  }

  // For "Wildcard" or other simple domain names
  if (fullDomain === "Wildcard") {
    return "Wildcard";
  }

  // Fallback: return the original string if no match
  return fullDomain;
};

// Helper to generate unique ID
const generateUniqueId = async (domain, teamName) => {
  const domainName = extractDomainName(domain);
  // Map domain names to specific prefixes
  const prefixMap = {
    Agriculture: "AG",
    Education: "ED",
    Environment: "WE",
    "Food Production": "WF",
  };
  const domainPrefix =
    prefixMap[domainName] || domainName.substring(0, 2).toUpperCase();
  const teamPrefix = teamName.substring(0, 2).toUpperCase();
  const count = await Team.countDocuments({ domain });
  const number = String(count + 1).padStart(3, "0");
  return `${domainPrefix}${teamPrefix}${number}`;
};

app.post("/register", upload.single("paymentProof"), async (req, res) => {
  try {
    const teamData = JSON.parse(req.body.team);

    if (!req.file) {
      return res.status(400).json({ message: "Payment proof is required." });
    }

    if (!teamData.utrNumber || teamData.utrNumber.trim() === "") {
      return res.status(400).json({ message: "UTR number is required." });
    }

    // Check if domain has available slots
    const domainSetting = await DomainSettings.findOne({
      domain: teamData.domain,
    });
    if (!domainSetting) {
      return res.status(400).json({ message: "Invalid domain selected." });
    }

    if (domainSetting.pausedRegistrations) {
      return res
        .status(400)
        .json({ message: "Registrations are paused for this domain." });
    }

    const occupiedCount = await Team.countDocuments({
      domain: teamData.domain,
      status: { $in: ["pending", "approved"] },
    });

    if (occupiedCount >= domainSetting.maxSlots) {
      return res
        .status(400)
        .json({ message: "No slots available for this domain." });
    }

    // Upload file buffer to Cloudinary
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "paymentProofs" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    const newTeam = new Team({
      ...teamData,
      paymentProof: result.secure_url,
    });

    await newTeam.save();
    res.status(201).json({
      message:
        "Team Leader will receieve an approval mail once the payment proof is verified",
      data: newTeam,
    });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Participant Login
app.post("/login/participant", async (req, res) => {
  try {
    const { uniqueId, email } = req.body;

    console.log("Participant login attempt:", { uniqueId, email });

    if (!uniqueId || !email) {
      console.log("Missing uniqueId or email");
      return res
        .status(400)
        .json({ message: "Unique ID and Email are required." });
    }

    const team = await Team.findOne({ teamCode: uniqueId.trim() });

    if (!team) {
      console.log("No team found with uniqueId:", uniqueId);
      return res.status(404).json({ message: "Invalid Unique ID." });
    }

    if (team.status !== "approved") {
      console.log("Team not approved:", team.teamName);
      return res
        .status(403)
        .json({ message: "This team has not been approved yet." });
    }

    const leaderEmail = team.participants[team.leaderIndex]?.email;

    console.log("Leader email:", leaderEmail);

    if (
      leaderEmail &&
      leaderEmail.toLowerCase() === email.trim().toLowerCase()
    ) {
      console.log("Login successful for team:", team.teamName);
      res.json({ success: true, message: "Login successful!", data: team });
    } else {
      console.log("Invalid team lead email:", email);
      res.status(401).json({ message: "Invalid Team Lead Email." });
    }
  } catch (err) {
    console.error("Server error during participant login:", err);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// Get all registrations
app.get("/registrations", async (req, res) => {
  try {
    const registrations = await Team.find().sort({ submittedAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Update registration status
const { sendMail } = require("./sendgridMailer");

app.patch("/registrations/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    team.status = status;

    if (status === "approved") {
      team.approvedAt = new Date();
      if (!team.teamCode) {
        team.teamCode = await generateUniqueId(team.domain, team.teamName);
      }
      team.githubRepo = `https://github.com/hackabhigna2025-hub/${team.teamCode}`;

      console.log("Generating QR code for teamCode:", team.teamCode);
      // Generate QR code image buffer for teamCode (ensure only teamCode string is used)
      const qrCodeDataUrl = await QRCode.toDataURL(team.teamCode, {
        width: 300,
        height: 300,
      });
      // Convert base64 data URL to buffer
      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, "base64");

      // Upload QR code image buffer to Cloudinary
      const uploadFromBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "qrCodes" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const uploadResult = await uploadFromBuffer(imgBuffer);
      team.qrCodeImageUrl = uploadResult.secure_url;

      // Create GitHub repo for the team
      async function createRepoFromTeam(team) {
        try {
          console.log(
            `🔨 Creating private repository for team: ${team.teamName}`
          );
          console.log(
            `📝 Repository name will be: https://github.com/${process.env.GITHUB_OWNER}/${team.teamCode}`
          );

          const repoRes = await axios.post(
            "https://api.github.com/user/repos",
            {
              name: team.teamCode,
              private: true,
              description: `Hackathon repo for team ${team.teamName}`,
              auto_init: true,
              gitignore_template: "Node",
            },
            {
              headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
                "User-Agent": "hackabhigna-repo-creator",
              },
            }
          );

          console.log(
            `✅ Private repo created successfully: ${repoRes.data.html_url}`
          );
          console.log(`🔒 Repository is private: ${repoRes.data.private}`);

          team.githubRepoLink = repoRes.data.html_url;
          team.githubRepo = repoRes.data.html_url;
          await team.save();
          console.log(`💾 Database updated for team: ${team.teamName}`);
        } catch (err) {
          console.error(
            `❌ Error creating repo for team ${team.teamName}:`,
            err.response?.data || err.message
          );
          if (err.response?.status === 401) {
            console.error(
              "🔑 GitHub token authentication failed. Please check your GITHUB_TOKEN."
            );
          } else if (err.response?.status === 422) {
            console.error(
              "📝 Repository name might already exist or be invalid."
            );
          }
        }
      }

      try {
        await createRepoFromTeam(team);
      } catch (repoError) {
        console.error("Error in createRepoFromTeam:", repoError);
      }

      // Prepare email options with inline QR code attachment
      const mailOptions = {
        from: `"HackAbhigna" <noreply@hackabhigna.in>`,
        to: team.participants[team.leaderIndex]?.email,
        subject: "HackAbhigna Registration Approved",
        text: `Dear ${team.participants[team.leaderIndex]?.name},

Congratulations! Your team ${
          team.teamName
        } has been approved for HackAbhigna in the domain ${team.domain}.


Please find your QR code attached below:

Best regards,
HackAbhigna Team`,
        html: `
        <p>Dear ${team.participants[team.leaderIndex]?.name},</p>
        <p>Congratulations! Your team <strong>${
          team.teamName
        }</strong> has been approved for HackAbhigna in the domain <strong>${
          team.domain
        }</strong>.</p>
        <p>Join the Discord server for future updates:https://discord.gg/C6Zr44ZKxt</P>
        <p>Please find your QR code attached.The QR will be scanned on the Hackathon Day to activate your GIT Repository</p>
        <p>Best regards,<br/>HackAbhigna Team</p>
      `,
        attachments: [
          {
            filename: "qr-code.png",
            content: base64Data,
            type: "image/png",
            disposition: "attachment",
          },
        ],
      };

      // Send the email
      try {
        await sendMail(mailOptions);
        console.log("Approval email sent successfully");
      } catch (error) {
        console.error("Error sending approval email:", error);
      }
    } else if (status === "rejected") {
      // Prepare rejection email options
      const mailOptions = {
        from: `"HackAbhigna" <noreply@hackabhigna.in>`,
        to: team.participants[team.leaderIndex]?.email,
        subject: "HackAbhigna Registration Update",
        text: `Dear ${team.participants[team.leaderIndex]?.name},

We regret to inform you that your team "${
          team.teamName
        }" registration for HackAbhigna has been rejected.

If you have any questions, please contact us.

Best regards,
HackAbhigna Team`,
      };

      // Send the email
      try {
        await sendMail(mailOptions);
        console.log("Rejection email sent successfully");
      } catch (error) {
        console.error("Error sending rejection email:", error);
      }
    }

    await team.save();
    res.json({ message: `Team ${status} successfully!`, data: team });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Add a new endpoint for submitting scores
app.patch("/teams/:id/score", async (req, res) => {
  try {
    const { id } = req.params;
    const { round, score, remarks, judge } = req.body;

    if (!round || !score || !remarks || !judge) {
      return res
        .status(400)
        .json({ message: "Missing required score fields." });
    }

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // Ensure scores object exists
    if (!team.scores) {
      team.scores = {};
    }

    team.scores[round] = { score, remarks, judge };

    // Mark the path as modified if it's a mixed type
    team.markModified("scores");

    await team.save();
    res.json({ message: "Score submitted successfully!", data: team });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Get statistics
app.get("/statistics", async (req, res) => {
  try {
    const total = await Team.countDocuments();
    const approved = await Team.countDocuments({ status: "approved" });
    const pending = await Team.countDocuments({ status: "pending" });
    const rejected = await Team.countDocuments({ status: "rejected" });

    const byDomain = await Team.aggregate([
      { $group: { _id: "$domain", count: { $sum: 1 } } },
    ]);

    const domainCounts = byDomain.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      total,
      approved,
      pending,
      rejected,
      byDomain: domainCounts,
    });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Get team by QR unique ID
app.get("/teams/:uniqueId", async (req, res) => {
  try {
    let { uniqueId } = req.params;
    uniqueId = uniqueId.trim().toUpperCase();
    console.log("Fetching team with teamCode:", uniqueId);
    const team = await Team.findOne({
      teamCode: { $regex: new RegExp(`^${uniqueId}$`, "i") },
    });
    console.log("Team found:", team ? true : false);

    if (team) {
      res.json({ success: true, data: team });
    } else {
      res.status(404).json({ success: false, message: "Team not found." });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Error: " + err.message });
  }
});

app.post("/give-access", async (req, res) => {
  const { teamCode } = req.body;

  if (!teamCode) {
    return res.status(400).json({ message: "Team code is required" });
  }

  try {
    const team = await Team.findOne({ teamCode: teamCode });

    if (!team) {
      return res
        .status(404)
        .json({ message: `Team with code '${teamCode}' not found` });
    }

    const gitRepoUrl = team.gitRepo;
    if (!gitRepoUrl || !gitRepoUrl.includes("github.com/")) {
      return res.status(400).json({ message: "Invalid GitHub repository URL" });
    }

    const urlParts = gitRepoUrl.split("github.com/");
    const pathPart = urlParts[1];
    if (!pathPart) {
      return res
        .status(400)
        .json({ message: "Could not extract GitHub username" });
    }

    const leaderUsername = pathPart.split("/")[0].trim();

    const repoName = team.teamCode;
    if (!repoName) {
      return res.status(400).json({ message: "No repository name found" });
    }

    // Send collaboration invitation via GitHub API
    await axios.put(
      `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${repoName}/collaborators/${leaderUsername}`,
      { permission: "push" },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    // Send email to team leader with GitHub repo and participant login credentials
    const teamLeaderEmail = team.participants[team.leaderIndex]?.email;
    const teamLeaderName = team.participants[team.leaderIndex]?.name;

    console.log("Preparing to send notification email...");
    console.log("Team Leader Email:", teamLeaderEmail);
    console.log("Team Leader Name:", teamLeaderName);
    console.log("Team Code:", team.teamCode);
    console.log(
      "Repository URL:",
      `https://github.com/${process.env.GITHUB_OWNER}/${repoName}`
    );

    const mailOptions = {
      from: `"HackAbhigna" <noreply@hackabhigna.in>`,
      to: teamLeaderEmail,
      subject: "GitHub Repository Access Granted",
      text: `Dear ${teamLeaderName},

Your GitHub repository has been activated: https://github.com/${process.env.GITHUB_OWNER}/${repoName}
Please accept the collaboration request
You can now check your Repository activity and feedback from judges at:https://hackabhigna.in/#/participant
Participant Login Credentials:
Team Code: ${team.teamCode}
Team Leader Email: ${teamLeaderEmail}

Best regards,
HackAbhigna Team`,
    };

    console.log("Mail options prepared:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    try {
      console.log("Attempting to send email...");
      await sendMail(mailOptions);
      console.log(
        `✅ Notification email sent successfully to ${mailOptions.to}`
      );
    } catch (emailError) {
      console.error("❌ Error sending notification email:", emailError);
      console.error("Email error details:", emailError.message);
    }

    res.json({
      message: `Repository ${repoName} is ready and ${leaderUsername} has been invited with push access`,
      details: {
        teamCode: teamCode,
        teamName: team.teamName,
        githubUsername: leaderUsername,
        repositoryName: repoName,
        repositoryUrl: `https://github.com/${process.env.GITHUB_OWNER}/${repoName}`,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
});

app.post("/regenerate-qr-codes", async (req, res) => {
  try {
    const approvedTeams = await Team.find({ status: "approved" });

    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "qrCodes" },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    for (const team of approvedTeams) {
      console.log("Regenerating QR code for teamCode:", team.teamCode);
      const qrCodeDataUrl = await QRCode.toDataURL(team.teamCode, {
        width: 300,
        height: 300,
      });
      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, "base64");

      const uploadResult = await uploadFromBuffer(imgBuffer);
      team.qrCodeImageUrl = uploadResult.secure_url;
      await team.save();
    }

    res.json({ message: "QR codes regenerated for all approved teams." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error regenerating QR codes: " + err.message });
  }
});

const initializeDomainSettings = async () => {
  // Updated domains: removed FinTech, split Wildcard into Environment and Food Production
  const domains = [
    "GenAI/AgenticAI in Agriculture",
    "GenAI/AgenticAI in Education",
    "Wildcard - Environment",
    "Wildcard - Food Production",
  ];
  // Remove all existing domain settings first to ensure order
  await DomainSettings.deleteMany({});
  for (const domain of domains) {
    await DomainSettings.create({
      domain,
      maxSlots: domain.includes("Wildcard") ? 15 : 35,
      pausedRegistrations: false,
    });
  }
  // Remove other domains that are not in the present 4
  await DomainSettings.deleteMany({
    domain: { $nin: domains },
  });
  // After creation, log current domain settings for debugging
  const allSettings = await DomainSettings.find();
  console.log("Initialized Domain Settings:", allSettings);
};

const initializeGlobalSettings = async () => {
  const existing = await GlobalSettings.findOne();
  if (!existing) {
    await GlobalSettings.create({ pausedLeaderboard: false });
  }
};

// Get domain settings
app.get("/domain-settings", async (req, res) => {
  try {
    let domainSettings = await DomainSettings.find();
    if (domainSettings.length === 0) {
      // Initialize if no settings exist
      await initializeDomainSettings();
      domainSettings = await DomainSettings.find();
    }
    const settingsWithSlots = await Promise.all(
      domainSettings.map(async (setting) => {
        const occupiedCount = await Team.countDocuments({
          domain: setting.domain,
          status: { $in: ["pending", "approved"] },
        });
        const slotsLeft = setting.maxSlots - occupiedCount;
        return {
          domain: setting.domain,
          maxSlots: setting.maxSlots,
          paused: setting.pausedRegistrations,
          slotsLeft: Math.max(0, slotsLeft),
        };
      })
    );
    res.json(settingsWithSlots);
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

app.patch("/domain-settings/:domain", async (req, res) => {
  try {
    const { domain } = req.params;
    const { paused } = req.body;

    if (typeof paused !== "boolean") {
      return res.status(400).json({ message: "Invalid paused value" });
    }

    const setting = await DomainSettings.findOne({ domain });
    if (!setting) {
      return res.status(404).json({ message: "Domain not found." });
    }

    setting.pausedRegistrations = paused;
    await setting.save();

    res.json({ message: "Updated successfully.", data: setting });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Get global settings
app.get("/global-settings", async (req, res) => {
  try {
    let settings = await GlobalSettings.findOne();
    if (!settings) {
      settings = await GlobalSettings.create({ pausedLeaderboard: false });
    }
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Toggle pause leaderboard
app.patch("/global-settings", async (req, res) => {
  try {
    const { pausedLeaderboard } = req.body;
    let settings = await GlobalSettings.findOneAndUpdate(
      {},
      { pausedLeaderboard },
      { new: true, upsert: true }
    );
    res.json({ message: "Updated successfully.", data: settings });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Get leaderboard
app.get("/leaderboard", async (req, res) => {
  try {
    const teams = await Team.find({ status: "approved" });
    const leaderboard = teams
      .map((team) => {
        let totalScore = 0;
        if (team.scores) {
          if (team.scores.round1 && team.scores.round1.score)
            totalScore += team.scores.round1.score;
          if (team.scores.round2 && team.scores.round2.score)
            totalScore += team.scores.round2.score;
          if (team.scores.final && team.scores.final.score)
            totalScore += team.scores.final.score;
        }
        return {
          teamName: team.teamName,
          domain: team.domain,
          totalScore,
          teamCode: team.teamCode,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
    res.json(leaderboard);
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

app.post("/download-all-teams-pdf", async (req, res) => {
  try {
    // Check if all domains are paused
    const domainSettings = await DomainSettings.find();
    const allDomainsPaused = domainSettings.every(
      (setting) => setting.pausedRegistrations
    );

    if (!allDomainsPaused) {
      return res.status(400).json({
        message: "Download is only available when all domains are paused",
      });
    }

    // Get all approved teams with their details
    const approvedTeams = await Team.find({ status: "approved" }).sort({
      domain: 1,
      teamName: 1,
    });

    if (approvedTeams.length === 0) {
      return res.status(404).json({ message: "No approved teams found" });
    }

    // Import pdfmake
    const PdfPrinter = require("pdfmake");

    // Define fonts
    const fonts = {
      Roboto: {
        normal: "Helvetica",
        bold: "Helvetica",
        italics: "Helvetica",
        bolditalics: "Helvetica",
      },
    };

    const printer = new PdfPrinter(fonts);

    // Group teams by domain
    const teamsByDomain = approvedTeams.reduce((acc, team) => {
      if (!acc[team.domain]) {
        acc[team.domain] = [];
      }
      acc[team.domain].push(team);
      return acc;
    }, {});

    // Prepare content with domain sections
    const content = [
      {
        text: "HackAbhigna - All Teams Report",
        style: "header",
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      {
        text: `Generated on: ${new Date().toLocaleDateString()}`,
        style: "subheader",
        alignment: "center",
        margin: [0, 0, 0, 30],
      },
      {
        text: `Total Teams: ${approvedTeams.length}`,
        style: "info",
        margin: [0, 0, 0, 20],
      },
    ];

    // Add each domain section
    Object.entries(teamsByDomain).forEach(([domain, teams], index) => {
      // Add page break before each domain except the first
      if (index > 0) {
        content.push({ text: "", pageBreak: "before" });
      }

      // Domain header
      content.push(
        {
          text: domain,
          style: "domainHeader",
          margin: [0, 0, 0, 10],
        },
        {
          text: `Teams in ${domain}: ${teams.length}`,
          style: "domainInfo",
          margin: [0, 0, 0, 15],
        }
      );

      // Table for this domain
      const tableBody = [
        // Header row
        [
          { text: "Team Name", style: "tableHeader" },
          { text: "Team Code", style: "tableHeader" },
          { text: "Members", style: "tableHeader" },
          { text: "Contact Details", style: "tableHeader" },
        ],
      ];

      // Add team data for this domain
      teams.forEach((team) => {
        const members = team.participants
          .map(
            (p, i) =>
              `${p.name}${i === team.leaderIndex ? " (L)" : ""}\n${p.email}${
                p.mobile ? `\n${p.mobile}` : ""
              }`
          )
          .join("\n\n");

        const contactDetails = `Leader: ${team.leaderMobile}${
          team.alternateMobile ? `\nAlt: ${team.alternateMobile}` : ""
        }`;

        tableBody.push([
          { text: team.teamName, style: "tableCell" },
          { text: team.teamCode || "N/A", style: "tableCell" },
          { text: members, style: "tableCell" },
          { text: contactDetails, style: "tableCell" },
        ]);
      });

      content.push({
        table: {
          headerRows: 1,
          widths: [100, 70, 130, 140],
          body: tableBody,
        },
        layout: {
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex === 0 ? "#CCCCCC" : null;
          },
        },
        margin: [0, 0, 0, 30],
      });
    });

    // Document definition
    const docDefinition = {
      content: content,
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: "#2E86AB",
        },
        subheader: {
          fontSize: 12,
          italics: true,
          color: "#666666",
        },
        info: {
          fontSize: 12,
          color: "#333333",
        },
        domainHeader: {
          fontSize: 16,
          bold: true,
          color: "#1B5E20",
          margin: [0, 10, 0, 5],
        },
        domainInfo: {
          fontSize: 11,
          color: "#666666",
          italics: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: "black",
          fillColor: "#f0f0f0",
          margin: [8, 10, 8, 10],
        },
        tableCell: {
          fontSize: 9,
          margin: [8, 8, 8, 8],
        },
      },
      defaultStyle: {
        font: "Roboto",
      },
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],
    };

    // Generate PDF
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="hackabhigna-teams-report-${
        new Date().toISOString().split("T")[0]
      }.pdf"`
    );

    // Pipe PDF to response
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      message: "Error generating PDF report",
      error: error.message,
    });
  }
});

// Submit contact message
app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();
    res.status(201).json({
      message: "Message sent successfully! We'll get back to you soon.",
      data: newMessage,
    });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Get all messages (admin only)
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ submittedAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Update message status (admin only)
app.patch("/messages/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["new", "read", "replied"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    message.status = status;
    await message.save();
    res.json({ message: `Message marked as ${status}!`, data: message });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

// Delete message (admin only)
app.delete("/messages/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    res.json({ message: "Message deleted successfully!" });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
