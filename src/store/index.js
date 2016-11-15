import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import issue from './modules/issue'
import kanban from './modules/kanban'

Vue.use(Vuex)

const state = {
  projectAssets: null
}

export default new Vuex.Store({
  state,
  getters,
  modules: {
    issue,
    kanban
  },
  actions,
  mutations
})
