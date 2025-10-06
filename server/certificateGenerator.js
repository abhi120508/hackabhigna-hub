const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

let PDFDocument;
try {
  PDFDocument = require("pdfkit");
} catch (e) {
  PDFDocument = null;
}

function escapeLaTeX(s = "") {
  return String(s)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([%&#{}_$^~^<>])/g, "\\$1");
}

function copyPublicCertificateAssets(dst) {
  const pubCertDir = path.join(__dirname, "..", "public", "certificate");
  if (!fs.existsSync(pubCertDir)) return;
  for (const f of fs.readdirSync(pubCertDir)) {
    const src = path.join(pubCertDir, f);
    const dest = path.join(dst, f);
    try {
      fs.copyFileSync(src, dest);
    } catch (e) {
      // ignore (directories / unreadable files)
    }
  }
}

function runPdflatex(tmpDir, pdflatexBin = "pdflatex") {
  const opts = { cwd: tmpDir, timeout: 30000 };
  const run = () =>
    spawnSync(
      pdflatexBin,
      ["-interaction=nonstopmode", "-halt-on-error", "main.tex"],
      opts
    );

  let res = run();
  if (res.status !== 0) {
    const out = (res.stdout || "").toString().slice(0, 2000);
    const err = (res.stderr || "").toString().slice(0, 2000);
    throw new Error(
      "pdflatex failed (pass1)\nstdout:\n" + out + "\nstderr:\n" + err
    );
  }
  res = run();
  if (res.status !== 0) {
    const out = (res.stdout || "").toString().slice(0, 2000);
    const err = (res.stderr || "").toString().slice(0, 2000);
    throw new Error(
      "pdflatex failed (pass2)\nstdout:\n" + out + "\nstderr:\n" + err
    );
  }
}

function generateWithLaTeX(participantName, teamName, pdflatexBin = "pdflatex") {
  const templatePath = path.join(__dirname, "templates", "certificate.tex");
  if (!fs.existsSync(templatePath))
    throw new Error("LaTeX template not found: " + templatePath);
  const tpl = fs.readFileSync(templatePath, "utf8");
  const tex = tpl
    .replace(/__PARTICIPANT__/g, escapeLaTeX(participantName))
    .replace(/__TEAM__/g, escapeLaTeX(teamName));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cert-"));
  try {
    fs.writeFileSync(path.join(tmp, "main.tex"), tex, "utf8");
    copyPublicCertificateAssets(tmp);
    runPdflatex(tmp, pdflatexBin);
    const pdfPath = path.join(tmp, "main.pdf");
    if (!fs.existsSync(pdfPath))
      throw new Error("PDF not produced by pdflatex");
    return fs.readFileSync(pdfPath);
  } finally {
    try {
      fs.rmSync(tmp, { recursive: true, force: true });
    } catch (e) {}
  }
}

function generateWithPdfKit(participantName, teamName) {
  if (!PDFDocument) throw new Error("pdfkit not installed (npm i pdfkit)");
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 48,
    });
    const bufs = [];
    doc.on("data", (b) => bufs.push(b));
    doc.on("end", () => resolve(Buffer.concat(bufs)));
    doc.on("error", reject);

    const assets = path.join(__dirname, "..", "public", "certificate");
    try {
      const logo = path.join(assets, "logo.png");
      if (fs.existsSync(logo)) {
        doc.image(logo, doc.page.width / 4, doc.page.height / 6, {
          width: doc.page.width / 2,
          opacity: 0.08,
        });
      }
    } catch (e) {}

    doc
      .fillColor("#0b663e")
      .fontSize(34)
      .text("Certificate of Participation", { align: "center" });
    doc.moveDown(1);
    doc
      .fillColor("black")
      .fontSize(28)
      .text(participantName, { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(14).text(`Team: ${teamName}`, { align: "center" });
    doc.moveDown(1);
    doc.fontSize(16).text("Congratulations on participating in HackAbhigna!", {
      align: "center",
    });

    // signatures
    const sigY = doc.page.height - 120;
    const colW = 180;
    doc
      .moveTo(80, sigY)
      .lineTo(80 + colW, sigY)
      .stroke();
    doc.text(
      "Dr. Pushpa Ravikumar\nProfessor & Head, Dept. of CS&E\nAIT, Chikkamagaluru",
      80,
      sigY + 6,
      {
        width: colW,
        align: "center",
      }
    );

    doc
      .moveTo(doc.page.width / 2 - colW / 2, sigY)
      .lineTo(doc.page.width / 2 + colW / 2, sigY)
      .stroke();
    doc.text(
      "Dr. C. T Jayadeva\nPrincipal\nAIT, Chikkamagaluru",
      doc.page.width / 2 - colW / 2,
      sigY + 6,
      {
        width: colW,
        align: "center",
      }
    );

    doc
      .moveTo(doc.page.width - 80 - colW, sigY)
      .lineTo(doc.page.width - 80, sigY)
      .stroke();
    doc.text(
      "Dr. C. K Subbaraya\nDirector, AIT\nRegister, ACU",
      doc.page.width - 80 - colW,
      sigY + 6,
      {
        width: colW,
        align: "center",
      }
    );

    doc.end();
  });
}

