#!/usr/bin/env node

/**
 * Local Certificate Service
 * Runs on your local machine (port 3001)
 * Receives certificate requests from Admin Panel
 * Generates PDFs using local pdflatex
 * Sends emails with certificates
 */

const express = require("express");
const cors = require("cors");
const { generateCertificatePDF } = require("./certificateGenerator");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.LOCAL_CERT_PORT || 3001;

app.use(cors());
app.use(express.json());

console.log("🎓 Local Certificate Service Starting...");
console.log(`📍 Port: ${PORT}`);
console.log("-------------------------------------------\n");

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "local-certificate-service" });
});

// Main endpoint: Generate and send certificates
app.post("/generate-and-send-certificate", async (req, res) => {
  try {
    const { teamId, teamName, participants, leaderIndex } = req.body;

    if (!teamName || !participants || leaderIndex === undefined) {
      return res.status(400).json({
        message: "Missing required fields: teamName, participants, leaderIndex",
      });
    }

    console.log(`\n📋 Processing certificate request`);
    console.log(`   Team: ${teamName}`);
    console.log(`   Participants: ${participants.length}`);

    // Generate certificates for each participant
    const attachments = [];

    for (const participant of participants) {
      try {
        console.log(`   📄 Generating certificate for ${participant.name}...`);

        const result = await generateCertificatePDF(
          participant.name,
          teamName
        );
        const buf = result && result.buffer ? result.buffer : result;
        const method = result && result.method ? result.method : "unknown";

        console.log(
          `   ✅ Generated: ${buf.length} bytes (method: ${method})`
        );

        // Sanitize filename
        const sanitizedName = String(participant.name)
          .trim()
          .replace(/[^a-z0-9._-]/gi, "_")
          .replace(/_+/g, "_")
          .substring(0, 120);

        attachments.push({
          filename: `${sanitizedName}.pdf`,
          content: buf,
          contentType: "application/pdf",
        });
      } catch (error) {
        console.error(
          `   ❌ Failed to generate certificate for ${participant.name}:`,
          error.message
        );
        return res.status(500).json({
          message: `Failed to generate certificate for ${participant.name}`,
          error: error.message,
        });
      }
    }

    // Get team leader email
    const leaderEmail = participants[leaderIndex]?.email;
    const leaderName = participants[leaderIndex]?.name;

    if (!leaderEmail) {
      return res.status(400).json({
        message: "Team leader email not found",
      });
    }

    console.log(`   📧 Sending email to ${leaderEmail}...`);

    // Send email
    try {
      const mailOptions = {
        from: `"HackAbhigna" <noreply@hackabhigna.in>`,
        to: leaderEmail,
        subject: `HackAbhigna - Certificates for ${teamName}`,
        text: `Dear ${
          leaderName || "Participant"
        },\n\nCongratulations! Please find the attached certificates of participation for your team ${teamName}.\n\nBest regards,\nHackAbhigna Team`,
        html: `<p>Dear ${
          leaderName || "Participant"
        },</p><p>Congratulations! Please find attached the certificate(s) of participation for your team <strong>${teamName}</strong>.</p><p>We appreciate your participation in HackAbhigna — congratulations on taking part!</p><p>Best regards,<br/>HackAbhigna Team</p>`,
        attachments,
      };

      await transporter.sendMail(mailOptions);

      console.log(`   ✅ Email sent successfully to ${leaderEmail}`);
      console.log(`✅ Certificate process completed for ${teamName}\n`);

      return res.status(200).json({
        success: true,
        message: "Certificates generated and sent successfully",
        teamName,
        leaderEmail,
        participantCount: participants.length,
      });
    } catch (emailError) {
      console.error(`   ❌ Failed to send email:`, emailError.message);
      return res.status(500).json({
        message: "Failed to send email",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error("❌ Error processing certificate request:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local Certificate Service running on http://localhost:${PORT}`);
  console.log(`✅ Ready to receive certificate requests from Admin Panel\n`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n👋 Shutting down local certificate service...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n\n👋 Shutting down local certificate service...");
  process.exit(0);
});

