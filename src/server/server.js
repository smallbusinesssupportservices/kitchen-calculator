import express from 'express';
import cors from 'cors';
import { processFormData } from './formHandler.js';
import { sendEmail } from './sendEmail.js';
import { updateCalculatorSetting } from '../components/adminView/calculator/updateCalculatorSettings.js'
import { updateCategorySetting } from '../components/adminView/categories/updateCategorySetting.js'
import { updateItem } from '../components/adminView/items/updateItem.js'
import { updateVisitor } from '../components/adminView/visitors/updateVisitor.js'
import bodyParser from 'body-parser';
import OAuthClient from 'intuit-oauth';
// import { callback, authUri, refreshAccessToken, disconnect, companyInfo, /*getCustomer*/ } from '../components/qbo/qbo.js'

const app = express();
const PORT = 3000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
let oauthClient = null;
let oauth2_token_json = null;

// Middleware to handle JSON requests and CORS
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//QBO
app.get('/authUri', urlencodedParser, function (req, res) {

  const data = JSON.parse(req.query.json)

oauthClient = new OAuthClient({
  clientId: data.clientId,
  clientSecret: data.clientSecret,
  environment: data.environment,
  redirectUri: data.redirectUri,
});

const authUri = oauthClient.authorizeUri({
  scope: [OAuthClient.scopes.Accounting],
  state: 'intuit-test',
});


res.send(authUri);
});

app.get('/test' ,(req ,res) => {
  res.send('hello world')
})

app.get('/callback', function (req, res) {
  console.log("callback")
oauthClient
  .createToken(req.url)
  .then(function (authResponse) {
    oauth2_token_json = JSON.stringify(authResponse.json, null, 2);
    console.log({oauthClient,oauth2_token_json})
  })
  .catch(function (e) {
    console.error(e);
  });

res.send({oauthClient,oauth2_token_json});
});

app.get('/retrieveToken', function (req, res) {
res.send(oauth2_token_json);
});

app.get('/refreshAccessToken', function (req, res) {
oauthClient
  .refresh()
  .then(function (authResponse) {
    console.log(`\n The Refresh Token is  ${JSON.stringify(authResponse.json)}`);
    oauth2_token_json = JSON.stringify(authResponse.json, null, 2);
    res.send(oauth2_token_json);
  })
  .catch(function (e) {
    console.error(e);
  });
});

app.get('/getCompanyInfo', function (req, res) {
const companyID = oauthClient.getToken().realmId;

const url =
  oauthClient.environment == 'sandbox'
    ? OAuthClient.environment.sandbox
    : OAuthClient.environment.production;

oauthClient
  .makeApiCall({ url: `${url}v3/company/${companyID}/companyinfo/${companyID}` })
  .then(function (authResponse) {
    console.log(`\n The response for API call is :${JSON.stringify(authResponse.json)}`);
    res.send(authResponse.json);
  })
  .catch(function (e) {
    console.error(e);
  });
});

app.get('/disconnect', function (req, res) {
console.log('The disconnect called ');
const authUri = oauthClient.authorizeUri({
  scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
  state: 'intuit-test',
});
res.redirect(authUri);
});

app.get('/getCustomer', function (req, res) {
  
  const companyID = oauthClient.getToken().realmId;
  
  const url =
    oauthClient.environment == 'sandbox'
      ? OAuthClient.environment.sandbox
      : OAuthClient.environment.production;
  
  oauthClient
    .makeApiCall({ url: `${url}v3/company/${companyID}/customer/${1}` })
    .then(function (authResponse) {
      console.log(`\n The response for API call is :${JSON.stringify(authResponse.json)}`);
      res.send(JSON.stringify(authResponse.json,null,2));
    })
    .catch(function (e) {
      console.error(e);
      
    });
  });

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