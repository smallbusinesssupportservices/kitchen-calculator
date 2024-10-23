<template>
    <div>
      <form @submit.prevent="sendEmail">
        <input type="email" v-model="email" placeholder="Your Email" required />
        <input type="text" v-model="subject" placeholder="Subject" required />
        <textarea v-model="message" placeholder="Your Message" required></textarea>
        <button type="submit">Send Email</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        subject: '',
        message: ''
      };
    },
    methods: {
      sendEmail() {
        axios.post('http://localhost:3000/send-email', {
          email: this.email,
          subject: this.subject,
          message: this.message
        }).then(response => {
          alert('Email sent successfully');
        }).catch(error => {
          alert('Failed to send email: ' + error);
        });
      }
    }
  };
  </script>
  