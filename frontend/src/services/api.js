import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

export async function sendChatMessage(message) {
  try {
    const { data } = await api.post('/chat', { message })
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function uploadCSV(file) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function syncGoogleSheet() {
  try {
    const { data } = await api.post('/sync')
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function getSyncStatus() {
  try {
    const { data } = await api.get('/sync/status')
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function getInsights() {
  try {
    const { data } = await api.get('/insights')
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function getReport() {
  try {
    const { data } = await api.get('/report')
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function healthCheck() {
  try {
    const { data } = await api.get('/health')
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}
