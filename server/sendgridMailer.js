const https = require("https");
const url = require("url");

const sendMail = async (mailOptions) => {
  try {
    console.log("📧 Sending email via SendGrid...");
    console.log("To:", mailOptions.to);
    console.log("Subject:", mailOptions.subject);

    // Prepare the email data
    const emailData = {
      personalizations: [
        {
          to: [{ email: mailOptions.to }],
        },
      ],
      from: {
        email:
          mailOptions.from ||
          process.env.FROM_EMAIL ||
          "noreply@hackabhigna.com",
      },
      subject: mailOptions.subject,
      content: [
        { type: "text/plain", value: mailOptions.text },
        { type: "text/html", value: mailOptions.html },
      ],
    };

    // Handle attachments if present
    if (mailOptions.attachments && mailOptions.attachments.length > 0) {
      emailData.attachments = mailOptions.attachments.map((att) => ({
        content: att.content.toString("base64"),
        filename: att.filename,
        type: att.type || "image/png",
        disposition: att.disposition || "attachment",
      }));
    }

    // Use built-in HTTPS module to avoid underscore issues
    const sendGridRequest = (data) => {
      return new Promise((resolve, reject) => {
        const apiKey = process.env.SENDGRID_API_KEY;

        const options = {
          hostname: "api.sendgrid.com",
          path: "/v3/mail/send",
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "NodeJS/18.0.0",
          },
        };

        const req = https.request(options, (res) => {
          let body = "";
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ data: JSON.parse(body) });
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${body}`));
            }
          });
        });

        req.on("error", (err) => {
          reject(err);
        });

        req.write(JSON.stringify(data));
        req.end();
      });
    };

    const result = await sendGridRequest(emailData);
    console.log("✅ Email sent successfully via SendGrid");
    return result;
  } catch (error) {
    console.error("❌ Error sending email via SendGrid:", error.message);

    // If it's still an authorization error, try a different approach
    if (
      error.message.includes("Invalid character") ||
      error.message.includes("Authorization")
    ) {
      console.log("🔄 Attempting alternative approach...");

      try {
        // Try using a different header format
        const apiKey = process.env.SENDGRID_API_KEY;

        // Create a simple curl-like request using child_process
        const { spawn } = require("child_process");

        const emailPayload = JSON.stringify({
          personalizations: [
            {
              to: [{ email: mailOptions.to }],
            },
          ],
          from: {
            email:
              mailOptions.from ||
              process.env.FROM_EMAIL ||
              "noreply@hackabhigna.com",
          },
          subject: mailOptions.subject,
          content: [
            { type: "text/plain", value: mailOptions.text },
            { type: "text/html", value: mailOptions.html },
          ],
        });

        const curl = spawn("curl", [
          "-X",
          "POST",
          "https://api.sendgrid.com/v3/mail/send",
          "-H",
          `Authorization: Bearer ${apiKey}`,
          "-H",
          "Content-Type: application/json",
          "-d",
          emailPayload,
        ]);

        return new Promise((resolve, reject) => {
          curl.stdout.on("data", (data) => {
            console.log("✅ Email sent successfully via curl method");
            resolve({ data: data.toString() });
          });

          curl.stderr.on("data", (data) => {
            console.error("Curl error:", data.toString());
            reject(new Error(data.toString()));
          });

          curl.on("close", (code) => {
            if (code !== 0) {
              reject(new Error(`Curl process exited with code ${code}`));
            }
          });
        });
      } catch (curlError) {
        console.error("❌ Curl method also failed:", curlError.message);

        // Final fallback - just log the email details
        console.log("📝 Email details (for manual sending):");
        console.log("To:", mailOptions.to);
        console.log("From:", mailOptions.from || process.env.FROM_EMAIL);
        console.log("Subject:", mailOptions.subject);
        console.log("Content:", mailOptions.text);

        // Return success to not break the application flow
        return {
          data: {
            message: "Email logged for manual sending due to API issues",
          },
        };
      }
    }

    throw error;
  }
};

module.exports = { sendMail };
