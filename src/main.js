import { createApp } from 'vue'
import { Quasar } from 'quasar'
import 'quasar/dist/quasar.css'

import App from './App.vue'
import './styles/global.css'
import './styles/hero.css'
import './styles/nav.css'
import './styles/event-info.css'
import './styles/gift.css'
import './styles/wish.css'
import './styles/contact.css'
import './styles/survey.css'
import './styles/message.css'
import './styles/app.css'

/** 掛載 Vue 應用程式並啟用 Quasar，設定品牌色 */
const app = createApp(App)
app.use(Quasar, {
  plugins: {},
  config: {
    brand: {
      primary:   '#8B0000',
      secondary: '#D4A574',
      accent:    '#C0392B',
      dark:      '#3E2723',
    },
  },
})
app.mount('#app')
