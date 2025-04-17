// core/cameraManager.js
const NodeWebcam = require("node-webcam");
const path = require("path");
const fs = require("fs");

const webcam = NodeWebcam.create({
  width: 640,
  height: 480,
  quality: 100,
  output: "jpeg",
  device: false, // Use default device, or set to "/dev/video0"
  callbackReturn: "location",
  verbose: false,
});

function captureImage(filename = "capture.jpg") {
  return new Promise((resolve, reject) => {
    const dirPath = path.join(__dirname, "..", "captures");
    const filePath = path.join(dirPath, filename);

    // Ensure the captures folder exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    webcam.capture(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
}

// ✅ Properly export the function
module.exports = {
  captureImage,
};
