import * as types from './mutation-types'
import * as api from './api'

export const getProjectAssets = ({ commit }, { project_id }) => {
  return new Promise((resolve, reject) => {
    api.getProjectAssets(project_id).then((res) => {
      commit(types.RECEIVE_PROJECT_ASSETS, res.data)
      resolve()
    })
  })
}
//
// export const getKanbanDetails = ({ commit }, { project_id }) => {
//   return new Promise((resolve, reject) => {
//     api.getKanbanDetails(project_id).then((res) => {
//       commit(types.RECEIVE_KANBAN_DETAILS, res.data)
//       resolve()
//     })
//   })
// }
