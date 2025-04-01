// const express = require('express');
// const nodemailer = require('nodemailer');
// const app = express();
// const PORT = 5050;
 
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
 
// app.post('/submit', (req, res) => {
//   const { name, email, subject, message } = req.body;
 
//   // Configure Nodemailer
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'abhimanyu.xalt@gmail.com', // Your Gmail address
//       pass: 'gvgm rhje txrv lcyd' // Your Gmail password or app password
//     }
//   });
 
//   const mailOptions = {
//     from: 'abhimanyu.xalt@gmail.com',
//     to: email, // Send the response to the user's email
//     subject: subject,
//     text: `Hello ${name},\n\nThank you for your message:\n${message}\n\nBest regards,\nYour Company`
//   };
 
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending email:', error); // Log the error
//       return res.status(500).send('Error sending email: ' + error.toString());
//     }
//     res.status(200).send('Email sent: ' + info.response);
//   });
// });
 
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
 
 
 
 
 
 
 
 
 
 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const { addDataToSheet } = require("./googleSheet");
 
const app = express();
const PORT = 3001;
 
// Middleware
app.use(cors());
app.use(express.json());
 
// MongoDB Connection
mongoose
  .connect("mongodb+srv://Xalt-test:nsFEW4w6OzddKead@test.yux69jn.mongodb.net/", { useNewUrlParser: true, useUnifiedTopology: true })
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
 
// Form Submission Route
app.post("/submit", async (req, res) => {
  const { name, email, organization, details } = req.body;
 
  // Validate input
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }
 
  try {
    // Save data to MongoDB
    const newSubmission = new FormSubmission({ name, email, organization, details });
    await newSubmission.save();
 
    // Send a success response
    return res.status(201).json({ message: "Submission successful", submission: newSubmission });
  } catch (error) {
    console.error("Error saving submission:", error);
    return res.status(500).json({ error: "An error occurred while saving the submission." });
  }
 
});
 
// comment test
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 
 