import express from "express";
import { Resend } from "resend";
import { getEnvironment } from "../utility/environment.js";

const router = express.Router();

// POST request to send email
router.post("/send", async (req, res) => {
  const { resendKey } = getEnvironment();

  try {
    const resend = new Resend(resendKey);
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, email, message",
      });
    }

    // email sending function
    const { data, error } = await resend.emails.send({
      from: "The Source of Hope <onboarding@resend.dev>",
      to: ["treasurer@thesourceofhope.org"],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return res.status(400).json({
        success: false,
        error: error.message || "Failed to send email",
      });
    }

    res.json({
      success: true,
      data,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
