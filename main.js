import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login';

const app = createApp(App)
app.use(vue3GoogleLogin,{
  clientId : process.env.VITE_GOOGLE_CLIENT_ID
})
app.use(router)
app.mount('#app')