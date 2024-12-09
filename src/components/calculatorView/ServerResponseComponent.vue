<template>
  <div>
    <h3>
      Your Project Estimate {{ formatCurrency(response.estimate.lowRange) }} - {{
        formatCurrency(response.estimate.highRange) }}
    </h3>

    <!-- Disclaimer section -->
    <p>
      <strong>
        This kitchen renovation cost calculator provided by 7 Day Kitchen is intended to give a general estimate based on the information you provide. The actual cost of your renovation will vary depending on factors such as the complexity of the renovation, the ease of access to any plumbing and electrical systems being relocated, the specific kitchen layout, materials and accessories chosen, and any unique aspects of your kitchen. While we strive for accuracy, please note that this tool is for informational purposes only and does not constitute a final quote or guarantee. For a more precise estimate, we recommend scheduling a consultation with our team to assess your kitchen's unique requirements and preferences.
      </strong>
    </p>

    <br>
    <div class="call-to-action"> 
      <button @click="scheduleAppointment" class="cta-button schedule">
        Schedule an Appointment
      </button>
      <button @click="handleUnexpected" class="cta-button unexpected">
        Not What I Was Expecting
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter from vue-router

// Define the props that this component will accept
const props = defineProps({
  response: {
    type: Object,
    required: true
  }
});

// Initialize the router
const router = useRouter();

// Helper function to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

// Define the scheduleAppointment method
const scheduleAppointment = () => {
  router.push('/make-appointment'); // Navigate to the make-appointment route
};

// (Optional) Define the handleUnexpected method
const handleUnexpected = () => {
  // Implement your logic here
  // For example, navigate to a feedback form or display a message
  alert('We\'re sorry to hear that. Please contact us for assistance.');
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
  margin-right: 10px; /* Added spacing between buttons */
}

button:hover {
  background-color: #0056b3;
}

.call-to-action {
  display: flex;
  gap: 10px; /* Add space between buttons */
}
</style>
