import express from 'express';
import cors from 'cors';
import { processFormData } from './formHandler.js';
import { sendEmail } from './sendEmail.js';
import { updateCalculatorSetting } from '../components/adminView/calculator/updateCalculatorSettings.js'
import { updateCategorySetting } from '../components/adminView/categories/updateCategorySetting.js'
import { updateItem } from '../components/adminView/items/updateItem.js'
import { updateVisitor } from '../components/adminView/visitors/updateVisitor.js'
import bodyParser from 'body-parser';
import qboClient from './qbo.js';

const app = express();
const PORT = 3000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Middleware to handle JSON requests and CORS
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// QBO Routes
app.get('/authUri', urlencodedParser, function (req, res) {
  try {
    const data = JSON.parse(req.query.json);
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

app.get('/callback', async function (req, res) {
  try {
    // Construct full URL from request
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}${req.url}`;
    
    console.log('Received callback at URL:', fullUrl);
    
    const tokens = await qboClient.handleCallback(fullUrl);
    
    // Send HTML response that closes the popup
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'QBO_AUTH_SUCCESS', tokens: ${JSON.stringify(tokens)} }, '*');
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error in callback:', error);
    // Send HTML response with error
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'QBO_AUTH_ERROR', error: ${JSON.stringify(error.message)} }, '*');
            window.close();
          </script>
        </body>
      </html>
    `);
  }
});

app.get('/getCompanyInfo', async function (req, res) {
  try {
    const qbo = await qboClient.createQBClient();
    const companyInfo = await qboClient.getCompanyInfo(qbo.token.access_token, qbo.token.realmId);
    res.send(companyInfo);
  } catch (error) {
    console.error('Error getting company info:', error);
    res.status(500).send({
      status: 'Error',
      message: 'Error getting company info',
      error: error.message
    });
  }
});

app.get('/refreshAccessToken', async function (req, res) {
  try {
    const tokens = await qboClient.refreshTokens();
    res.send(tokens);
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).send({
      status: 'Error',
      message: 'Error refreshing token',
      error: error.message
    });
  }
});

// Calculator route
app.post('/submit-form', processFormData);

// Admin routes
app.post('/update-calculator-setting', updateCalculatorSetting);
app.post('/update-category-setting', updateCategorySetting);
app.post('/update-item', updateItem);
app.post('/add-visitor', updateVisitor);

// Gmail route
app.post('/send-email', sendEmail);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});