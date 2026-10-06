import { reactive, computed } from 'vue'

// Read from localStorage or default to logged-in user state as shown in the screenshot
const stored = localStorage.getItem('saaa_auth_state')
const initial = stored ? JSON.parse(stored) : {
  isLoggedIn: true,
  role: '校管理者',
  school: '縣市立中正國小',
  username: '縣市立中正國小_校管',
  ip: '172.16.113.107',
  countdownSeconds: 3600
}

const state = reactive(initial)
let timer = null

function saveState() {
  localStorage.setItem('saaa_auth_state', JSON.stringify({
    isLoggedIn: state.isLoggedIn,
    role: state.role,
    school: state.school,
    username: state.username,
    ip: state.ip,
    countdownSeconds: state.countdownSeconds
  }))
}

function startTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (state.countdownSeconds > 0) {
      state.countdownSeconds--
    } else {
      logout()
    }
  }, 1000)
}

if (state.isLoggedIn) {
  startTimer()
}

export function useAuth() {
  const formattedCountdown = computed(() => {
    const hrs = Math.floor(state.countdownSeconds / 3600)
    const mins = Math.floor((state.countdownSeconds % 3600) / 60)
    const secs = state.countdownSeconds % 60
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  })

  function login(payload = {}) {
    state.isLoggedIn = true
    state.role = payload.role || '校管理者'
    state.school = payload.school || '縣市立中正國小'
    state.username = payload.username || `${state.school}_${state.role === '校管理者' ? '校管' : state.role}`
    state.ip = payload.ip || '172.16.113.107'
    state.countdownSeconds = 3600
    saveState()
    startTimer()
  }

  function logout() {
    state.isLoggedIn = false
    if (timer) clearInterval(timer)
    saveState()
  }

  function toggleLogin() {
    if (state.isLoggedIn) {
      logout()
    } else {
      login()
    }
  }

  return {
    state,
    formattedCountdown,
    login,
    logout,
    toggleLogin
  }
}
