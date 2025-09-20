const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email using SendGrid
 * @param {Object} mailOptions - Email options object
 * @returns {Promise} resolves on successful send, rejects on error
 */
async function sendMail(mailOptions) {
  try {
    // Convert nodemailer format to SendGrid format
    const msg = {
      to: mailOptions.to,
      from: mailOptions.from || "HackAbhigna <hackabhigna2025@gmail.com>",
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
      }));
    }

    const result = await sgMail.send(msg);
    console.log("Email sent successfully via SendGrid:", result[0].statusCode);
    return result;
  } catch (error) {
    console.error("Error sending email via SendGrid:", error);
    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
    }
    throw error;
  }
}

module.exports = {
  sendMail,
};
