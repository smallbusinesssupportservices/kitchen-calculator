import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import helmet from 'helmet';
import { processFormData } from './formHandler.js';
import { sendEmail } from './sendEmail.js';
import { updateCalculatorSetting } from '../components/adminView/calculator/updateCalculatorSettings.js';
import { updateCategorySetting } from '../components/adminView/categories/updateCategorySetting.js';
import { updateItem } from '../components/adminView/items/updateItem.js';
import { generateQR } from './generateQR.js'
import { vcard } from './vCard.js'
import { orgUnits, members, groups, users, signInWithGoogle } from './google.js'
import { getVisitor, updateVisitor } from './service/visitor.js';
import { qboAuth } from './service/qbo.js'

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64'); // Generate unique nonce
  next();
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`], 
        styleSrc: ["'self'", "'unsafe-inline'"], 
        imgSrc: ["'self'", "data:"], 
        connectSrc: ["'self'", "http://localhost:5173"], 
        frameAncestors: ["'self'"], 
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }, 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.status(200).json({ "Message": "Hello world" }));

app.get('/users', users);
app.get('/groups', groups);
app.get('/groups/:groupKey/members', members);
app.get('/orgUnits', orgUnits);
app.get('/team/:role/vcf', vcard);
app.get('/team/:role/qr', generateQR);
app.get('/callback', qboAuth);
app.get('/get-visitor/:id', getVisitor);
app.post('/submit-form', processFormData);
app.post('/auth/google', signInWithGoogle);
app.post('/update-calculator-setting', updateCalculatorSetting);
app.post('/update-category-setting', updateCategorySetting);
app.post('/update-item', updateItem);
app.post('/add-visitor', updateVisitor);
app.post('/send-email', sendEmail);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});