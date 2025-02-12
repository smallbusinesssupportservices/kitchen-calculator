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
        if (tokenData?.token) {
          // console.log('Loading token from file:', tokenData.token);
          this.oauthClient.token = tokenData.token;
          this.oauthClient.setToken(tokenData.token);
        }
        return tokenData;
      } catch (readError) {
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
      
      const baseData = {
        environment: process.env.QBO_ENVIRONMENT || 'sandbox',
        clientId: process.env.QBO_CLIENT_ID,
        clientSecret: process.env.QBO_CLIENT_SECRET,
        redirectUri: process.env.QBO_REDIRECT_URI,
        logging: true
      };

      await writeFile(
        tokenPath, 
        JSON.stringify({ ...baseData, token: tokenData.token }, null, 2)
      );
      console.log('Token saved to file successfully');
    } catch (error) {
      console.error('Error saving token to file:', error);
      throw error;
    }
  }

  getAuthorizationUrl(state) {
    try {
      return this.oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.Payment, OAuthClient.scopes.OpenId],
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
      console.log('Auth response received');
      
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

      console.log('Setting new token');
      this.oauthClient.setToken(token);
      await this.saveTokenToFile({ token });
      
      return token;
    } catch (error) {
      console.error('Error in handleCallback:', error);
      throw error;
    }
  }

  async createQBClient() {
    try {
      await this.loadTokenFromFile();
      
      console.log('Checking token validity...');
      const token = this.oauthClient.getToken();

      if (!this.oauthClient.isAccessTokenValid()) {
        console.log('Access token expired, refreshing...');
        await this.refreshTokens();
      }

      return new QuickBooks(
        process.env.QBO_CLIENT_ID,
        process.env.QBO_CLIENT_SECRET,
        this.oauthClient.getToken().access_token,
        false,
        this.oauthClient.getToken().realmId,
        (process.env.QBO_ENVIRONMENT === 'sandbox' ? false : true),
        true,
        null,
        '2.0',
        this.oauthClient.getToken().refresh_token
      );
    } catch (error) {
      console.error('Error creating QB client:', error);
      throw error;
    }
  }

  async refreshTokens() {
    try {
      console.log('Refreshing tokens...');
      const authResponse = await this.oauthClient.refresh();
      console.log('Refresh response received:', authResponse);
      
      // Construct the full token object
      const token = {
        realmId: this.oauthClient.getToken().realmId,
        token_type: authResponse.token_type,
        access_token: authResponse.access_token,
        refresh_token: authResponse.refresh_token,
        expires_in: authResponse.expires_in,
        x_refresh_token_expires_in: authResponse.x_refresh_token_expires_in,
        id_token: authResponse.id_token || '',
        latency: 60000,
        createdAt: Date.now()
      };
      
      console.log('Setting refreshed token');
      this.oauthClient.setToken(token);
      await this.saveTokenToFile({ token });
      
      return token;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      throw error;
    }
  }

  async findCustomerByEmail(email) {
    try {
      const qbo = await this.createQBClient();
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