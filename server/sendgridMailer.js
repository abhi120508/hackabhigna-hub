const sgMail = require("@sendgrid/mail");

// Set SendGrid API key
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

    const result = await sgMail.send(msg);
    console.log("✅ Email sent successfully via SendGrid");
    return result;
  } catch (error) {
    console.error("❌ Error sending email via SendGrid:", error);
    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
    }
    throw error;
  }
};

module.exports = { sendMail };
