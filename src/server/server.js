import express from 'express';
import cors from 'cors';
import { processFormData } from './formHandler.js';
import { sendEmail } from './sendEmail.js';
import { updateCalculatorSetting } from '../components/adminView/calculator/updateCalculatorSettings.js'
import { updateCategorySetting } from '../components/adminView/categories/updateCategorySetting.js'
import { updateItem } from '../components/adminView/items/updateItem.js'
import { updateVisitor } from '../components/adminView/visitors/updateVisitor.js'
import { callback, authUri, refreshAccessToken, disconnect, companyInfo, showToken } from '../components/qbo/qbo.js'
const app = express();
const PORT = 3000;

// Middleware to handle JSON requests and CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//QBO
app.get('/authUri', authUri);
app.get('/callback', callback);
app.get('/retrieveToken', showToken);
app.get('/refreshAccessToken', refreshAccessToken);
app.get('/getCompanyInfo', companyInfo);
app.get('/disconnect', disconnect);

//calculator
app.post('/submit-form', processFormData);

//admin
app.post('/update-calculator-setting', updateCalculatorSetting);
app.post('/update-category-setting', updateCategorySetting);
app.post('/update-item', updateItem);
app.post('/add-visitor', updateVisitor);

//gmail
app.post('/send-email', sendEmail);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});