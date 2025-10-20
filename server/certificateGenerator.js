const fs = require("fs");
const path = require("path");
const axios = require("axios");

function escapeLaTeX(s = "") {
  return String(s)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([%&#{}_$^~^<>])/g, "\\$1");
}

async function retryApiCall(apiCall, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (e) {
      console.error(
        `certificateGenerator: API call failed (attempt ${
          i + 1
        }/${maxRetries}):`,
        e.message
      );
      if (i < maxRetries - 1) {
        console.log(`certificateGenerator: retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw e;
      }
    }
  }
}

async function getAsposeAccessToken() {
  const clientId = process.env.ASPOSE_CLIENT_ID;
  const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "ASPOSE_CLIENT_ID and ASPOSE_CLIENT_SECRET environment variables are required"
    );
  }

  const response = await axios.post(
    "https://api.aspose.cloud/connect/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!response.data.access_token) {
    throw new Error("Failed to obtain access token from Aspose");
  }

  return response.data.access_token;
}

/**
 * Generate PDF buffer using only online LaTeX API (Aspose).
 * Returns an object { buffer: Buffer, method: 'latex' }
 */
async function generateCertificatePDF(participantName, teamName) {
  const apiUrl =
    process.env.CERTIFICATE_API_URL ||
    "https://api.aspose.cloud/v4.0/pdf/create/latex";

  // Get access token using client credentials
  const accessToken = await getAsposeAccessToken();

  // Read LaTeX template and replace placeholders
  const templatePath = path.join(__dirname, "templates", "certificate.tex");
  if (!fs.existsSync(templatePath)) {
    throw new Error("LaTeX template not found: " + templatePath);
  }
  const tpl = fs.readFileSync(templatePath, "utf8");
  const latexContent = tpl
    .replace(/__PARTICIPANT__/g, escapeLaTeX(participantName))
    .replace(/__TEAM__/g, escapeLaTeX(teamName));

  const response = await retryApiCall(() =>
    axios.post(
      apiUrl,
      {
        latexContent: latexContent,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    )
  );

  if (!response.data) {
    throw new Error("No data received from LaTeX API");
  }

  console.log("certificateGenerator: used online LaTeX API (Aspose)");
  return { buffer: Buffer.from(response.data), method: "latex" };
}

module.exports = { generateCertificatePDF };
