import { createApp } from 'vue'
import App from './App'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@/assets/scss/aui.scss'
import './icons'
import installElementPlus from './plugins/element.js'

const app = createApp(App)
installElementPlus(app)
app.use(store).use(router).mount('#app')
