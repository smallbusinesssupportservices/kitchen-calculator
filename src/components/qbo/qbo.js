import { getOAuthClient, setOAuthClient, initializeOAuthClient } from './oauthClientManager.js';
import OAuthClient from 'intuit-oauth';

export const authUri = (req, res) => {
    const jsonBody = JSON.parse(req.query.json);

    const oauthClient = initializeOAuthClient({
        clientId: jsonBody.clientId,
        clientSecret: jsonBody.clientSecret,
        environment: jsonBody.environment,
        redirectUri: jsonBody.redirectUri,
    });

    const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting],
        state: 'intuit-test',
    });
    res.send(authUri);
};

export const callback = async (req, res) => {
    try {
        const oauthClient = getOAuthClient();
        const authResponse = await oauthClient.createToken(req.url);
        setOAuthClient(oauthClient); // Update `oauthClient` with tokens
        res.send('Token created successfully');
    } catch (e) {
        console.error('Error creating token:', e);
        res.status(500).send('Failed to create token');
    }
};

export const refreshAccessToken = async (req, res) => {
    try {
        const oauthClient = getOAuthClient();
        const authResponse = await oauthClient.refresh();
        setOAuthClient(oauthClient); // Update `oauthClient` with refreshed tokens
        res.send(authResponse.json);
    } catch (e) {
        console.error('Error refreshing token:', e);
        res.status(500).send('Failed to refresh access token');
    }
};

export const companyInfo = async (req, res) => {
    try {
        const oauthClient = getOAuthClient();
        const companyID = oauthClient.getToken().realmId;
        const url =
            oauthClient.environment === 'sandbox'
                ? OAuthClient.environment.sandbox
                : OAuthClient.environment.production;

        const authResponse = await oauthClient.makeApiCall({
            url: `${url}v3/company/${companyID}/companyinfo/${companyID}`,
        });

        console.log(`\n The response for API call is: ${JSON.stringify(authResponse.json)}`);
        res.send(authResponse.json);
    } catch (e) {
        console.error('Error retrieving company info:', e);
        res.status(500).send('Failed to retrieve company info');
    }
};

export const disconnect = (req, res) => {
    try {
        const oauthClient = getOAuthClient();
        const authUri = oauthClient.authorizeUri({
            scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
            state: 'intuit-test',
        });
        res.redirect(authUri);
    } catch (e) {
        console.error('Error during disconnect:', e);
        res.status(500).send('Failed to disconnect');
    }
};


// import OAuthClient from 'intuit-oauth';
// import { writeFile } from 'fs/promises';
// import { join } from 'path';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';


// /**
//  * App Variables
//  * @type {null}
//  */
// let oauth2_token_json = null;

// /**
//  * Instantiate new Client
//  * @type {OAuthClient}
//  */

// let oauthClient = null;

// export const showToken = (req, res) => {
//     res.send(oauth2_token_json);
// }

// export const authUri = (req, res) => {
//     console.log('/authUri: >', req.query.json.clientId)
//     const jsonBody = JSON.parse(req.query.json);

//     oauthClient = new OAuthClient({
//         clientId: jsonBody.clientId,
//         clientSecret: jsonBody.clientSecret,
//         environment: jsonBody.environment,
//         redirectUri: jsonBody.redirectUri,
//     });
//     console.log("oauthClient: ", oauthClient)

//     const authUri = oauthClient.authorizeUri({
//         scope: [OAuthClient.scopes.Accounting],
//         state: 'intuit-test',
//     });

//     res.send(authUri);
// }

// export const callback = (req, res) => {
//     oauthClient
//         .createToken(req.url)
//         .then(function (authResponse) {
//             oauth2_token_json = JSON.stringify(authResponse.json, null, 2);
//             storeToken(authResponse.json) 
//         })
//         .catch(function (e) {
//             console.error(e);
//         });

//     res.send('');
// }

// export const refreshAccessToken = (req, res) => {
//     oauthClient
//         .refresh()
//         .then(function (authResponse) {
//             console.log(`\n The Refresh Token is  ${JSON.stringify(authResponse.json)}`);
//             oauth2_token_json = JSON.stringify(authResponse.json, null, 2);
//             storeToken(authResponse.json) 
//             res.send(oauth2_token_json);
//         })
//         .catch(function (e) {
//             console.error(e);
//         });
// }

// export const disconnect = (req, res) => {
//     console.log('The disconnect called ');
//     const authUri = oauthClient.authorizeUri({
//         scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
//         state: 'intuit-test',
//     });
//     res.redirect(authUri);
// }

// export const companyInfo = (req, res) => {
//     const companyID = oauthClient.getToken().realmId;

//     const url =
//         oauthClient.environment == 'sandbox'
//             ? OAuthClient.environment.sandbox
//             : OAuthClient.environment.production;

//     oauthClient
//         .makeApiCall({ url: `${url}v3/company/${companyID}/companyinfo/${companyID}` })
//         .then(function (authResponse) {
//             console.log(`\n The response for API call is :${JSON.stringify(authResponse.json)}`);
//             res.send(authResponse.json);
//         })
//         .catch(function (e) {
//             console.error(e);
//         });
// }


// async function storeToken(token) {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = dirname(__filename);

//     // Path to the JSON file
//     const filePath = join(__dirname, 'token.json');

//     try {
//         // Write the updated settings to the JSON file
//         await writeFile(filePath, JSON.stringify(token, null, 2));
//         res.status(200).json({ message: 'Settings saved successfully' });
//     } catch (err) {
//         console.error('Error writing to file:', err);
//         res.status(500).json({ message: 'Failed to save settings' });
//     }
// }