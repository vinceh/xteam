import * as $ from './api-config'

export default {
  getKanbanDetails (projectId) {
    return $.get(`/projects/${projectId}/kanbanDetails`)
  }
}
