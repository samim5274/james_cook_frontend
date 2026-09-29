import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


import './style.css';

// -----------------------------
// Theme Initialization
// -----------------------------
const savedTheme = localStorage.getItem("theme");
const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const isDark = savedTheme ? savedTheme === "dark" : systemDark;

document.documentElement.classList.toggle("dark", isDark);

// -----------------------------
// Vue App
// -----------------------------
const app = createApp(App)

app.use(router)
app.use(createPinia());

app.mount('#app')