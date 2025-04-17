const { spawn } = require("child_process");

function runPythonCapture({ name, email, age, gender, hand }) {
  const pythonPath =
    "C:\\Users\\TT\\AppData\\Local\\Programs\\Python\\Python313\\python.exe"; // Your path here

  return new Promise((resolve, reject) => {
    const args = [name, email, age, gender, hand];
    const pythonProcess = spawn(pythonPath, ["scripts/capture.py", ...args]);

    let output = "";
    let error = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(error || `Python script exited with code ${code}`));
      }
    });

    pythonProcess.on("error", (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
}

module.exports = { runPythonCapture };
