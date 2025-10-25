const puppeteer = require("puppeteer");
const path = require("path");

async function generateCertificatePDF(participantName, teamName) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Get absolute paths for images
  const publicCertDir = path.join(__dirname, "..", "public", "certificate");
  const backgroundPath = `file://${path.join(publicCertDir, "background.png")}`;
  const logoPath = `file://${path.join(publicCertDir, "logo.png")}`;
  const monkLeftPath = `file://${path.join(
    publicCertDir,
    "Swamiji1-modified.png"
  )}`;
  const monkRightPath = `file://${path.join(
    publicCertDir,
    "Swamiji2-modified.png"
  )}`;
  const geminiPath = `file://${path.join(
    publicCertDir,
    "google gemini logo.png"
  )}`;
  const streamzPath = `file://${path.join(publicCertDir, "streamz.png")}`;
  const environPath = `file://${path.join(publicCertDir, "environ.jpg")}`;
  const ictPath = `file://${path.join(publicCertDir, "ICT.png")}`;

  // HTML template
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificate</title>
      <style>
        body {
          font-family: 'Times New Roman', Times, serif;
          margin: 0;
          padding: 0;
          width: 1122px;
          height: 794px;
          position: relative;
          background: white;
        }

        .background {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 55%;
          opacity: 0.08;
          z-index: 0;
        }

        .header {
          position: absolute;
          top: 0;
          width: 100%;
          text-align: center;
          z-index: 1;
        }

        .monk-left {
          position: absolute;
          left: 15px;
          top: 10px;
          height: 100px;
        }

        .monk-right {
          position: absolute;
          right: 15px;
          top: 10px;
          height: 100px;
        }

        .institute-text {
          position: absolute;
          top: 10px;
          width: 100%;
          text-align: center;
          line-height: 1.2;
          font-size: 12px;
          font-weight: bold;
        }

        .content {
          position: absolute;
          top: 150px;
          width: 100%;
          text-align: center;
          line-height: 1.5;
          z-index: 1;
        }

        .content h1 {
          font-size: 48px;
          font-weight: bold;
          margin: 0;
        }

        .content h2 {
          font-size: 20px;
          font-weight: bold;
          margin: 10px 0;
        }

        .content p {
          font-size: 20px;
          margin: 10px 0;
        }

        .content h3 {
          font-size: 28px;
          font-weight: bold;
          margin: 20px 0;
        }

        .content .team {
          font-size: 14px;
          font-weight: bold;
          margin: 10px 0;
        }

        .content .description {
          font-size: 14px;
          max-width: 80%;
          margin: 20px auto;
          line-height: 1.4;
        }

        .collaboration {
          position: absolute;
          top: 500px;
          width: 80%;
          left: 10%;
          text-align: center;
          z-index: 1;
        }

        .collaboration p {
          font-size: 14px;
          font-weight: bold;
          margin: 0 0 10px 0;
        }

        .logos {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logos img {
          height: 20px;
          margin: 0 10px;
        }

        .knowledge-partner {
          position: absolute;
          top: 500px;
          right: 15px;
          text-align: center;
          z-index: 1;
        }

        .knowledge-partner p {
          font-size: 12px;
          font-weight: bold;
          margin: 0 0 5px 0;
        }

        .knowledge-partner img {
          height: 24px;
        }

        .signatures {
          position: absolute;
          bottom: 30px;
          width: 90%;
          left: 5%;
          display: flex;
          justify-content: space-between;
          z-index: 1;
        }

        .signature {
          text-align: center;
          width: 28%;
        }

        .signature hr {
          border: 0.2px solid black;
          width: 150px;
          margin-bottom: 5px;
        }

        .signature p {
          font-size: 12px;
          margin: 0;
          line-height: 1.2;
        }
      </style>
    </head>
    <body>
      <img src="${backgroundPath}" class="background" alt="Background">

      <img src="${logoPath}" class="watermark" alt="Watermark Logo">

      <div class="header">
        <img src="${monkLeftPath}" class="monk-left" alt="Monk Left">
        <img src="${monkRightPath}" class="monk-right" alt="Monk Right">
        <div class="institute-text">
          <p>|| JAI SRI GURUDEV ||</p>
          <p>ADICHUNCHANAGIRI INSTITUTE OF TECHNOLOGY</p>
          <p>JYOTHI NAGARA, CHIKKAMAGALURU-577102, KARNATAKA, INDIA</p>
          <p>DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</p>
        </div>
      </div>

      <div class="content">
        <h1>CERTIFICATE</h1>
        <h2>OF PARTICIPATION</h2>
        <p>This is to certify that</p>
        <h3 id="participant-name">${participantName}</h3>
        <p class="team">Team: <span id="team-name">${teamName}</span></p>
        <p class="description">This is to certify that the above participant has taken part in HACKABHIGNA (domain name), a 24-Hours National-Level Hackathon organized by the Department of Computer Science & Engineering, Adichunchanagiri Institute of Technology.</p>
      </div>

      <div class="collaboration">
        <p>In Collaboration with</p>
        <div class="logos">
          <img src="${geminiPath}" alt="Google Gemini">
          <img src="${streamzPath}" alt="Streamz">
          <img src="${environPath}" alt="Environ">
        </div>
      </div>

      <div class="knowledge-partner">
        <p>Knowledge Partner</p>
        <img src="${ictPath}" alt="ICT">
      </div>

      <div class="signatures">
        <div class="signature">
          <hr>
          <p><strong>Dr. Pushpa Ravikumar</strong><br>Professor & Head, Dept. of CS&E<br>AIT, Chikkamagaluru</p>
        </div>
        <div class="signature">
          <hr>
          <p><strong>Dr. C. T Jayadeva</strong><br>Principal<br>AIT, Chikkamagaluru</p>
        </div>
        <div class="signature">
          <hr>
          <p><strong>Dr. C. K Subbaraya</strong><br>Director, AIT<br>Register, ACU</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    width: "1122px",
    height: "794px",
    printBackground: true,
    margin: {
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    },
  });

  await browser.close();

  return { buffer: pdfBuffer, method: "puppeteer" };
}

module.exports = { generateCertificatePDF };
