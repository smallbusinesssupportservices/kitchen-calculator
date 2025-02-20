<template>
    <div class="login-container">
      <div class="login-card">
        <h1>Sign In</h1>
        <p class="subtitle">Sign in with your company Google account to access the sales portal.</p>
        
        <div class="google-signin-container">
          <div id="g_id_onload"
               :data-client_id="clientId"
               data-context="signin"
               data-ux_mode="popup"
               data-callback="handleCredentialResponse"
               data-auto_prompt="false">
          </div>
  
          <div class="g_id_signin"
               data-type="standard"
               data-shape="rectangular"
               data-theme="outline"
               data-text="signin_with"
               data-size="large"
               data-logo_alignment="left">
          </div>
        </div>
  
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  import { setAuthState } from '../auth/authGuard';
  
  const router = useRouter();
  const route = useRoute();
  const error = ref('');
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  const handleCredentialResponse = async (response) => {
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
        error.value = 'You are not authorized to access this application. Please contact your administrator.';
      }
    } catch (err) {
      console.error('Authentication error:', err);
      error.value = 'Authentication failed. Please try again.';
    }
  };
  
  onMounted(() => {
    // Add the Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  
    // Make the callback function globally available
    window.handleCredentialResponse = handleCredentialResponse;
  });
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