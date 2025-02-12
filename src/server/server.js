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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// QBO routes...
app.get('/authUri', function (req, res) {
  try {
    const authUri = qboClient.getAuthorizationUrl('intuit-test');
    res.send(authUri);
  } catch (error) {
    console.error('Error in authUri:', error);
    res.status(500).send({
      status: 'Error',
      message: 'Error generating auth URI',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});