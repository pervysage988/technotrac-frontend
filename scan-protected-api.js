// scan-protected-api.js
// Run with: node scan-protected-api.js

const fs = require("fs");
const path = require("path");

const FRONTEND_DIR = path.join(__dirname, "frontendd"); // Adjust if your frontend folder is named differently

// List of protected API functions
const protectedAPIs = [
  "fetchPendingEquipment",
  "fetchBookings",
  "createBooking",
  "updateBookingStatus",
  "submitRating",
  "signupStart",
  "login",
  "createEquipment",
  "updateEquipmentStatus",
];

// Recursively get all .ts, .tsx files
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Scan a file for protected API calls
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    protectedAPIs.forEach((fn) => {
      const regex = new RegExp(`${fn}\\s*\\(`);
      if (regex.test(line)) {
        // Check if token is passed
        const argsInside = line.match(/\((.*)\)/)?.[1] || "";
        if (!argsInside.includes("token") && !argsInside.includes("await user.getIdToken()")) {
          console.log(`${filePath}:${index + 1} → ${line.trim()}`);
        }
      }
    });
  });
}

// Run scan
const allFiles = getAllFiles(FRONTEND_DIR);
allFiles.forEach(scanFile);

console.log("\nScan complete. Any lines above are API calls missing a token argument.");
