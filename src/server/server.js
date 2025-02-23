import express from 'express';
import cors from 'cors';
import { processFormData } from './formHandler.js';
import { sendEmail } from './sendEmail.js';
import { updateCalculatorSetting } from '../components/adminView/calculator/updateCalculatorSettings.js';
import { updateCategorySetting } from '../components/adminView/categories/updateCategorySetting.js';
import { updateItem } from '../components/adminView/items/updateItem.js';
import { updateVisitor } from '../components/adminView/visitors/updateVisitor.js';
import helmet from 'helmet';
import { generateQR } from './generateQR.js'
import { vcard } from './vCard.js'
import { orgUnits, members, groups, users, signInWithGoogle } from './google.js'

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


app.get('/', (req, res) => res.status(200).json({"Message":"Hello world"}));

app.post('/auth/google', signInWithGoogle);
app.get('/users', users);
app.get('/groups', groups);
app.get('/groups/:groupKey/members', members);
app.get('/orgUnits', orgUnits);
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