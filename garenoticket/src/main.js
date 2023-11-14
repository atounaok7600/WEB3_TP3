import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification';

const app = createApp(App)

app.use(router)
app.use(Toast)

app.mount('#app')
