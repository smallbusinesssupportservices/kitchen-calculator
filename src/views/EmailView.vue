<template>
  <div class="email-container">
    <div class="email-form-container">
      <form @submit.prevent="sendEmail" class="email-form">
        <h2>Test Email Settings</h2>
        <input type="email" v-model="from" placeholder="From" />
        <input type="text" v-model="to" placeholder="To" required />
        <input type="text" v-model="subject" placeholder="Subject" required />
        <div class="template-fields">
          <h3>Template Variables</h3>
          <input type="text" v-model="templateData.customerName" placeholder="Customer Name" required />
          <input type="text" v-model="templateData.lowRange" placeholder="Low Range" required />
          <input type="text" v-model="templateData.highRange" placeholder="High Range" required />
          <input type="text" v-model="templateData.scheduleUrl" placeholder="Schedule URL" required />
          <input type="text" v-model="templateData.feedbackUrl" placeholder="Feedback URL" required />
          <input type="text" v-model="templateData.address" placeholder="Address" required />
          <input type="text" v-model="templateData.phone" placeholder="Phone" required />
          <input type="text" v-model="templateData.email" placeholder="Contact Email" required />
        </div>
        <button type="submit">Send Test Email</button>
      </form>
    </div>

    <div class="template-preview">
      <h2>Email Preview</h2>
      <div class="preview-container" v-html="processedTemplate"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Form data
const from = ref('');
const to = ref('');
const subject = ref('Kitchen Estimate from 7 Day Kitchens');
const templateData = ref({
  customerName: '',
  lowRange: '',
  highRange: '',
  scheduleUrl: '',
  feedbackUrl: '',
  address: '',
  phone: '',
  email: ''
});

// Template storage
const emailTemplate = ref('');

// Load email template
onMounted(async () => {
  try {
    const response = await fetch('/src/email-templates/estimate.html');
    emailTemplate.value = await response.text();
  } catch (error) {
    console.error('Error loading email template:', error);
  }
});

// Process template with current values
const processedTemplate = computed(() => {
  if (!emailTemplate.value) return '';
  
  let processed = emailTemplate.value;
  processed = processed.replace('[Customer Name]', templateData.value.customerName || '[Customer Name]');
  processed = processed.replace('[Low Range]', templateData.value.lowRange || '[Low Range]');
  processed = processed.replace('[High Range]', templateData.value.highRange || '[High Range]');
  processed = processed.replace('[Schedule URL]', templateData.value.scheduleUrl || '#');
  processed = processed.replace('[Feedback URL]', templateData.value.feedbackUrl || '#');
  processed = processed.replace('[Address]', templateData.value.address || '[Address]');
  processed = processed.replace('[Phone Number]', templateData.value.phone || '[Phone Number]');
  processed = processed.replace('[Email]', templateData.value.email || '[Email]');
  
  return processed;
});

// Send email function
const sendEmail = async () => {
  try {
    // Create a plain text version of the email
    const plainText = `
      Kitchen Estimate from 7 Day Kitchens
      
      Dear ${templateData.value.customerName},
      
      Thank you for using our kitchen remodel estimator. We're excited to help you transform your kitchen into the space of your dreams!
      
      Your Estimate Range: $${templateData.value.lowRange} - $${templateData.value.highRange}
      
      To schedule a consultation, visit: ${templateData.value.scheduleUrl}
      
      Contact us:
      Address: ${templateData.value.address}
      Phone: ${templateData.value.phone}
      Email: ${templateData.value.email}
      
      This estimate is valid for 30 days from the date of this email.
    `;

    await axios.post('http://localhost:3000/send-email', {
      from: from.value,
      to: to.value,
      subject: subject.value,
      text: plainText,
      html: processedTemplate.value
    });
    
    // Clear form after successful send
    to.value = '';
    templateData.value = {
      customerName: '',
      lowRange: '',
      highRange: '',
      scheduleUrl: '',
      feedbackUrl: '',
      address: '',
      phone: '',
      email: ''
    };
    
    alert('Test email sent successfully!');
  } catch (error) {
    console.error('Failed to send email:', error);
    alert('Failed to send email. Please check the console for details.');
  }
};
</script>

<style scoped>
.email-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

.email-form-container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.email-form h2 {
  margin-bottom: 1rem;
  color: #2d3748;
}

.template-fields {
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
  margin-top: 1rem;
}

.template-fields h3 {
  margin-bottom: 1rem;
  color: #4a5568;
  font-size: 1.1rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #1d4ed8;
}

.template-preview {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.template-preview h2 {
  margin-bottom: 1rem;
  color: #2d3748;
}

.preview-container {
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 1rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* Make the preview container scrollable */
.preview-container {
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 1rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* Responsive design */
@media (max-width: 1024px) {
  .email-container {
    grid-template-columns: 1fr;
  }
  
  .email-form-container,
  .template-preview {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>