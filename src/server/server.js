import express from 'express';
import cors from 'cors';
import { processFormData } from './formHandler.js';
import { sendEmail } from './sendEmail.js';
import { updateCalculatorSetting } from '../components/adminView/calculator/updateCalculatorSettings.js';
import { updateCategorySetting } from '../components/adminView/categories/updateCategorySetting.js';
import { updateItem } from '../components/adminView/items/updateItem.js';
import { updateVisitor } from '../components/adminView/visitors/updateVisitor.js';
import { verifyGoogleToken } from './auth/googleAuth.js';
import teamMembers from '../data/teamMembers.json' with { type: 'json' };
import { googleDirectoryService } from './google/googleDirectoryService.js';
import helmet from 'helmet';
import { generateQR } from './generateQR.js'
import { vcard } from './vCard.js'

const app = express();
const PORT = 3000;

// Middleware

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your Vue app
  credentials: true, // Allow cookies and authorization headers if needed
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
}));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Fixes CORP issue
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Google Auth endpoint
app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const authResult = await verifyGoogleToken(token);
    res.json(authResult);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      authorized: false,
      message: 'Authentication failed'
    });
  }
});

app.get('/', (req, res) => res.status(200).json({"Message":"Hello world"}));

// Team members endpoints
app.get('/users', async (req, res) => {
  try {
    const users = await googleDirectoryService.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Failed to get users:', error);
    res.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: 'Failed to get users'
    });
  }
});

app.get('/groups', async (req, res) => {
  try {
    const groups = await googleDirectoryService.getGroups();
    res.json(groups);
  } catch (error) {
    console.error('Failed to get groups:', error);
    res.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: 'Failed to get groups'
    });
  }
});

app.get('/groups/:groupKey/members', async (req, res) => {
  try {
    const members = await googleDirectoryService.getGroupMembers(req.params.groupKey);
    res.json(members);
  } catch (error) {
    console.error(`Failed to get members for group ${req.params.groupKey}:`, error);
    res.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: `Failed to get members for group ${req.params.groupKey}`
    });
  }
});

app.get('/orgUnits', async (req, res) => {
  try {
    const OrgUnits = await googleDirectoryService.getOrgUnits();
    res.json(OrgUnits);
  } catch (error) {
    console.error('Failed to get users:', error);
    res.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: 'Failed to get users'
    });
  }
});

// vCard endpoint
app.get('/team/:role/vcf', vcard);
app.get('/team/:role/qr', generateQR);
app.post('/submit-form', processFormData);
app.post('/update-calculator-setting', updateCalculatorSetting);
app.post('/update-category-setting', updateCategorySetting);
app.post('/update-item', updateItem);
app.post('/add-visitor', updateVisitor);
app.post('/send-email', sendEmail);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});