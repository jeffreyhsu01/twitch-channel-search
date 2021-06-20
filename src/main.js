import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'


axios.defaults.baseURL = '@/api/index';

createApp(App).mount('#app')
