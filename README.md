# Kitchen Calculator

A Vue.js application for calculating kitchen remodel estimates with QuickBooks Online integration.

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)
- A Google Workspace account with admin privileges
- A QuickBooks Online account

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:
```env
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_gmail_app_password
QBO_CLIENT_ID=your_quickbooks_client_id
QBO_CLIENT_SECRET=your_quickbooks_client_secret
QBO_ENVIROMENT=Sandbox
QBO_REDIRECT_URI=http://localhost:3000/callback
HATCH_WEBHOOK_URL=your_hatch_webhook_url
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_service_account_private_key
GOOGLE_CLIENT_ID=your_oauth_client_id
GOOGLE_DOMAIN=your_domain.com
GOOGLE_ADMIN_EMAIL=admin@your_domain.com
VITE_GOOGLE_CLIENT_ID=your_oauth_client_id
JWT_SECRET=your_jwt_secret_key
```

## Google Cloud Project Setup

1. Create a new project in Google Cloud Console:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Click "New Project"
   - Enter a project name and select an organization
   - Click "Create"

2. Enable required APIs:
   - Navigate to "APIs & Services" > "Library"
   - Search for and enable:
     - Admin SDK API

3. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click [Create Service Account](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?supportedpurview=project)
   - Enter a name and description
   - Grant the following roles:
     - Service Directory Admin
   - Click "Done"
   - Click the created service account
   - Go to "Keys" tab
   - Add a new JSON key
   - Save the downloaded JSON file securely

4. Create OAuth 2.0 Client ID for Sign-in with Google:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost`
   - Add authorized redirect URIs:
     - `http://localhost:5173`
     - `http://localhost:3000`
     - `http://localhost:3000/auth/google/callback`
   - Save the Client ID and Client Secret

## Google Workspace Admin Console Setup

1. Configure Domain-wide Delegation:
   - Go to [Google Workspace Admin Console](https://admin.google.com)
   - Navigate to Security > Access and data control > API Controls
   - Click [Manage Domain Wide Delegation](https://admin.google.com/ac/owl/domainwidedelegation?hl=en)
   - Click "Add new"
   - Enter the Service Account's Client ID (from the JSON key)
   - Add the following OAuth scopes:
     ```
     https://www.googleapis.com/auth/admin.directory.user.readonly
     https://www.googleapis.com/auth/admin.directory.group.readonly
     https://www.googleapis.com/auth/admin.directory.orgunit.readonly
     ```
   - For brouder scopes:
     ```
     https://www.googleapis.com/auth/admin.directory.user
     https://www.googleapis.com/auth/admin.directory.group
     https://www.googleapis.com/auth/admin.directory.orgunit
     ```

2. Configure Custom Schema (Optional):
   - In Admin Console, go to Directory > Users > More Options > Manage Custom Attributes
   - Create a new schema called "employeeInfo" with fields:
     - bio (Text, Multi-value: No)
     - extendedBio (Text, Multi-value: No)
     - expertise (Text, Multi-value: Yes)
     - startDate (Date, Multi-value: No)
     - nickname (Text, Multi-value: No)
     - note (Text, Multi-value: No)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd kitchen-calculator
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

The application requires both a frontend development server and a backend server to run simultaneously.

1. Start the backend server:
```bash
npm run server
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

- `/src` - Main source code directory
  - `/components` - Vue components
  - `/views` - Vue router views
  - `/server` - Backend server code
  - `/assets` - Static assets
  - `/email-templates` - Email template files

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start the backend server

## Features

- Kitchen remodel cost estimation
- QuickBooks Online integration
- Email notifications
- PDF estimate generation
- Admin dashboard for settings management
- Responsive design
- Google Workspace integration
- Team member management
- Custom user fields

## Technologies Used

- Vue.js 3
- Vite
- Express.js
- Node.js
- QuickBooks Online API
- Nodemailer
- PDF-lib
- Google Admin SDK
- Google OAuth 2.0