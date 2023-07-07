import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

if (parent['setMPTheme']) parent.setMPTheme('Test Page - NetSuite Australia (Mail Plus Pty Ltd)');

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')