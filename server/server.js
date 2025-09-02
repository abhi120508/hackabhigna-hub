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
  name: String,
  email: String,
});

const teamSchema = new mongoose.Schema({
  teamName: String,
  leader: participantSchema,
  participants: [participantSchema],
  domain: String,
  gitRepo: String,
  paymentProof: String,
});

const WebTeam = mongoose.model("WebTeam", teamSchema);
const MobileTeam = mongoose.model("MobileTeam", teamSchema);
const AITeam = mongoose.model("AITeam", teamSchema);
const WildcardTeam = mongoose.model("WildcardTeam", teamSchema);

const domainModels = {
  web: WebTeam,
  mobile: MobileTeam,
  ai: AITeam,
  wildcard: WildcardTeam,
};

app.post("/register", upload.single("paymentProof"), async (req, res) => {
  const { teamName, participants, leaderIndex, domain, gitRepo } = JSON.parse(
    req.body.team
  );
  const paymentProof = req.file.path;

  const leader = participants[leaderIndex];
  const otherParticipants = participants.filter(
    (_, index) => index !== leaderIndex
  );

  const TeamModel = domainModels[domain];

  if (!TeamModel) {
    return res.status(400).json("Invalid domain");
  }

  const newTeam = new TeamModel({
    teamName,
    leader,
    participants: otherParticipants,
    domain,
    gitRepo,
    paymentProof,
  });

  try {
    await newTeam.save();
    res.json("Team registered successfully!");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
