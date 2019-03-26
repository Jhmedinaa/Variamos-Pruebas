import Vue from 'vue'
import './plugins/vuetify'
import './plugins/vuetify'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Vuetify from 'vuetify'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/dashboard.css'
import './assets/css/fontawesome.css'
import './assets/css/vuetify.min.css'
Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(Vuetify)
Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
