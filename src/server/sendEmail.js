import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = (req, res) => {
    const { from, to, subject, text, html } = req.body;

    // Gmail SMTP settings
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    let mailOptions = {
        from: 'william@smallbusinessessupport.services',
        to,
        subject,
        text, // Plain text version
        html  // HTML version
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send(error.toString());
        }
        res.status(200).json({ message: 'Email sent successfully' });
    });
}