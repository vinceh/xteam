import api from '../api/kanban'
import * as types from '../mutation-types'
import _ from 'lodash'

const state = {
  stages: null
}

const getters = {
}

const actions = {
  getKanbanDetails ({ commit }, { project_id }) {
    return new Promise((resolve, reject) => {
      api.getKanbanDetails(project_id).then((res) => {
        commit(types.RECEIVE_KANBAN_DETAILS, res.data)
        resolve()
      })
    })
  }
}

const mutations = {
  [types.RECEIVE_KANBAN_DETAILS] (state, stages) {
    state.stages = stages
  },
  [types.UPDATED_SIMPLE_ISSUE] (state, newIssue) {
    _.forIn(state.stages, (stage, key) => {
      if (stage.state.label === newIssue.state) {
        state.stages[key].issues.splice(
          _.findIndex(stage.issues, (o) => { return o.id === newIssue.id }),
          1,
          newIssue
        )
      }
    })
  },
  [types.UPDATED_SIMPLE_ISSUE_STATE] (state, newIssue) {
    _.forIn(state.stages, (stage, stageKey) => {
      _.forIn(stage.issues, (issue, issueKey) => {
        if (issue.id === newIssue.id) {
          state.stages[stageKey].issues.splice(
            issueKey,
            1
          )
        }
      })
    })

    _.forIn(state.stages, (stage, key) => {
      if (stage.state.label === newIssue.state) {
        state.stages[key].issues.push(newIssue)
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
