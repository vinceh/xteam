import Vue from 'vue'

export const server = 'http://localhost:3001'

export const get = (url) => {
  return Vue.http.get(`${server}${url}`)
}

export const post = (url, data) => {
  return Vue.http.post(`${server}${url}`, data)
}
