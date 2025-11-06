// src/components/email.js
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_e5h6hl9";
const TEMPLATE_ID = "template_fpt8j1e";
const PUBLIC_KEY = "f8OaZU57oeiISTn2F";

/**
 * Generic reusable function for sending any message
 */
function sendEmail(subject, title, message) {
  return emailjs
    .send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        subject,
        title, // optional extra field if you want
        message,
        from_name: "Birthday Candle App",
        from_email: "no-reply@birthday.com",
        to_name: "Aryan", // your name (recipient)
      },
      PUBLIC_KEY
    )
    .then(
      (result) => console.log("✅ Email sent:", result.text),
      (error) => console.error("❌ Email failed:", error.text)
    );
}

/**
 * Specific message helpers
 */
export const sendHappyBirthdayEmail = () =>
  sendEmail(
    "Birthday App",
    "🎂 Happy Birthday!",
    "The candle flame has been touched — fire ignited! 🔥"
  );

export const sendCorrectPasswordEmail = (code) =>
  sendEmail(
    "Birthday App",
    "🔓 Correct Code Entered",
    `A correct code was entered!\n\nEntered Code: ${code}`
  );

export const sendIncorrectPasswordEmail = (code) =>
  sendEmail(
    "Birthday App",
    "❌ Incorrect Code Attempt",
    `Someone entered the wrong code.\n\nEntered Code: ${code}`
  );

/* ----------------------------
   NEW: page/button specific helpers
   ---------------------------- */
export const sendCountdownLoadedEmail = () =>
  sendEmail(
    "Birthday App",
    "⏳ Countdown Loaded",
    "countdown page loaded"
  );

export const sendRaydayLoadedEmail = () =>
  sendEmail(
    "Birthday App",
    "🌅 RayDay Visible",
    "rayday afterbirthday page loaded"
  );

export const sendSurpriseClosedEmail = () =>
  sendEmail(
    "Birthday App",
    "🎁 Surprise Closed",
    "surprise button closed"
  );
