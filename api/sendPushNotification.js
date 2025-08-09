const functions = require("firebase-functions");
const fetch = require("node-fetch"); // Make sure you have node-fetch installed

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"; // Expo Push API URL

// Firebase Cloud Function to send notification to Expo push token
exports.sendPushNotification = functions.https.onRequest(async (req, res) => {
  const { expoPushToken, title, body, data } = req.body;

  // Validate the request body
  if (!expoPushToken || !title || !body) {
    return res
      .status(400)
      .send("Missing required fields (expoPushToken, title, body)");
  }

  // Create the message body for Expo Push API
  const message = {
    to: expoPushToken, // The Expo push token you got from the client
    title: title, // Notification title
    body: body, // Notification body
    data: data, // Any additional data you want to send
  };

  try {
    // Send the push notification to Expo API
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();
    console.log("Expo Push Response:", responseData);

    if (responseData.data && responseData.data.status === "ok") {
      return res.status(200).send("Push notification sent successfully");
    } else {
      console.error("Error in response:", responseData);
      return res.status(500).send("Error sending push notification");
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
    return res.status(500).send("Error sending push notification");
  }
});
