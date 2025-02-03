# Kitchen Calculator

A Vue.js application for calculating kitchen remodel estimates with QuickBooks Online integration.

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

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
```

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

## Technologies Used

- Vue.js 3
- Vite
- Express.js
- Node.js
- QuickBooks Online API
- Nodemailer
- PDF-lib