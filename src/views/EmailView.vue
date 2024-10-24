<template>
  <div class="email-form-container">
    <form @submit.prevent="sendEmail" class="email-form">
      <input type="email" v-model="from" placeholder="From" />
      <input type="text" v-model="to" placeholder="To" required />
      <input type="text" v-model="subject" placeholder="Subject" required />
      <textarea v-model="text" placeholder="Your Message" required></textarea>
      <button type="submit">Send Email</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Define reactive form data
const from = ref('');
const to = ref('');
const subject = ref('');
const text = ref('');

// Function to send email
const sendEmail = () => {
  axios
    .post('http://localhost:3000/send-email', {
      from: from.value,
      to: to.value,
      subject: subject.value,
      text: text.value,
    })
    .then(() => {
      from.value = '';
      to.value = '';
      subject.value = '';
      text.value = '';
    })
    .catch((error) => {
      alert('Failed to send email: ' + error);
    });
};
</script>

<style scoped>
.email-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7f7f7;
}

.email-form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.email-form input,
.email-form textarea {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  font-size: 16px;
}

.email-form button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.email-form button:hover {
  background-color: #218838;
}
</style>
