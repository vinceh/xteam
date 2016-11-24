import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import utils from './mixins/utils'
import store from './store'
import VueRouter from 'vue-router'
import Kanban from './components/Kanban'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.mixin(utils)

const appRoutes = [
  {
    path: '/s/:id',
    component: Kanban,
    name: 'directStory'
  },
  {
    path: 'kanban',
    component: Kanban,
    name: 'kanban'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '',
      component: App,
      children: appRoutes
    }
  ]
})

import dragula from 'dragula'

// not sure where to put this...
Vue.directive('dragula', {
  inserted: function ($el, binding) {
    var drake = dragula({
      isContainer (el) {
        return el === $el
      },
      mirrorContainer: $el,
      ...binding.value.options || {}
    })
    binding.value.events(drake)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store
})
