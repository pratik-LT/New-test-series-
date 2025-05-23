const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Replace with your Gmail and App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pratikp5967@gmail.com",
    pass: "YOUR_GMAIL_APP_PASSWORD"
  }
});

app.post("/send-result", (req, res) => {
  const { name, lastName, mobile, date, score } = req.body;

  if (!name || !lastName || !mobile || !date || score == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const mailOptions = {
    from: "pratikp5967@gmail.com",
    to: "pratikp5967@gmail.com",
    subject: "New Test Submission",
    text: `Name: ${name} ${lastName}\nMobile: ${mobile}\nDate: ${date}\nScore: ${score}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending