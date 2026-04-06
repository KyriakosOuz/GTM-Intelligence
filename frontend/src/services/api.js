import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

export async function sendChatMessage(message, history = []) {
  // AI features temporarily disabled to conserve API costs
  return {
    success: true,
    data: {
      answer: '⚠️ AI chat is temporarily disabled to conserve API costs. In production, this would use Claude AI with RAG to answer questions based on your CRM data.',
      sources: []
    },
    error: null
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
  // AI features temporarily disabled to conserve API costs
  return {
    success: true,
    data: [
      'Pipeline velocity has increased 12% this quarter with 26 active deals worth $528K total.',
      'Rolf Inc. ($42,300) is the highest-value opportunity — prioritize follow-up with decision makers.',
      '3 leads (Polaris Shipping, Maplewood Partners, Idioma) have gone 30+ days without contact and risk going cold.',
      'Eren Y. leads the team in closed deals this month, while Sasha B. has the strongest conversion rate.'
    ],
    error: null
  }
}

export async function getReport() {
  // AI features temporarily disabled to conserve API costs
  return {
    success: true,
    data: `# GTM Intelligence — Pipeline Report (Sample)

⚠️ *AI report generation is temporarily disabled to conserve API costs.*

---

## Pipeline Overview
- **Total Pipeline Value:** $528,976.82
- **Active Deals:** 26
- **Top Deal:** Rolf Inc. — $42,300

## Team Performance
| Rep | Deals | Pipeline Value |
|-----|-------|---------------|
| Armin A. | 6 | $112,450 |
| Eren Y. | 5 | $98,200 |
| Mikasa A. | 5 | $134,776 |
| Levi R. | 5 | $96,350 |
| Sasha B. | 5 | $87,200 |

## Stalled Leads (30+ days no contact)
1. **Polaris Shipping** — Last contact: 45 days ago
2. **Maplewood Partners** — Last contact: 38 days ago
3. **Idioma** — Last contact: 33 days ago

## Recommendation
Focus outreach on stalled leads before they go cold. Prioritize Rolf Inc. for close.

---
*In production, this report is generated dynamically by Claude AI based on live CRM data.*`,
    error: null
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
  // Automation temporarily disabled to conserve API costs
  return {
    success: true,
    data: {
      message: '⚠️ Automation is temporarily disabled to conserve API costs. In production, this triggers a daily pipeline report via email and Slack alerts for stalled deals.',
      email: 'disabled'
    },
    error: null
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
