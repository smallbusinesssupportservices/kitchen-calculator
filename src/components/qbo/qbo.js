
import OAuthClient from 'intuit-oauth';

/**
 * App Variables
 * @type {null}
 */
let oauth2_token_json = null;

/**
 * Instantiate new Client
 * @type {OAuthClient}
 */

let oauthClient = null;

export const showToken = (req, res) =>{
    res.send(oauth2_token_json);
  }

export const authUri = (req, res) => {
    console.log('/authUri: >', req.query.json.clientId)
    const jsonBody = JSON.parse(req.query.json);
  
    oauthClient = new OAuthClient({
      clientId: jsonBody.clientId,
      clientSecret: jsonBody.clientSecret,
      environment: jsonBody.environment,
      redirectUri: jsonBody.redirectUri,
    });
    console.log("oauthClient: ", oauthClient)
  
    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.Accounting],
      state: 'intuit-test',
    });
    console.log("authUri: ", authUri)
    res.send(authUri);
  }

export const callback  = (req, res) => {
    oauthClient
      .createToken(req.url)
      .then(function (authResponse) {
        oauth2_token_json = JSON.stringify(authResponse.json, null, 2);
      })
      .catch(function (e) {
        console.error(e);
      });
  
    res.send('');
  }

  export const refreshAccessToken =  (req, res) => {
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
  }

export const disconnect = (req, res) => {
    console.log('The disconnect called ');
    const authUri = oauthClient.authorizeUri({
      scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
      state: 'intuit-test',
    });
    res.redirect(authUri);
  }

  export const companyInfo = (req, res) => {
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
  }