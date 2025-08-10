import fetch from "node-fetch";
import https from "https";
import config from "./Config.js";

// HTTPS agent that ignores invalid/self-signed certificates
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const applyFabricToken = async () => {
  console.log("Applying Fabric Token...");

  try {
    const response = await fetch(config.baseUrl + "/payment/v1/token", {
      method: "POST",
      agent, // Use the custom agent
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
      },
      body: JSON.stringify({
        appSecret: config.appSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token request failed: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export default applyFabricToken;
