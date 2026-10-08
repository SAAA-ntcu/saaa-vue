import { reactive, computed } from 'vue'

export function buildUsername({
  city = '測試市',
  school = '測試國小',
  role = '校管理者',
  grade = '5',
  classroom = '1'
} = {}) {
  const schoolPrefix = city ? `${city}立${school}` : school
  let roleSuffix = role

  if (role === '校管理者') {
    roleSuffix = '校管'
  } else if (role === '校長') {
    roleSuffix = '校長'
  } else if (role === '學年主任') {
    roleSuffix = grade ? `${grade}年級主任` : '學年主任'
  } else if (role === '導師') {
    roleSuffix = (grade && classroom) ? `${grade}年${classroom}班導師` : '導師'
  } else if (role === '科任教師') {
    roleSuffix = (grade && classroom) ? `${grade}年${classroom}班科任` : '科任教師'
  }

  return `${schoolPrefix}_${roleSuffix}`
}

const defaultInitial = {
  isLoggedIn: false,
  city: '測試市',
  area: '測試區',
  school: '測試國小',
  role: '校管理者',
  grade: '5',
  classroom: '1',
  username: '測試市立測試國小_校管',
  ip: '172.16.113.107',
  realPublicIp: '',
  isRealIpMode: false,
  countdownSeconds: 3600,
  policyMode: 'current'
}

const STORAGE_KEY = 'saaa_auth_state_v3'

// Clear legacy cached login states so visitors default to unauthenticated (待登入)
try {
  localStorage.removeItem('saaa_auth_state')
  localStorage.removeItem('saaa_auth_state_v2')
} catch (e) {
  // ignore in non-browser env
}

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
let initial = { ...defaultInitial }

if (stored) {
  try {
    const parsed = JSON.parse(stored)
    // Automatically migrate away from legacy demo text "中正國小" if present
    if (!parsed.username || parsed.username.includes('中正國小')) {
      parsed.city = '測試市'
      parsed.area = '測試區'
      parsed.school = '測試國小'
      parsed.role = parsed.role || '校管理者'
      parsed.username = buildUsername({
        city: '測試市',
        school: '測試國小',
        role: parsed.role,
        grade: '5',
        classroom: '1'
      })
    }
    initial = { ...defaultInitial, ...parsed }
  } catch (e) {
    initial = { ...defaultInitial }
  }
}

const state = reactive(initial)
let timer = null

// Asynchronously attempt to detect client public IP
async function detectRealIp() {
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout?.(3000) })
    if (res.ok) {
      const data = await res.json()
      if (data.ip) {
        state.realPublicIp = data.ip
        if (state.isRealIpMode) {
          state.ip = data.ip
        }
      }
    }
  } catch (e) {
    // Keep internal network IP
  }
}

detectRealIp()

function saveState() {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    isLoggedIn: state.isLoggedIn,
    city: state.city,
    area: state.area,
    school: state.school,
    role: state.role,
    grade: state.grade,
    classroom: state.classroom,
    username: state.username,
    ip: state.ip,
    realPublicIp: state.realPublicIp,
    isRealIpMode: state.isRealIpMode,
    countdownSeconds: state.countdownSeconds,
    policyMode: state.policyMode || 'current'
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
    state.city = payload.city || '測試市'
    state.area = payload.area || (state.city === '測試市' ? '測試區' : '測試鄉')
    state.school = payload.school || '測試國小'
    state.role = payload.role || '校管理者'
    state.grade = payload.grade || '5'
    state.classroom = payload.classroom || '1'
    state.username = payload.username || buildUsername({
      city: state.city,
      school: state.school,
      role: state.role,
      grade: state.grade,
      classroom: state.classroom
    })
    state.ip = payload.ip || (state.isRealIpMode && state.realPublicIp ? state.realPublicIp : '172.16.113.107')
    state.countdownSeconds = 3600
    saveState()
    startTimer()
  }

  function switchRole(newRole, extra = {}) {
    state.isLoggedIn = true
    state.role = newRole
    if (extra.city) state.city = extra.city
    if (extra.school) state.school = extra.school
    if (extra.grade) state.grade = extra.grade
    if (extra.classroom) state.classroom = extra.classroom
    state.username = buildUsername({
      city: state.city,
      school: state.school,
      role: state.role,
      grade: state.grade,
      classroom: state.classroom
    })
    if (!timer) {
      startTimer()
    }
    saveState()
  }

  function toggleIpMode() {
    if (!state.isRealIpMode) {
      state.isRealIpMode = true
      if (state.realPublicIp) {
        state.ip = state.realPublicIp
      }
    } else {
      state.isRealIpMode = false
      state.ip = '172.16.113.107'
    }
    saveState()
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

  function setPolicyMode(mode) {
    state.policyMode = mode
    saveState()
  }

  return {
    state,
    formattedCountdown,
    login,
    switchRole,
    setPolicyMode,
    toggleIpMode,
    logout,
    toggleLogin
  }
}
