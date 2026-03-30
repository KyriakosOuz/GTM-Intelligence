import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

export async function sendChatMessage(message, history = []) {
  try {
    const { data } = await api.post('/chat', { message, history })
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

export async function getLeads() {
  try {
    const { data } = await api.get('/leads')
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function getTeam() {
  try {
    const { data } = await api.get('/team')
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function getStats() {
  try {
    const { data } = await api.get('/stats')
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function clearLeads() {
  try {
    const { data } = await api.post('/leads/clear', { confirm: true })
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function triggerAutomation() {
  try {
    const { data } = await api.post('/automation/trigger')
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}

export async function getAutomationStatus() {
  try {
    const { data } = await api.get('/automation/status')
    return data
  } catch (error) {
    return { success: false, data: null, error: error.response?.data?.error || error.message }
  }
}
