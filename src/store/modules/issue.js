import api from '../api/issue'
import * as types from '../mutation-types'

const state = {
  detailedIssue: null
}

const getters = {
}

const actions = {
  editSummary ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.editIssueSummary(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body.detailed_issue)
        commit(types.UPDATED_SIMPLE_ISSUE, res.body.simple_issue)
        resolve()
      })
    })
  },
  getIssue ({ commit }, issueId) {
    return new Promise((resolve, reject) => {
      api.getIssue(issueId).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body)
        resolve()
      })
    })
  },
  editDescription ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.editDescription(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body)
        resolve()
      })
    })
  },
  toggleSubtask ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.toggleSubtask(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body)
        resolve()
      })
    })
  },
  addSubtask ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.addSubtask(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body)
        resolve()
      })
    })
  },
  deleteSubtask ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.deleteSubtask(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body)
        resolve()
      })
    })
  },
  editSubtask ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.editSubtask(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body)
        resolve()
      })
    })
  },
  addComment ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.addComment(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body)
        resolve()
      })
    })
  },
  editComment ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.editComment(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body)
        resolve()
      })
    })
  },
  deleteComment ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.deleteComment(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body)
        resolve()
      })
    })
  },
  editHero ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.editHero(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body.detailed_issue)
        commit(types.UPDATED_SIMPLE_ISSUE, res.body.simple_issue)
        resolve()
      })
    })
  },
  editReporter ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.editReporter(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body)
        resolve()
      })
    })
  },
  editState ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.editState(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body.detailed_issue)
        commit(types.UPDATED_SIMPLE_ISSUE_STATE, res.body.simple_issue)
        resolve()
      })
    })
  },
  editType ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.editType(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body.detailed_issue)
        commit(types.UPDATED_SIMPLE_ISSUE, res.body.simple_issue)
        resolve()
      })
    })
  },
  editEpic ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.editEpic(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body.detailed_issue)
        commit(types.UPDATED_SIMPLE_ISSUE, res.body.simple_issue)
        resolve()
      })
    })
  },
  createEpic ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.createEpic(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body.detailed_issue)
        commit(types.UPDATED_SIMPLE_ISSUE, res.body.simple_issue)
        commit(types.RECEIVE_PROJECT_ASSETS, res.body.assets)
        resolve()
      })
    })
  },
  editPoints ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.editPoints(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body.detailed_issue)
        commit(types.UPDATED_SIMPLE_ISSUE, res.body.simple_issue)
        resolve()
      })
    })
  },
  toggleLabel ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.toggleLabel(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_SIMPLE_ISSUE, res.body)
        resolve()
      })
    })
  },
  clearAllLabels ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.clearAllLabels(payload.issueId).then((res) => {
        commit(types.UPDATED_SIMPLE_ISSUE, res.body)
        resolve()
      })
    })
  },
  createIssueLabel ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.createIssueLabel(payload.issueId, payload.data).then((res) => {
        commit(types.UPDATED_DETAILED_ISSUE, res.body.detailed_issue)
        commit(types.RECEIVE_PROJECT_ASSETS, res.body.assets)
        resolve()
      })
    })
  }
}

const mutations = {
  [types.UPDATED_DETAILED_ISSUE] (state, issue) {
    state.detailedIssue = issue
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
