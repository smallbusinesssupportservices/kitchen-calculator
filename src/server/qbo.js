import OAuthClient from 'intuit-oauth';
import QuickBooks from 'node-quickbooks';
import dotenv from 'dotenv';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

class QBOClient {
  constructor() {
    this.oauthClient = new OAuthClient({
      clientId: process.env.QBO_CLIENT_ID,
      clientSecret: process.env.QBO_CLIENT_SECRET,
      environment: process.env.QBO_ENVIRONMENT || 'sandbox',
      redirectUri: process.env.QBO_REDIRECT_URI,
      logging: true
    });
  }

  async loadTokenFromFile() {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const tokenPath = path.join(__dirname, '..', 'components', 'qbo', 'token.json');
      
      try {
        const tokenData = JSON.parse(await readFile(tokenPath, 'utf8'));
        if (tokenData.token) {
          this.oauthClient.token = {
            ...tokenData.token,
            realmId: tokenData.token.realmId,
            access_token: tokenData.token.access_token,
            refresh_token: tokenData.token.refresh_token,
            token_type: tokenData.token.token_type,
            expires_in: tokenData.token.expires_in,
            x_refresh_token_expires_in: tokenData.token.x_refresh_token_expires_in,
            id_token: tokenData.token.id_token,
            latency: tokenData.token.latency || 60000
          };
        }
        return tokenData;
      } catch (readError) {
        // If file doesn't exist or is empty, return default structure
        return {
          environment: process.env.QBO_ENVIRONMENT || 'sandbox',
          clientId: process.env.QBO_CLIENT_ID,
          clientSecret: process.env.QBO_CLIENT_SECRET,
          redirectUri: process.env.QBO_REDIRECT_URI,
          token: null,
          logging: true
        };
      }
    } catch (error) {
      console.error('Error loading token from file:', error);
      throw error;
    }
  }

  async saveTokenToFile(tokenData) {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const tokenPath = path.join(__dirname, '..', 'components', 'qbo', 'token.json');
      
      // Ensure we have the base structure
      const baseData = {
        environment: process.env.QBO_ENVIRONMENT || 'sandbox',
        clientId: process.env.QBO_CLIENT_ID,
        clientSecret: process.env.QBO_CLIENT_SECRET,
        redirectUri: process.env.QBO_REDIRECT_URI,
        logging: true
      };

      const dataToSave = {
        ...baseData,
        ...tokenData
      };

      await writeFile(tokenPath, JSON.stringify(dataToSave, null, 2));
      console.log('Token saved to file successfully');
    } catch (error) {
      console.error('Error saving token to file:', error);
      throw error;
    }
  }

  getAuthorizationUrl(state) {
    try {
      return this.oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting],
        state: state
      });
    } catch (error) {
      console.error('Error generating QBO auth URL:', error);
      throw error;
    }
  }

  async handleCallback(url) {
    try {
      const urlObj = new URL(url, process.env.QBO_REDIRECT_URI);
      const fullUrl = urlObj.toString();
      
      console.log('Processing callback URL:', fullUrl);
      
      const authResponse = await this.oauthClient.createToken(fullUrl);
      
      const token = {
        realmId: authResponse.token.realmId,
        token_type: authResponse.token.token_type,
        access_token: authResponse.token.access_token,
        refresh_token: authResponse.token.refresh_token,
        expires_in: authResponse.token.expires_in,
        x_refresh_token_expires_in: authResponse.token.x_refresh_token_expires_in,
        id_token: authResponse.token.id_token || '',
        latency: 60000,
        createdAt: Date.now()
      };

      // Save the token with the base structure
      await this.saveTokenToFile({ token });
      
      console.log('Token saved successfully');
      return token;
    } catch (error) {
      console.error('Error in handleCallback:', error);
      throw error;
    }
  }

  async createQBClient() {
    try {
      let token = await this.loadTokenFromFile();
      console.log("** this.oauthClient ** ", this.oauthClient)

      // if (!this.oauthClient.isAccessTokenValid()) {
      //   console.log('Access token expired, refreshing...');
      //   await this.refreshTokens();
      // }
      console.log("********",new Date().getTime() > (this.oauthClient.token.createdAt + this.oauthClient.token.expires_in))

      if(new Date().getTime() > (this.oauthClient.token.createdAt + this.oauthClient.token.expires_in)){
        token = await this.refreshTokens();
       
      }

      const client = new QuickBooks(
        token.clientId, 
        token.clientSecret, 
        token.token.access_token, 
        false,
        token.token.realmId, 
        token.environment, 
        true,
        null,
        '2.0',
        token.token.refresh_token 
      );

      return client

    } catch (error) {
      console.error('Error creating QB client:', error);
      throw error;
    }
  }

  async refreshTokens() {
    try {
      console.log('Refreshing tokens...');
      const authResponse = await this.oauthClient.refresh();
      const tokenData = await this.loadTokenFromFile();
      
      const token = {
        realmId: authResponse.token.realmId,
        token_type: authResponse.token.token_type,
        access_token: authResponse.token.access_token,
        refresh_token: authResponse.token.refresh_token,
        expires_in: authResponse.token.expires_in,
        x_refresh_token_expires_in: authResponse.token.x_refresh_token_expires_in,
        id_token: authResponse.token.id_token || '',
        latency: 60000,
        createdAt: Date.now()
      };
      
      const updatedData = {
        ...tokenData,
        token
      };
      
      await this.saveTokenToFile(updatedData);
      console.log('Tokens refreshed successfully');
      return token;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw error;
    }
  }

  async findCustomerByEmail(email) {
    try {
      const qbo = await this.createQBClient();
      // TODO check for token valid
      return new Promise((resolve, reject) => {
        qbo.findCustomers([
          { field: 'PrimaryEmailAddr', value: email }
        ], (err, result) => {
          if (err) {
            console.error('Error finding customer:', err);
            reject(err);
            return;
          }
          console.log('Customer search result:', result);
          resolve(result.QueryResponse?.Customer?.[0] || null);
        });
      });
    } catch (error) {
      console.error('Error in findCustomerByEmail:', error);
      throw error;
    }
  }

  async createCustomer(customerData) {
    try {
      const qbo = await this.createQBClient();
      return new Promise((resolve, reject) => {
        qbo.createCustomer(customerData, (err, customer) => {
          if (err) {
            console.error('Error creating customer:', err);
            reject(err);
            return;
          }
          console.log('Customer created:', customer);
          resolve(customer);
        });
      });
    } catch (error) {
      console.error('Error in createCustomer:', error);
      throw error;
    }
  }

  async createEstimate(estimateData) {
    try {
      const qbo = await this.createQBClient();
      return new Promise((resolve, reject) => {
        qbo.createEstimate(estimateData, (err, estimate) => {
          if (err) {
            console.error('Error creating estimate:', err);
            reject(err);
            return;
          }
          console.log('Estimate created:', estimate);
          resolve(estimate);
        });
      });
    } catch (error) {
      console.error('Error in createEstimate:', error);
      throw error;
    }
  }

  async getEstimatePdf(estimateId) {
    try {
      const qbo = await this.createQBClient();
      return new Promise((resolve, reject) => {
        qbo.getEstimatePdf(estimateId, (err, pdf) => {
          if (err) {
            console.error('Error getting estimate PDF:', err);
            reject(err);
            return;
          }
          resolve(pdf);
        });
      });
    } catch (error) {
      console.error('Error in getEstimatePdf:', error);
      throw error;
    }
  }
}

export default new QBOClient();