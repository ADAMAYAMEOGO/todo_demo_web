import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import './style.css'

// Configure axios with token from localStorage
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Request notification permission
if ('Notification' in window && 'serviceWorker' in navigator) {
  Notification.requestPermission().then((permission) => {
    console.log('Notification permission:', permission);
  });
}

