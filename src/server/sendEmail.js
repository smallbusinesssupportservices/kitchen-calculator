import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = (req, res) => {

    const { from, to, subject, text } = req.body;

    // Gmail SMTP settings
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    let mailOptions = { from, to, subject, text};

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).json({ message: 'Email sent successfully' });
    });
}

// sendEmail(
//     { body : {email: 'william@smallbusinessessupport.services', subject: "Email from Kitchen Calculator", message: "Here is your kitchen estimate: $10,000 - $15,000" }},
//     {}
// )