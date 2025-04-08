

 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
 
const app = express();
const PORT = 8001;
 
// Middleware
app.use(cors());
app.use(express.json());
 
// MongoDB Connection
mongoose
  .connect("mongodb+srv://Xalt-test:nsFEW4w6OzddKead@test.yux69jn.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
 
// Mongoose Schema & Model
const FormSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  organization: { type: String },
  details: { type: String },
  submittedAt: { type: Date, default: Date.now }
});
 
const FormSubmission = mongoose.model("FormSubmission", FormSubmissionSchema);
 
// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sales.xaltanalytics@gmail.com", // Your Gmail
    // abhi.xalt  pass: "gvgm rhje txrv lcyd" // App-specific password from Gmail
    pass: "mbdj xaoe jxph jzmn"
  }
});
 
// Form Submission Route
app.post("/submit", async (req, res) => {
  const { name, email, organization, details } = req.body;
 
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }
 
  try {
 
     const newSubmission = new FormSubmission({ name, email, organization, details });
    await newSubmission.save();
 
    // 1. Send confirmation email to user (awaited)
    const mailOptionsUser = {
      from: "sales.xaltanalytics@gmail.com",
      to: email,
      subject: "Thank you for your submission",
      text: `Hello ${name},\n\nThank you for contacting us. \nOur team will reach out to you shortly.\n\nBest regards,\nXalt Analytics`
    };
 
    await transporter.sendMail(mailOptionsUser);
 
    // 2. Send internal notification email (non-blocking)
    transporter.sendMail({
      from: "sales.xaltanalytics@gmail.com",
      to: email,
      text: `Hello ${name},\n\nThank you for contacting us. \nOur team will reach out to you shortly.\n\nBest regards,\nXalt Analytics`
    }).catch(err => console.error("Error sending internal email:", err));
 
    return res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred while sending the email." });
  }
});
 
 
 
 
// Get all submissions and count
app.get("/submissions", async (req, res) => {
  try {
    const submissions = await FormSubmission.find().sort({ submittedAt: -1 }); // Latest first
    const totalCount = await FormSubmission.countDocuments();
 
    return res.status(200).json({
      total: totalCount,
      submissions
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({ error: "An error occurred while fetching submissions." });
  }
});
 
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 
 