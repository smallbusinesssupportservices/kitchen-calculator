<template>
  <div>
    <h3>Your Project Estimate</h3>

    <!-- Display the range of the estimate -->

    <p>Estimated Range: {{ formatCurrency(response.estimate.lowRange) }} - {{
      formatCurrency(response.estimate.highRange) }}</p>

    <!-- Display dynamic message about range changes -->
    <p class="range-change-info">
      The range shown may change based on certain selections, such as custom cabinet designs, countertop materials, or
      additional features like pot fillers and under-cabinet lighting.
    </p>

    <!-- Contact Info Fields -->
    <div class="contact-info">
      <label for="name">Contact Name:</label>
      <input v-model="contactName" type="text" id="name" placeholder="Enter your name" />

      <label for="phone">Phone Number:</label>
      <input v-model="contactPhone" type="text" id="phone" placeholder="Enter your phone number" />

      <label for="email">Email Address:</label>
      <input v-model="contactEmail" type="email" id="email" placeholder="Enter your email" />

      <label for="projectName">Project Name:</label>
      <input v-model="projectName" type="text" id="projectName" placeholder="Enter the project name" />

      <!-- Disclosure and Checkbox -->
      <div class="disclosure">
        <input v-model="communicationConsent" type="checkbox" id="consent" checked />
        <label for="consent">
          I understand that by providing my contact information, I may receive communications via SMS and email through
          web applications.
        </label>
      </div>

      <button @click="submitContactInfo">Submit</button>
    </div>

    <!-- Disclaimer section -->
    <p>
      <strong>Please note that this estimate represents the initial planning steps for your kitchen remodel. Some tasks
        still require a human touch, such as taking final measurements and conducting a preliminary jobsite
        inspection.</strong>
    </p>
    <p>
      <strong>we will not call unless you ask for a consultation.</strong>
      <strong> </strong>
    </p>
  </div>
</template>

<script setup>
//amout animation rolling over.
//placeholder 
// schedule a free consultation
// - google calendar appoinpment 
// - 
// compare 
// hybrid 
// calculation for name, email
//
import { ref } from 'vue';

// Define the props that this component will accept
const props = defineProps({
  response: {
    type: Object,
    required: true
  }
});

// State to store user-provided contact info
const contactName = ref('');
const contactPhone = ref('');
const contactEmail = ref('');
const projectName = ref('');
const communicationConsent = ref(true); // Checkbox checked by default

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// Method to handle contact info submission
const submitContactInfo = () => {
  if (!contactName.value || !contactPhone.value || !contactEmail.value || !projectName.value) {
    alert('Please fill out all contact fields before submitting.');
    return;
  }

  if (!communicationConsent.value) {
    alert('You must agree to receive communications via SMS and email.');
    return;
  }

  // You can send this contact info to the server or process it further here
  alert(`Thank you for providing your contact information:\n
      Name: ${contactName.value}\n
      Phone: ${contactPhone.value}\n
      Email: ${contactEmail.value}\n
      Project Name: ${projectName.value}`);
};
</script>

<style scoped>
h3 {
  color: #2a2a2a;
}

p {
  font-size: 1.1em;
}

.range-change-info {
  font-style: italic;
  color: #6c757d;
}

strong {
  font-weight: bold;
  font-size: 1.2em;
}

.contact-info {
  margin-top: 20px;
}

label {
  display: block;
  margin: 10px 0 5px;
}

input {
  padding: 8px;
  font-size: 1em;
  width: 100%;
  max-width: 400px;
  margin-bottom: 10px;
}

.disclosure {
  margin-top: 20px;
}

input[type="checkbox"] {
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>