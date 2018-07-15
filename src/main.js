import 'babel-polyfill'
//import 'eligrey-classlist-js-polyfill'
//import './modifiedModules/setdragimage-ie'

import Vue from 'vue'
import App from './app.vue'
import { store } from './store'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});

