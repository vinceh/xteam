import Vue from 'vue'

export const server = 'http://localhost:3001'

export const get = (url) => {
  var options = {}
  var apiKey = window.localStorage.getItem('apiKey')
  if (apiKey) {
    options.headers = {
      Authorization: `Bearer ${apiKey}`
    }
  }
  return Vue.http.get(`${server}${url}`, options)
}

export const post = (url, data) => {
  var options = {}
  var apiKey = window.localStorage.getItem('apiKey')
  if (apiKey) {
    options.headers = {
      Authorization: `Bearer ${apiKey}`
    }
  }
  return Vue.http.post(`${server}${url}`, data, options)
}
