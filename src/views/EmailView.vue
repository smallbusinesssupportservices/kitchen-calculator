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
          <input type="text" v-model="templateData.userId" placeholder="User ID" required />
          <select v-model="templateData.buttonType" required>
            <option value="">Select Button Type</option>
            <option value="schedule">Schedule</option>
            <option value="design">Design</option>
            <option value="budget">Budget</option>
          </select>
          <input type="text" v-model="templateData.lowRange" placeholder="Low Range" required />
          <input type="text" v-model="templateData.highRange" placeholder="High Range" required />
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

const from = ref('');
const to = ref('');
const subject = ref('Kitchen Estimate from 7 Day Kitchens');
const templateData = ref({
  userId: '',
  buttonType: '',
  lowRange: '',
  highRange: ''
});

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
  const baseUrl = window.location.origin;
  
  processed = processed.replace('[LOW_RANGE]', formatCurrency(templateData.value.lowRange));
  processed = processed.replace('[HIGH_RANGE]', formatCurrency(templateData.value.highRange));
  processed = processed.replace(/\[BASE_URL\]/g, baseUrl);
  processed = processed.replace(/\[USER_ID\]/g, templateData.value.userId);
  
  return processed;
});

function formatCurrency(value) {
  if (!value) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

const sendEmail = async () => {
  try {
    await axios.post('http://localhost:3000/send-email', {
      from: from.value,
      to: to.value,
      subject: subject.value,
      templateData: templateData.value
    });
    
    alert('Test email sent successfully!');
    
    // Clear form
    to.value = '';
    templateData.value = {
      userId: '',
      buttonType: '',
      lowRange: '',
      highRange: ''
    };
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