import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { processFormData } from './formHandler.js';
import { sendEmail } from './sendEmail.js';

const app = express();
const PORT = 3000;

// Middleware to handle JSON requests and CORS
app.use(cors());
app.use(bodyParser.json());

app.post('/submit-form', processFormData);
app.post('/send-email', sendEmail);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});