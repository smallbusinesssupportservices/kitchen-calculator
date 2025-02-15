import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { processFormData } from './formHandler.js';
import { sendEmail } from './sendEmail.js';
import { updateCalculatorSetting } from '../components/adminView/calculator/updateCalculatorSettings.js';
import { updateCategorySetting } from '../components/adminView/categories/updateCategorySetting.js';
import { updateItem } from '../components/adminView/items/updateItem.js';
import { updateVisitor } from '../components/adminView/visitors/updateVisitor.js';
import bodyParser from 'body-parser';
import qboClient from './qbo.js';
import QRCode from 'qrcode';
import teamMembers from '../data/teamMembers.json' assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findMemberByRoleSlug(roleSlug) {
  for (const department of Object.values(teamMembers)) {
    const foundMember = department.members.find(m => 
      slugify(m.role) === roleSlug && m.active
    );
    if (foundMember) return foundMember;
  }
  return null;
}

// vCard endpoint
app.get('/team/:role/vcf', (req, res) => {
  try {
    const { role } = req.params;
    const member = findMemberByRoleSlug(role);
    
    if (!member) {
      return res.status(404).send('Team member not found');
    }

    // Format categories (expertise) as a comma-separated string
    const categories = member.expertise ? member.expertise.join(',') : '';
    
    // General appointments
    const calUri = `https://calendar.google.com/calendar/appointments/schedules/AcZssZ3fyWaQmMk_JZvj6-6RomRzViixeC5Be9-pZ4PJ4f2t7nFCU5CTm_Ioju0_HjNYQayVIOu9jshI`;
    
    // Company logo URL
    const logo = 'https://theatlhomemaker.com/logo.png';
    
    // Calendar URL
    const fbUrl = 'https://calendar.google.com/calendar/u/0?cid=d2lsbGlhbUBzbWFsbGJ1c2luZXNzZXNzdXBwb3J0LnNlcnZpY2Vz';

    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${member.name}`,
      member.nickname ? `NICKNAME:${member.nickname}` : '',
      member.title ? `TITLE:${member.title}` : `TITLE:${member.role}`,
      member.organization ? `ORG:${member.organization}` : 'ORG:The ATL Homemaker',
      member.email ? `EMAIL;type=WORK:${member.email}` : '',
      member.phone ? `TEL;type=WORK:${member.phone}` : '',
      member.url ? `URL:${member.url}` : '',
      `CALURI:${calUri}`,
      `CATEGORIES:${categories}`,
      `FBURL:${fbUrl}`,
      `LOGO:${logo}`,
      'MAILER:gmail',
      `ROLE:${member.position || member.role}`,
      member.note ? `NOTE:${member.note}` : '',
      member.image ? `PHOTO;VALUE=URI:${member.image}` : '',
      member.startDate ? `REV:${new Date(member.startDate).toISOString()}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\r\n');

    // Set response headers
    res.setHeader('Content-Type', 'text/vcard');
    res.setHeader('Content-Disposition', `attachment; filename="${slugify(member.name)}.vcf"`);
    
    // Send the vCard
    res.send(vCard);
  } catch (error) {
    console.error('Error generating vCard:', error);
    res.status(500).send('Error generating vCard');
  }
});

// QR Code endpoint
app.get('/team/:role/qr', async (req, res) => {
  try {
    const { role } = req.params;
    const baseUrl = process.env.VITE_BASE_URL;
    const vcfUrl = `${baseUrl}/team/${role}/vcf`;
    
    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(vcfUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'image/png');
    
    // Convert data URL to buffer and send
    const qrBuffer = Buffer.from(qrCode.split(',')[1], 'base64');
    res.send(qrBuffer);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).send('Error generating QR code');
  }
});

// Email action endpoint
app.get('/email-action/:action', async (req, res) => {
  try {
    const { action } = req.params;
    const { id } = req.query;

    if (!id) {
      return res.status(400).send('User ID is required');
    }

    // Get visitor data
    const filePath = join(__dirname, '..', 'components', 'adminView', 'visitors', 'visitors.json');
    const fileData = await readFile(filePath, 'utf8');
    const visitors = JSON.parse(fileData);
    const visitorData = visitors[id];

    if (!visitorData) {
      return res.status(404).send('Visitor not found');
    }

    // Handle different actions
    switch (action) {
      case 'schedule':
        res.redirect(`/make-appointment?id=${id}`);
        break;
      case 'design':
      case 'budget':
        res.redirect(`/portal?id=${id}&view=${action}`);
        break;
      default:
        res.status(400).send('Invalid action');
    }
  } catch (error) {
    console.error('Error handling email action:', error);
    res.status(500).send('Internal server error');
  }
});

// Add route to get visitor data
app.get('/get-visitor/:id', async (req, res) => {
  try {
    const filePath = join(__dirname, '..', 'components', 'adminView', 'visitors', 'visitors.json');
    const fileData = await readFile(filePath, 'utf8');
    const visitors = JSON.parse(fileData);
    const visitorData = visitors[req.params.id] || null;
    res.json(visitorData);
  } catch (error) {
    console.error('Error getting visitor data:', error);
    res.status(500).json({ message: 'Failed to get visitor data' });
  }
});

// Existing routes...
app.post('/submit-form', processFormData);
app.post('/update-calculator-setting', updateCalculatorSetting);
app.post('/update-category-setting', updateCategorySetting);
app.post('/update-item', updateItem);
app.post('/add-visitor', updateVisitor);
app.post('/send-email', sendEmail);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});