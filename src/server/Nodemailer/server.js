// https://chatgpt.com/c/67192d00-c748-8007-b7a3-fa68877b8df1
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a POST route to handle sending emails
app.post('/send-email', (req, res) => {
  const { email, subject, message } = req.body;

  // Gmail SMTP settings
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,  
      pass: process.env.GMAIL_PASS,   
    },
  });

  let mailOptions = {
    from: email,
    to: 'recipient@example.com', // Recipient email
    subject: subject,
    text: message,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
