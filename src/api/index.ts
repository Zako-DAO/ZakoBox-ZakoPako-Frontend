import axios from 'feaxios'
import { useSessionMessagesApi } from './sessionMessages'
import { useSessionsApi } from './sessions'

const httpClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.response.use((response) => {
  return response.data
}, error => error)

export const Api = {
  sessions: useSessionsApi(httpClient),
  sessionMessages: useSessionMessagesApi(httpClient),
}
