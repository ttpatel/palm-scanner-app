// modules/apiClient.js
const appConfig = require("../config/app.config");

function login(deviceCode) {
  if (appConfig.useDummyData) {
    return new Promise((resolve, reject) => {
      console.log("Dummy API: Checking device code:", deviceCode);
      setTimeout(() => {
        // Check if the device code matches the hardcoded dummy code
        if (deviceCode === appConfig.dummyDeviceCode) {
          // If valid, resolve with the dummy token
          resolve({ token: appConfig.dummyToken });
        } else {
          // If invalid, reject with an error messages
          reject(
            new Error(
              `Invalid device code. Please enter '${appConfig.dummyDeviceCode}' as the device code.`
            )
          );
        }
      }, 500); // Simulated API response delay
    });
  } else {
    // If not using dummy data, call the real API
    return axios
      .post(`${appConfig.API_BASE_URL}/auth/login`, { deviceCode })
      .then((response) => response.data)
      .catch((error) => {
        console.error("API login error:", error);
        throw error;
      });
  }
}

module.exports = { login };
