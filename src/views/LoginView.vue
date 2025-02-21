<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Sign In</h1>
      <p class="subtitle">Sign in with your company Google account to access the sales portal.</p>
      
      <div class="google-signin-container">
        <GoogleLogin 
          :callback="handleCallback"
          :client-id="clientId"
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { GoogleLogin } from 'vue3-google-login';
import axios from 'axios';
import { setAuthState } from '../auth/authGuard';

const router = useRouter();
const route = useRoute();
const error = ref('');
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const handleCallback = async (response) => {
  try {
    // Verify the token with our backend
    const result = await axios.post('http://localhost:3000/auth/google', {
      token: response.credential
    });

    if (result.data.authorized) {
      // Set auth state
      setAuthState(result.data.user);

      // Redirect to intended route or default to sales
      const redirectPath = route.query.redirect || '/sales';
      router.push(redirectPath);
    } else {
      error.value = result.data.message || 'You are not authorized to access this application. Please contact your administrator.';
    }
  } catch (err) {
    console.error('Authentication error:', err);
    error.value = 'Authentication failed. Please try again.';
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--background-color);
}

.login-card {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.subtitle {
  color: #64748b;
  margin: 1rem 0 2rem;
}

.google-signin-container {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-message {
  color: #ef4444;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border-radius: var(--radius);
}
</style>