/**
 * Generate PDF buffer: prefer pdflatex when available unless FORCE_PDFKIT env forces fallback.
 */
async function findPdflatex() {
  // allow override via env
  const envPath = process.env.PDFLATEX_PATH || process.env.PDFLATEX_BIN;
  const candidates = [];
  if (envPath) candidates.push(envPath);

  // Common Windows MiKTeX locations
  candidates.push(
    "C:/Program Files/MiKTeX/miktex/bin/x64/pdflatex.exe",
    "C:/Program Files/MiKTeX/miktex/bin/pdflatex.exe",
    "C:/Program Files/MiKTeX 2.9/miktex/bin/x64/pdflatex.exe",
    "C:/Program Files/texlive/2023/bin/win32/pdflatex.exe",
    "C:/texlive/2023/bin/win32/pdflatex.exe"
  );

  // POSIX locations
  candidates.push("/usr/bin/pdflatex", "/usr/local/bin/pdflatex", "/Library/TeX/texbin/pdflatex");

  for (const p of candidates) {
    try {
      if (p && fs.existsSync(p)) return p;
    } catch (e) {}
  }

  // last resort: try running plain pdflatex on PATH
  try {
    const check = spawnSync("pdflatex", ["--version"], { timeout: 3000 });
    if (check.status === 0) return "pdflatex";
  } catch (e) {}
  return null;
}

/**
 * Generate PDF buffer: prefer pdflatex when available unless FORCE_PDFKIT env forces fallback.
 * Returns an object { buffer: Buffer, method: 'latex'|'pdfkit', pdflatexPath?: string }
 */
async function generateCertificatePDF(participantName, teamName) {
  const forcePdfKit =
    process.env.FORCE_PDFKIT === "1" || process.env.FORCE_PDFKIT === "true";
  if (forcePdfKit) {
    const buf = await generateWithPdfKit(participantName, teamName);
    return { buffer: buf, method: "pdfkit" };
  }

  const pdflatexPath = await findPdflatex();
  if (pdflatexPath) {
    try {
      const buf = generateWithLaTeX(participantName, teamName, pdflatexPath);
      console.log("certificateGenerator: used pdflatex at", pdflatexPath);
      return { buffer: buf, method: "latex", pdflatexPath };
    } catch (e) {
      console.error("certificateGenerator: pdflatex generation failed:", e && (e.message || e));
      // fallthrough to pdfkit
    }
  } else {
    console.log("certificateGenerator: pdflatex not found, falling back to pdfkit");
  }

  const buf = await generateWithPdfKit(participantName, teamName);
  return { buffer: buf, method: "pdfkit" };
}

module.exports = { generateCertificatePDF };
