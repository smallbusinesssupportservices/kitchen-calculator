import nodemailer from 'nodemailer';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export const sendEmail = async (req, res) => {
  try {
    const { to, subject, templateData } = req.body;

    // Read email template
    const templatePath = join(__dirname, '..', 'email-templates', 'estimate.html');
    let template = await readFile(templatePath, 'utf8');

    // Replace template variables
    const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
    template = template
      .replace('[LOW_RANGE]', formatCurrency(templateData.lowRange))
      .replace('[HIGH_RANGE]', formatCurrency(templateData.highRange))
      .replace(/\[BASE_URL\]/g, baseUrl)
      .replace(/\[USER_ID\]/g, templateData.userId);

    // Create plain text version
    const plainText = `
      Kitchen Estimate from 7 Day Kitchens

      Your Estimate Range: ${formatCurrency(templateData.lowRange)} - ${formatCurrency(templateData.highRange)}

      Ready to start? Visit: ${baseUrl}/email-action/schedule?id=${templateData.userId}
      Need design help? Visit: ${baseUrl}/email-action/design?id=${templateData.userId}
      Budget concerns? Visit: ${baseUrl}/email-action/budget?id=${templateData.userId}

      This estimate is valid for 30 days.
    `;

    // Gmail SMTP settings
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      text: plainText,
      html: template
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send(error.toString());
  }
};