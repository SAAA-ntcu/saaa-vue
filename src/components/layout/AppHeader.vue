<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b-4 border-[#52796f] transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="flex items-center justify-between h-16 lg:h-20 relative z-10">
        <!-- Logo and Site Title -->
        <router-link to="/" class="flex items-center space-x-3 pointer-events-auto no-underline group">
          <div class="w-10 h-10 rounded-xl bg-[#52796f] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg lg:text-xl font-black text-slate-800 tracking-wide group-hover:text-[#52796f] transition-colors">
              縣市學生學習能力檢測
            </h1>
            <p class="text-[9px] lg:text-[10px] text-[#52796f] uppercase tracking-widest font-bold m-0">
              Students' Academic Attainment Assessment
            </p>
          </div>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center pointer-events-auto">
          <ul class="flex items-center space-x-2 md:space-x-3 py-2 text-base lg:text-lg font-medium text-slate-600 list-none m-0 p-0">
            <li v-for="item in navItems" :key="item.path">
              <router-link
                :to="item.path"
                class="px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-150 inline-block no-underline"
                :class="isActive(item.path)
                  ? 'bg-[#edf2ee] text-[#354f52] font-bold shadow-xs ring-1 ring-[#52796f]/20'
                  : 'text-slate-600 hover:bg-[#f4f7f5] hover:text-[#52796f]'"
              >
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Mobile Menu Toggle Button -->
        <button
          type="button"
          @click="isMobileMenuOpen = true"
          class="md:hidden w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 shadow-xs focus:outline-none transition active:scale-95"
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
        <div class="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl p-6 flex flex-col overflow-y-auto">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div class="text-base font-bold text-slate-800 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#52796f]"></span>
              導覽功能表
            </div>
            <button
              type="button"
              @click="isMobileMenuOpen = false"
              class="p-2 text-slate-500 hover:bg-slate-100 rounded-lg focus:outline-none transition"
              aria-label="關閉導覽功能表"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul class="space-y-2 text-sm font-medium text-slate-700 flex-1 list-none p-0 m-0">
            <li v-for="item in navItems" :key="item.path">
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

          <div class="border-t border-slate-100 pt-4 text-xs text-slate-400 text-center">
            &copy; 2026 測驗統計與適性學習研究中心
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const navItems = [
  { title: '最新消息', path: '/' },
  { title: '評量架構', path: '/AssessmentFrames' },
  { title: '試題公告', path: '/ExamReleases' },
  { title: '登入', path: '/logins' }
]

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>
