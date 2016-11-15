import * as types from './mutation-types'

export default {
  [types.RECEIVE_PROJECT_ASSETS] (state, assets) {
    state.projectAssets = assets
  }
}
