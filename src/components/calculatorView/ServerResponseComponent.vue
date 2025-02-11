<template>
  <div class="container">
    <div class="content">
      <div class="estimate-box text-center">
        <h2>Your Estimate Range</h2>
        <p>Based on your selections, here's your estimated price range:</p>
        <h3 class="estimate-amount">{{ formatCurrency(response.estimate.lowRange) }} - {{
          formatCurrency(response.estimate.highRange) }}</h3>
        <p><small>*This estimate is based on the specifications you provided and may vary based on final design choices
            and site conditions.</small></p>
      </div>

      <p><strong>Ready to take the next step?</strong></p>

      <p class="text-center">Schedule a free consultation with one of our kitchen design experts to discuss your project
        in detail.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#schedule" class="button primary-button" @click="handleButtonClick('schedule')">Start Your Kitchen
          Transformation Now!</a>
      </div>

      <p class="text-center">Not quite ready to commit? We understand the importance of careful planning. Let's explore
        your design ideas and selections together.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#feedback" class="button secondary-button" @click="handleButtonClick('design')">I'm still thinking
          through designs and selections</a>
      </div>

      <p class="text-center">Concerned about the budget? We offer flexible options and can help you find solutions that
        match your financial goals while still achieving your dream kitchen.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="#feedback" class="button secondary-button" @click="handleButtonClick('budget')">This is way above my
          budget, what are my other options</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  response: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const handleButtonClick = (selection) => {
  // Store the user's selection in localStorage
  localStorage.setItem('atlhm_user_selection', selection);

  // Handle navigation based on selection
  switch (selection) {
    case 'schedule':
      router.push('/make-appointment');
      break;
    case 'design':
    case 'budget':
      router.push('/portal');
      break;
  }
};
</script>

<style scoped>
body,
table,
td,
div,
p,
a {
  font-family: Arial, sans-serif;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

/* Container styles */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
}

/* Header styles */
.header {
  text-align: center;
  padding: 20px 0;
  background-color: #f8f9fa;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #2d3748;
}

/* Content styles */
.content {
  padding: 30px 0;
}

.estimate-box {
  background-color: #f1f5f9;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

/* Button styles */
.button {
  display: inline-block;
  padding: 12px 24px;
  margin: 10px 0;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
}

.primary-button {
  background-color: rgb(173, 49, 52);
  color: #ffffff !important;
}

.secondary-button {
  background-color: rgb(173, 49, 52);
  color: #ffffff !important;
}

/* Footer styles */
.footer {
  text-align: center;
  padding: 20px 0;
  color: #64748b;
  font-size: 14px;
  border-top: 1px solid #e2e8f0;
}

.text-center {
  text-align: center;
}

.estimate-box {
  background-color: #f1f5f9;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
}

.estimate-amount {
  font-size: 2rem;
  font-weight: bold;
  color: rgb(173, 49, 52);
  margin: 1rem 0;
}
</style>
