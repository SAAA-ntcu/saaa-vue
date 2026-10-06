<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b-4 border-[#52796f] transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="flex items-center justify-between h-16 lg:h-20 relative z-10">
        <!-- Logo and Site Title -->
        <router-link to="/" class="flex items-center space-x-3 pointer-events-auto no-underline group shrink-0">
          <div class="w-10 h-10 rounded-xl bg-[#52796f] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 class="text-base sm:text-lg lg:text-xl font-black text-slate-800 tracking-wide group-hover:text-[#52796f] transition-colors m-0">
              縣市學生學習能力檢測
            </h1>
            <p class="text-[9px] lg:text-[10px] text-[#52796f] uppercase tracking-widest font-bold m-0">
              Students' Academic Attainment Assessment
            </p>
          </div>
        </router-link>

        <!-- Desktop Navigation & User Section -->
        <div class="hidden md:flex items-center space-x-3 lg:space-x-6 pointer-events-auto">
          <!-- Navigation Links -->
          <nav>
            <ul class="flex items-center space-x-1 lg:space-x-2 py-2 text-sm lg:text-base font-medium text-slate-600 list-none m-0 p-0">
              <li v-for="item in currentNavItems" :key="item.path">
                <router-link
                  :to="item.path"
                  class="px-3 lg:px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-150 inline-block no-underline"
                  :class="isActive(item.path)
                    ? 'bg-[#edf2ee] text-[#354f52] font-bold shadow-xs ring-1 ring-[#52796f]/20'
                    : 'text-slate-600 hover:bg-[#f4f7f5] hover:text-[#52796f]'"
                >
                  {{ item.title }}
                </router-link>
              </li>
            </ul>
          </nav>

          <!-- Logged-in User Capsule (matching screenshot) -->
          <div v-if="state.isLoggedIn" class="relative" ref="profileDropdownRef">
            <button
              type="button"
              @click="isDropdownOpen = !isDropdownOpen"
              class="flex flex-col items-end border border-slate-200/90 hover:border-[#52796f]/60 rounded-xl px-3 py-1.5 bg-white hover:bg-slate-50/80 transition-all shadow-2xs cursor-pointer select-none focus:outline-none"
              :class="{ 'ring-2 ring-[#52796f]/20 border-[#52796f]': isDropdownOpen }"
              aria-label="使用者設定選單"
            >
              <!-- Top Line: Role badge + Username + Chevron -->
              <div class="flex items-center gap-1.5">
                <span class="text-xs px-2 py-0.5 rounded-md font-semibold bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd]">
                  {{ state.role }}
                </span>
                <span class="text-xs lg:text-sm font-bold text-slate-800 tracking-wide">
                  {{ state.username }}
                </span>
                <!-- Chevron down / up arrow -->
                <svg
                  class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200"
                  :class="{ 'rotate-180': isDropdownOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!-- Bottom Line: IP & Remaining countdown ticker -->
              <div class="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-0.5">
                <span>IP: {{ state.ip }}</span>
                <span>·</span>
                <span>剩餘: <span class="text-emerald-600 font-mono font-medium tracking-wide">{{ formattedCountdown }}</span></span>
              </div>
            </button>

            <!-- Dropdown Popover Menu -->
            <transition name="dropdown-fade">
              <div
                v-if="isDropdownOpen"
                class="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 origin-top-right"
              >
                <!-- 更改密碼 -->
                <router-link
                  to="/forgot-password?bWVtb2ZvcmdldHB3=TVRnek5qRTA="
                  @click="isDropdownOpen = false"
                  class="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#52796f] hover:bg-slate-50 rounded-xl transition no-underline"
                >
                  <svg class="w-4 h-4 text-[#c47c5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  更改密碼
                </router-link>

                <!-- 登出系統 -->
                <button
                  type="button"
                  @click="handleLogout"
                  class="w-full mt-1.5 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#52796f] hover:bg-[#354f52] rounded-xl shadow-xs transition cursor-pointer active:scale-98"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  登出系統
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <button
          type="button"
          @click="isMobileMenuOpen = true"
          class="md:hidden w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs focus:outline-none transition active:scale-95 cursor-pointer"
          aria-label="開啟導覽功能表"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <Teleport to="body">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 z-[999]">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          @click="isMobileMenuOpen = false"
        ></div>

        <!-- Drawer -->
        <div class="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl p-6 flex flex-col overflow-y-auto">
          <!-- Drawer Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div class="text-base font-bold text-slate-800 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#52796f]"></span>
              導覽功能表
            </div>
            <button
              type="button"
              @click="isMobileMenuOpen = false"
              class="p-2 text-slate-500 hover:bg-slate-100 rounded-lg focus:outline-none transition cursor-pointer"
              aria-label="關閉導覽功能表"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- User Card in Mobile Drawer when logged in -->
          <div v-if="state.isLoggedIn" class="mb-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs px-2 py-0.5 rounded-md font-semibold bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd]">
                {{ state.role }}
              </span>
              <span class="text-xs font-bold text-slate-800">
                {{ state.username }}
              </span>
            </div>
            <div class="text-[11px] text-slate-400 font-medium space-y-0.5">
              <div>IP: {{ state.ip }}</div>
              <div>剩餘時間: <span class="text-emerald-600 font-mono font-semibold">{{ formattedCountdown }}</span></div>
            </div>
          </div>

          <!-- Nav Items -->
          <ul class="space-y-1.5 text-sm font-medium text-slate-700 flex-1 list-none p-0 m-0">
            <li v-for="item in currentNavItems" :key="item.path">
              <router-link
                :to="item.path"
                @click="isMobileMenuOpen = false"
                class="block py-3 px-4 rounded-xl transition no-underline"
                :class="isActive(item.path)
                  ? 'bg-[#edf2ee] text-[#354f52] font-bold'
                  : 'hover:bg-[#f4f7f5] text-slate-700'"
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>

          <!-- Action buttons in Mobile Drawer when logged in -->
          <div v-if="state.isLoggedIn" class="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <router-link
              to="/forgot-password?bWVtb2ZvcmdldHB3=TVRnek5qRTA="
              @click="isMobileMenuOpen = false"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold no-underline"
            >
              <svg class="w-4 h-4 text-[#c47c5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              更改密碼
            </router-link>
            <button
              type="button"
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#52796f] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              登出系統
            </button>
          </div>

          <div class="border-t border-slate-100 pt-4 mt-4 text-xs text-slate-400 text-center">
            &copy; 2026 國立臺中教育大學 | 測驗統計與適性學習研究中心
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const profileDropdownRef = ref(null)

const { state, formattedCountdown, logout } = useAuth()

// Dynamic navigation items based on login status
const currentNavItems = computed(() => {
  if (state.isLoggedIn) {
    return [
      { title: '最新消息', path: '/' },
      { title: '評量架構', path: '/AssessmentFrames' },
      { title: '試題公告', path: '/ExamReleases' },
      { title: '成績專區', path: '/scores' },
      { title: '綜合專區', path: '/integrated' }
    ]
  } else {
    return [
      { title: '最新消息', path: '/' },
      { title: '評量架構', path: '/AssessmentFrames' },
      { title: '試題公告', path: '/ExamReleases' },
      { title: '登入', path: '/logins' }
    ]
  }
})

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

function handleLogout() {
  isDropdownOpen.value = false
  isMobileMenuOpen.value = false
  logout()
  ElMessage.success('已安全登出系統')
  router.push('/')
}

// Click outside to close dropdown
function handleClickOutside(event) {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.15s ease-out;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
