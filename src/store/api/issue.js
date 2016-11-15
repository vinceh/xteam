import * as $ from './api-config'

export default {
  editIssueSummary (issueId, data) {
    return $.post(`/issues/${issueId}/edit_summary`, data)
  },
  getIssue (issueId) {
    return $.get(`/issues/${issueId}`)
  },
  editDescription (issueId, data) {
    return $.post(`/issues/${issueId}/edit_description`, data)
  },
  toggleSubtask (issueId, data) {
    return $.post(`/issues/${issueId}/toggle_subtask`, data)
  },
  addSubtask (issueId, data) {
    return $.post(`/issues/${issueId}/add_subtask`, data)
  },
  deleteSubtask (issueId, data) {
    return $.post(`/issues/${issueId}/delete_subtask`, data)
  },
  editSubtask (issueId, data) {
    return $.post(`/issues/${issueId}/edit_subtask`, data)
  },
  addComment (issueId, data) {
    return $.post(`/issues/${issueId}/add_comment`, data)
  },
  editComment (issueId, data) {
    return $.post(`/issues/${issueId}/edit_comment`, data)
  },
  deleteComment (issueId, data) {
    return $.post(`/issues/${issueId}/delete_comment`, data)
  },
  editHero (issueId, data) {
    return $.post(`/issues/${issueId}/edit_hero`, data)
  },
  editReporter (issueId, data) {
    return $.post(`/issues/${issueId}/edit_reporter`, data)
  },
  editState (issueId, data) {
    return $.post(`/issues/${issueId}/edit_status`, data)
  },
  editType (issueId, data) {
    return $.post(`/issues/${issueId}/edit_type`, data)
  },
  editEpic (issueId, data) {
    return $.post(`/issues/${issueId}/edit_epic`, data)
  },
  createEpic (issueId, data) {
    return $.post(`/issues/${issueId}/create_epic`, data)
  },
  editPoints (issueId, data) {
    return $.post(`/issues/${issueId}/edit_points`, data)
  }
}
