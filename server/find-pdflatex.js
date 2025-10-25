#!/usr/bin/env node

/**
 * Find pdflatex Installation
 * Run this script to find where pdflatex is installed on your system
 * 
 * Usage: node find-pdflatex.js
 */

const fs = require("fs");
const { spawnSync } = require("child_process");
const os = require("os");

console.log("\n" + "=".repeat(70));
console.log("🔍 Finding pdflatex Installation");
console.log("=".repeat(70) + "\n");

const platform = os.platform();
console.log(`Operating System: ${platform}\n`);

// Common paths by OS
const commonPaths = {
  win32: [
    "C:/Program Files/MiKTeX/miktex/bin/x64/pdflatex.exe",
    "C:/Program Files/MiKTeX/miktex/bin/pdflatex.exe",
    "C:/Program Files/MiKTeX 2.9/miktex/bin/x64/pdflatex.exe",
    "C:/texlive/2023/bin/win32/pdflatex.exe",
    "C:/texlive/2024/bin/win32/pdflatex.exe",
  ],
  darwin: [
    "/Library/TeX/texbin/pdflatex",
    "/usr/local/bin/pdflatex",
    "/opt/local/bin/pdflatex",
  ],
  linux: [
    "/usr/bin/pdflatex",
    "/usr/local/bin/pdflatex",
    "/opt/texlive/2023/bin/x86_64-linux/pdflatex",
    "/opt/texlive/2024/bin/x86_64-linux/pdflatex",
  ],
};

const paths = commonPaths[platform] || [];

console.log("📁 Checking common installation paths:\n");

let found = false;
for (const p of paths) {
  const exists = fs.existsSync(p);
  console.log(`  ${exists ? "✅" : "❌"} ${p}`);
  if (exists) {
    found = true;
  }
}

console.log("\n🔍 Checking PATH environment variable:\n");

try {
  const check = spawnSync("pdflatex", ["--version"], { timeout: 3000 });
  if (check.status === 0) {
    console.log("  ✅ pdflatex found in PATH");
    console.log("\n  Output:");
    console.log("  " + check.stdout.toString().split("\n")[0]);
    found = true;

    // Try to find the actual path
    const which = spawnSync(platform === "win32" ? "where" : "which", [
      "pdflatex",
    ]);
    if (which.status === 0) {
      const actualPath = which.stdout.toString().trim().split("\n")[0];
      console.log(`\n  📍 Full path: ${actualPath}`);
    }
  }
} catch (e) {
  console.log("  ❌ pdflatex not found in PATH");
}

console.log("\n" + "=".repeat(70));

if (found) {
  console.log("✅ pdflatex FOUND on your system!\n");
  console.log("📝 Add this to your .env file:\n");

  // Try to get the actual path
  try {
    const which = spawnSync(platform === "win32" ? "where" : "which", [
      "pdflatex",
    ]);
    if (which.status === 0) {
      const actualPath = which.stdout.toString().trim().split("\n")[0];
      console.log(`PDFLATEX_PATH=${actualPath}\n`);
    }
  } catch (e) {
    // Fallback to common paths
    for (const p of paths) {
      if (fs.existsSync(p)) {
        console.log(`PDFLATEX_PATH=${p}\n`);
        break;
      }
    }
  }

  console.log("Then restart your server:");
  console.log("  npm run dev\n");
} else {
  console.log("❌ pdflatex NOT FOUND on your system\n");
  console.log("📥 Installation Instructions:\n");

  if (platform === "win32") {
    console.log("  Windows (MiKTeX):");
    console.log("  1. Download from: https://miktex.org/download");
    console.log("  2. Run the installer");
    console.log("  3. Choose 'Install missing packages on-the-fly'");
    console.log("  4. Restart your computer");
    console.log("  5. Run this script again\n");
  } else if (platform === "darwin") {
    console.log("  macOS (MacTeX):");
    console.log("  1. Run: brew install --cask mactex");
    console.log("  2. Wait for installation (~4GB)");
    console.log("  3. Run this script again\n");
  } else if (platform === "linux") {
    console.log("  Linux (TeX Live):");
    console.log("  1. Run: sudo apt-get update");
    console.log("  2. Run: sudo apt-get install texlive-latex-base texlive-latex-extra");
    console.log("  3. Run this script again\n");
  }
}

console.log("=".repeat(70) + "\n");

