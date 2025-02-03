import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Function to send customer data to Hatch
export const sendToHatch = async (customer) => {
    try {
        const response = await axios.post(process.env.HATCH_WEBHOOK_URL, {
            ...customer,
            source: 'QuickBooks Online',
            timestamp: new Date().toISOString()
        });

        console.log('Successfully sent to Hatch:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending to Hatch:', error);
        throw error;
    }
};


// Test function to verify webhook
async function  testHatchWebhook () {
  console.log ("testing Hatch webhook");
    // Test object for development/testing
    const testCustomer = {
        DisplayName: "John Smith",
        PrimaryEmailAddr: {
            Address: "john.smith@example.com"
        },
        PrimaryPhone: {
            FreeFormNumber: "(555) 123-4567"
        },
        BillAddr: {
            Line1: "123 Main Street",
            City: "Atlanta",
            CountrySubDivisionCode: "GA",
            PostalCode: "30301"
        },
        Notes: "Kitchen remodel project - Initial estimate request",
        estimate: {
            lowRange: 25000,
            highRange: 35000
        }
    };
    try {
        const result = await sendToHatch(testCustomer);
        console.log('Test webhook successful:', result);
        return result;
    } catch (error) {
        console.error('Test webhook failed:', error);
        throw error;
    }
};


