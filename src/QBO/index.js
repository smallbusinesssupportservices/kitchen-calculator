const QuickBooks = require('node-quickbooks');
const util = require('util');
const oauth2Lib = require('simple-oauth2');

// OAuth 2.0 Configuration
const oauth2 = oauth2Lib.create({
  client: {
    id: 'YOUR_CLIENT_ID',
    secret: 'YOUR_CLIENT_SECRET',
  },
  auth: {
    tokenHost: 'https://oauth.platform.intuit.com',
    authorizePath: '/oauth2/v1/authorize',
    tokenPath: '/oauth2/v1/tokens/bearer',
  },
});

// Function to refresh access token
async function refreshAccessToken(refreshToken) {
  const tokenObject = oauth2.accessToken.create({ refresh_token: refreshToken });

  try {
    const result = await tokenObject.refresh();
    console.log('Token refreshed:', result.token);
    // Update tokens in your storage (database, environment variables, etc.)
    return result.token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

// Initialize QuickBooks client
async function initializeQuickBooks() {
  // Assume you have stored these tokens securely
  let accessToken = 'YOUR_ACCESS_TOKEN';
  let refreshToken = 'YOUR_REFRESH_TOKEN';
  const realmId = 'YOUR_REALM_ID';
  const useSandbox = true;

  // Refresh the access token if necessary
  // You might want to check token expiry before refreshing
  const token = await refreshAccessToken(refreshToken);
  accessToken = token.access_token;
  refreshToken = token.refresh_token;

  const qbo = new QuickBooks(
    'YOUR_CLIENT_ID',
    'YOUR_CLIENT_SECRET',
    accessToken,
    refreshToken,
    realmId,
    useSandbox,
    true, // Enable debugging
    null, // minorVersion
    '2.0', // OAuth version
    'HMAC-SHA1' // Signature method
  );

  return qbo;
}

// Define and create a new customer
async function createNewCustomer() {
  const qbo = await initializeQuickBooks();

  const newCustomer = {
    DisplayName: "John Doe",
    CompanyName: "Doe Enterprises",
    PrimaryEmailAddr: {
      Address: "john.doe@example.com"
    },
    PrimaryPhone: {
      FreeFormNumber: "(555) 555-5555"
    },
    BillAddr: {
      Line1: "123 Main Street",
      City: "Anytown",
      CountrySubDivisionCode: "CA",
      PostalCode: "12345"
    },
    Notes: "New customer from website sign-up."
  };

  // Promisify the createCustomer method
  const createCustomerAsync = util.promisify(qbo.createCustomer.bind(qbo));

  try {
    const customer = await createCustomerAsync(newCustomer);
    console.log('Customer created successfully:', customer);
  } catch (err) {
    console.error('Error creating customer:', err);
  }
}

// Execute the function
createNewCustomer();
