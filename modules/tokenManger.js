// modules/tokenManager.js
const fs = require("fs");
const path = require("path");

// Define the file path to store the token (inside the config folder)
const tokenFilePath = path.join(__dirname, "../config/token.json");

/**
 * Save the device token to a local JSON file.
 * @param {string} token - The token to save.
 */
function saveToken(token) {
  fs.writeFileSync(tokenFilePath, JSON.stringify({ token }), "utf8");
}

/**
 * Load the device token from the local JSON file.
 * @returns {string|null} - The saved token, or null if not found.
 */
function loadToken() {
  if (!fs.existsSync(tokenFilePath)) return null;
  const data = fs.readFileSync(tokenFilePath, "utf8");
  try {
    return JSON.parse(data).token;
  } catch (err) {
    console.error("Error parsing token file:", err);
    return null;
  }
}

/**
 * Delete the token file.
 */
function deleteToken() {
  if (fs.existsSync(tokenFilePath)) {
    fs.unlinkSync(tokenFilePath);
  }
}

module.exports = { saveToken, loadToken, deleteToken };
