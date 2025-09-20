const sgMail = require("@sendgrid/mail");

// Set SendGrid API key with proper encoding
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (mailOptions) => {
  try {
    // Convert nodemailer format to SendGrid format
    const msg = {
      to: mailOptions.to,
      from:
        mailOptions.from || process.env.FROM_EMAIL || "noreply@hackabhigna.com",
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
    };

    // Handle attachments if present
    if (mailOptions.attachments && mailOptions.attachments.length > 0) {
      msg.attachments = mailOptions.attachments.map((attachment) => ({
        content: attachment.content.toString("base64"),
        filename: attachment.filename,
        type: "image/png",
        disposition: "attachment",
        contentId: attachment.filename,
      }));
    }

    console.log("📧 Sending email via SendGrid...");
    console.log("To:", msg.to);
    console.log("Subject:", msg.subject);

    // Send email with error handling
    const result = await sgMail.send(msg);
    console.log("✅ Email sent successfully via SendGrid");
    return result;
  } catch (error) {
    console.error("❌ Error sending email via SendGrid:", error.message);

    // More detailed error logging
    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
      console.error("SendGrid error status:", error.response.status);
    }

    // If it's an authorization error, try alternative approach
    if (
      error.message.includes("Invalid character") ||
      error.message.includes("Authorization")
    ) {
      console.log("🔄 Attempting alternative email sending method...");

      try {
        // Alternative approach using direct axios call
        const axios = require("axios");
        const apiKey = process.env.SENDGRID_API_KEY;

        // Reconstruct the message object for alternative method
        const altMsg = {
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
          altMsg.attachments = mailOptions.attachments.map((att) => ({
            content: att.content.toString("base64"),
            filename: att.filename,
            type: att.type || "image/png",
            disposition: att.disposition || "attachment",
          }));
        }

        const response = await axios.post(
          "https://api.sendgrid.com/v3/mail/send",
          altMsg,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Email sent successfully via alternative method");
        return response.data;
      } catch (altError) {
        console.error("❌ Alternative method also failed:", altError.message);
        throw altError;
      }
    }

    throw error;
  }
};

module.exports = { sendMail };
