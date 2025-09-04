const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
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
  paymentProof: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  submittedAt: { type: Date, default: Date.now },
  approvedAt: { type: Date },
  uniqueId: { type: String, unique: true, sparse: true },
  githubRepo: { type: String },
  qrCode: { type: String },
});

const Team = mongoose.model("Team", teamSchema);

// Helper to generate unique ID
const generateUniqueId = async (domain, teamName) => {
  const domainPrefix = domain.substring(0, 2).toUpperCase();
  const teamPrefix = teamName.substring(0, 2).toUpperCase();
  const count = await Team.countDocuments({ domain });
  const number = String(count + 1).padStart(3, "0");
  return `${domainPrefix}${teamPrefix}${number}`;
};

app.post("/register", upload.single("paymentProof"), async (req, res) => {
  try {
    const teamData = JSON.parse(req.body.team);
    const paymentProofPath = req.file ? req.file.path : null;

    if (!paymentProofPath) {
      return res.status(400).json({ message: "Payment proof is required." });
    }

    const newTeam = new Team({
      ...teamData,
      paymentProof: paymentProofPath,
    });

    await newTeam.save();
    res.status(201).json({
      message: "Team registered successfully!",
      data: newTeam,
    });
  } catch (err) {
    res.status(400).json({ message: "Error: " + err.message });
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
      if (!team.uniqueId) {
        team.uniqueId = await generateUniqueId(team.domain, team.teamName);
      }
      const repoUrl = `https://github.com/hackabhigna/${team.uniqueId.toLowerCase()}`;
      team.githubRepo = repoUrl;
      team.qrCode = repoUrl; // Set QR code to be the same as the GitHub repo URL
    }

    await team.save();
    res.json({ message: `Team ${status} successfully!`, data: team });
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
    const { uniqueId } = req.params;
    const team = await Team.findOne({ uniqueId });

    if (team) {
      res.json({ success: true, data: team });
    } else {
      res.status(404).json({ success: false, message: "Team not found." });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Error: " + err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
