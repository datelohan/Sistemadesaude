import axios, { type AxiosError } from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smeds.at')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smeds.at')
      localStorage.removeItem('smeds.rt')
      window.location.href = '/login'
    }
    return Promise.reject(new Error(error.message))
  },
)
