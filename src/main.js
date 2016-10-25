import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import utils from './mixins/utils'

Vue.use(VueResource)
Vue.mixin(utils)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
