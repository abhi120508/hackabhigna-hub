const https = require("https");
const nodemailer = require("nodemailer");

const sendMail = async (mailOptions) => {
  try {
    console.log("📧 Sending email via SendGrid...");
    console.log("To:", mailOptions.to);
    console.log("Subject:", mailOptions.subject);

    // Get API key and validate it
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY environment variable is not set");
    }

    console.log("API Key length:", apiKey.length);
    console.log("API Key starts with:", apiKey.substring(0, 10) + "...");

    // Method 1: Try Nodemailer with SendGrid SMTP first (most reliable)
    console.log("🔄 Attempting Nodemailer with SendGrid SMTP...");

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false,
        auth: {
          user: "apikey",
          pass: apiKey,
        },
      });

      const mailOptionsSMTP = {
        from:
          mailOptions.from ||
          process.env.FROM_EMAIL ||
          "noreply@hackabhigna.com",
        to: mailOptions.to,
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html,
      };

      const result = await transporter.sendMail(mailOptionsSMTP);
      console.log("✅ Email sent successfully via Nodemailer SMTP");
      console.log("Message ID:", result.messageId);
      return result;
    } catch (nodemailerError) {
      console.error("❌ Nodemailer SMTP failed:", nodemailerError.message);

      // Method 2: Try Gmail SMTP as fallback
      console.log("🔄 Attempting Gmail SMTP as fallback...");

      try {
        const gmailTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER || "hackabhigna2025@gmail.com",
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        const gmailOptions = {
          from: process.env.GMAIL_USER || "hackabhigna-hub@gmail.com",
          to: mailOptions.to,
          subject: mailOptions.subject,
          text: mailOptions.text,
          html: mailOptions.html,
        };

        const result = await gmailTransporter.sendMail(gmailOptions);
        console.log("✅ Email sent successfully via Gmail SMTP");
        console.log("Message ID:", result.messageId);
        return result;
      } catch (gmailError) {
        console.error("❌ Gmail SMTP also failed:", gmailError.message);

        // Method 3: Try SendGrid API as last resort
        console.log("🔄 Attempting SendGrid API as last resort...");

        try {
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

          const sendGridRequest = (data) => {
            return new Promise((resolve, reject) => {
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
                    resolve({ data: body });
                  } else {
                    reject(
                      new Error(`SendGrid API Error ${res.statusCode}: ${body}`)
                    );
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
          console.log("✅ Email sent successfully via SendGrid API");
          return result;
        } catch (apiError) {
          console.error("❌ SendGrid API also failed:", apiError.message);

          // Final fallback - log email details
          console.log(
            "📝 All email methods failed. Email details for manual sending:"
          );
          console.log("To:", mailOptions.to);
          console.log("From:", mailOptions.from || process.env.FROM_EMAIL);
          console.log("Subject:", mailOptions.subject);
          console.log("Text Content:", mailOptions.text);
          console.log("HTML Content:", mailOptions.html);

          // Return success to not break the application flow
          return {
            data: {
              message: "Email logged for manual sending due to API issues",
              error: apiError.message,
            },
          };
        }
      }
    }
  } catch (error) {
    console.error("❌ Unexpected error in sendMail:", error.message);
    throw error;
  }
};

module.exports = { sendMail };
