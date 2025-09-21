const sgMail = require("@sendgrid/mail");

// Set API key from environment variable
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  throw new Error("SENDGRID_API_KEY environment variable is not set");
}
sgMail.setApiKey(apiKey);

/**
 * Send an email using SendGrid API
 * @param {Object} mailOptions
 *   - to: recipient email (required)
 *   - from: sender email (must be verified in SendGrid)
 *   - subject: email subject
 *   - text: plain text content
 *   - html: HTML content
 */
const sendMail = async (mailOptions) => {
  try {
    // Validate required fields
    if (
      !mailOptions.to ||
      !mailOptions.subject ||
      (!mailOptions.text && !mailOptions.html)
    ) {
      throw new Error(
        "Missing required mail options: to, subject, and text/html content"
      );
    }

    // Set default FROM email if not provided
    const fromEmail = mailOptions.from || process.env.FROM_EMAIL;
    if (!fromEmail) {
      throw new Error(
        "FROM email is not set. Set mailOptions.from or FROM_EMAIL env variable"
      );
    }

    console.log("📧 Sending email via SendGrid API...");
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`From: ${fromEmail}`);

    // Prepare email payload
    const msg = {
      to: mailOptions.to,
      from: fromEmail,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
    };

    // Send email
    const response = await sgMail.send(msg);

    // Log response for debugging
    console.log("✅ SendGrid accepted the request. Response details:");
    console.log(response[0].statusCode, response[0].headers);

    return response;
  } catch (error) {
    // Log detailed error including SendGrid response body
    console.error(
      "❌ SendGrid API failed:",
      error.response?.body || error.message
    );
    throw error;
  }
};

module.exports = { sendMail };
