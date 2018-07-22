import 'babel-polyfill';
import isOutside from './customPlugins/isOutside'
import Selected from './customPlugins/selected'
import Vue from 'vue'
import App from './app.vue'
import { store } from './store'

Vue.use(isOutside)
Vue.use(Selected)
new Vue({
  el: '#app',
  store,
  render: h => h(App)
});

