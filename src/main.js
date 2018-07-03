import 'babel-polyfill'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import locale from '@/locale'
import router from '@/router'
import store from '@/store'
import App from '@/App'
import '@/lib/bus'
import '@/lib/socket'
import '@/lib/notification'
import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n: locale,
  template: '<App/>',
  components: {
    App
  }
})

// router.push('/')
