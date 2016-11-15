import * as http from './api/api-config'

export const getProjectAssets = (projectId) => {
  return http.get(`/projects/${projectId}/assets`)
}
