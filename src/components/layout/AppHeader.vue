<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b-2 border-[#52796f] transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="flex items-center justify-between h-16 lg:h-20 relative z-10">
        <!-- Logo and Site Title -->
        <router-link to="/" class="flex items-center space-x-2.5 sm:space-x-3 pointer-events-auto no-underline group shrink-0 py-1" title="縣市學生學習能力檢測 - 回首頁">
          <!-- 官方標誌彩色圖示 -->
          <img
            :src="logoIcon"
            alt="SAAA Logo"
            class="h-9 sm:h-11 lg:h-12 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200"
          />
          <!-- 向量文字排版（純文字呈現，文字清晰銳利不模糊） -->
          <div class="flex flex-col justify-center">
            <h1 class="text-base sm:text-lg lg:text-xl font-black text-[#203b46] tracking-wide group-hover:text-[#52796f] transition-colors leading-tight m-0 select-none">
              縣市學生學習能力檢測
            </h1>
            <p class="text-[9px] sm:text-[10px] text-[#5f7f6f] uppercase tracking-wider font-bold m-0 mt-0.5 select-none font-sans">
              Students' Academic Attainment Assessment
            </p>
          </div>
        </router-link>

        <!-- Desktop Navigation & User Section -->
        <div class="hidden md:flex items-center space-x-3 lg:space-x-6 pointer-events-auto">
          <!-- Navigation Links with Dropdowns -->
          <nav>
            <ul class="flex items-center space-x-1 lg:space-x-2 py-2 text-sm lg:text-base font-medium text-slate-600 list-none m-0 p-0">
              <li
                v-for="item in currentNavItems"
                :key="item.path"
                class="relative"
                @mouseenter="item.children ? handleMouseEnter(item.title) : null"
                @mouseleave="item.children ? handleMouseLeave() : null"
              >
                <!-- Nav Item Link -->
                <router-link
                  :to="item.path"
                  class="px-3 lg:px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-150 inline-flex items-center gap-1 no-underline"
                  :class="(isActive(item.path) || (item.children && activeHoverMenu === item.title))
                    ? 'bg-[#edf2ee] text-[#354f52] font-bold shadow-xs ring-1 ring-[#52796f]/20'
                    : 'text-slate-600 hover:bg-[#f4f7f5] hover:text-[#52796f]'"
                >
                  <span>{{ item.title }}</span>
                </router-link>

                <!-- Dropdown Menu (成績專區, 綜合專區) -->
                <transition name="dropdown-fade">
                  <div
                    v-if="item.children && activeHoverMenu === item.title"
                    class="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 min-w-[145px] z-50 origin-top-left"
                  >
                    <div
                      v-for="sub in item.children"
                      :key="sub.title"
                      class="relative"
                      @mouseenter="sub.hasSubmenu ? activeSubHover = sub.title : null"
                      @mouseleave="sub.hasSubmenu ? activeSubHover = null : null"
                    >
                      <router-link
                        :to="sub.path"
                        @click="activeHoverMenu = null"
                        class="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#f4f7f5] hover:text-[#52796f] transition-colors no-underline whitespace-nowrap"
                      >
                        <span>{{ sub.title }}</span>
                        <!-- Right arrow for 教師帳號管理 -->
                        <svg
                          v-if="sub.hasSubmenu"
                          class="w-3.5 h-3.5 text-slate-400 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </router-link>

                      <!-- Flyout Submenu for 教師帳號管理 -->
                      <transition name="dropdown-fade">
                        <div
                          v-if="sub.hasSubmenu && activeSubHover === sub.title"
                          class="absolute left-full top-0 ml-1 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 min-w-[135px] z-50 origin-top-left"
                        >
                          <router-link
                            v-for="subChild in sub.subChildren"
                            :key="subChild.title"
                            :to="subChild.path"
                            @click="activeHoverMenu = null; activeSubHover = null"
                            class="block px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-[#f4f7f5] hover:text-[#52796f] transition-colors no-underline whitespace-nowrap"
                          >
                            {{ subChild.title }}
                          </router-link>
                        </div>
                      </transition>
                    </div>
                  </div>
                </transition>
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
                class="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 z-50 origin-top-right text-left"
              >
                <!-- User Unit info -->
                <div class="px-2.5 py-2 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                  <div class="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                    <span>單位與區域</span>
                    <span class="text-[#52796f] font-bold">{{ state.city }} · {{ state.area }}</span>
                  </div>
                  <div class="text-xs font-bold text-slate-800 mt-1 truncate" :title="state.username">
                    {{ state.username }}
                  </div>

                </div>

                <!-- Quick Role Switcher section -->
                <div class="mb-2 px-1">
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>切換測試身分</span>
                    <span class="text-[10px] text-slate-500 font-semibold">{{ state.school }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-1">
                    <button
                      v-for="r in roleOptions"
                      :key="r"
                      type="button"
                      @click="handleSwitchRole(r)"
                      class="px-2 py-1.5 rounded-lg text-xs font-medium text-left transition cursor-pointer flex items-center justify-between"
                      :class="state.role === r
                        ? 'bg-[#edf2ee] text-[#354f52] font-bold border border-[#52796f]/30'
                        : 'text-slate-600 hover:bg-slate-100 border border-transparent'"
                    >
                      <span class="truncate">{{ r }}</span>
                      <span v-if="state.role === r" class="w-1.5 h-1.5 rounded-full bg-[#52796f] shrink-0"></span>
                    </button>
                  </div>
                </div>

                <div class="border-t border-slate-100 my-1.5"></div>

                <!-- 更改密碼 -->
                <router-link
                  to="/changepasss"
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

          <!-- Unauthenticated / Guest state: 系統登入 Button -->
          <div v-else class="flex items-center">
            <router-link
              to="/logins"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs lg:text-sm font-semibold text-white bg-[#52796f] hover:bg-[#354f52] rounded-xl shadow-xs hover:shadow-md transition-all duration-200 no-underline cursor-pointer active:scale-95 ring-1 ring-[#52796f]/30"
              title="前往系統登入"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>系統登入</span>
            </router-link>
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
            <router-link to="/" @click="isMobileMenuOpen = false" class="flex items-center gap-2.5 no-underline" title="回首頁">
              <img
                :src="logoIcon"
                alt="SAAA Logo"
                class="h-8 w-auto object-contain shrink-0"
              />
              <div class="flex flex-col">
                <span class="text-xs font-black text-[#203b46] leading-tight">縣市學生學習能力檢測</span>
                <span class="text-[8px] text-[#5f7f6f] uppercase font-bold tracking-wider font-sans">Students' Assessment</span>
              </div>
            </router-link>
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
            <div class="text-[11px] text-slate-400 font-medium space-y-0.5 mb-2.5">
              <div>單位: {{ state.city }} · {{ state.area }}</div>
              <div>IP: {{ state.ip }}</div>
              <div>剩餘時間: <span class="text-emerald-600 font-mono font-semibold">{{ formattedCountdown }}</span></div>
            </div>

            <!-- Role switcher in mobile -->
            <div class="pt-2 border-t border-slate-200/60">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">切換測試身分</div>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="r in roleOptions"
                  :key="r"
                  type="button"
                  @click="handleSwitchRole(r)"
                  class="px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer"
                  :class="state.role === r
                    ? 'bg-[#52796f] text-white font-bold'
                    : 'bg-white text-slate-600 border border-slate-200'"
                >
                  {{ r }}
                </button>
              </div>
            </div>
          </div>

          <!-- Guest Card in Mobile Drawer when NOT logged in -->
          <div v-else class="mb-5 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/80">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-xs px-2 py-0.5 rounded-md font-semibold bg-slate-200 text-slate-700">
                訪客狀態
              </span>
              <span class="text-xs font-bold text-slate-500">待登入</span>
            </div>
            <p class="text-[11px] text-slate-400 m-0 leading-relaxed">
              尚未登入系統。登入後可存取成績專區、報表下載與管理功能。
            </p>
          </div>

          <!-- Nav Items with Expandable Submenus -->
          <ul class="space-y-1.5 text-sm font-medium text-slate-700 flex-1 list-none p-0 m-0">
            <li v-for="item in currentNavItems" :key="item.path">
              <!-- Item with children -->
              <div v-if="item.children">
                <div
                  @click="toggleMobileSubmenu(item.title)"
                  class="flex items-center justify-between py-2.5 px-4 rounded-xl transition cursor-pointer select-none"
                  :class="isActive(item.path) || openMobileSubs[item.title]
                    ? 'bg-[#edf2ee] text-[#354f52] font-bold'
                    : 'hover:bg-[#f4f7f5] text-slate-700'"
                >
                  <span>{{ item.title }}</span>
                  <svg
                    class="w-4 h-4 text-slate-400 transition-transform duration-200"
                    :class="{ 'rotate-180': openMobileSubs[item.title] }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <!-- Submenu list -->
                <div v-if="openMobileSubs[item.title]" class="pl-4 pr-1 py-1 space-y-1 mt-1 border-l-2 border-[#52796f]/30 ml-3">
                  <router-link
                    v-for="sub in item.children"
                    :key="sub.title"
                    :to="sub.path"
                    @click="isMobileMenuOpen = false"
                    class="block py-2 px-3 rounded-lg text-xs font-medium text-slate-600 hover:text-[#52796f] hover:bg-slate-50 transition no-underline"
                  >
                    {{ sub.title }}
                  </router-link>
                </div>
              </div>

              <!-- Normal Item without children -->
              <router-link
                v-else
                :to="item.path"
                @click="isMobileMenuOpen = false"
                class="block py-2.5 px-4 rounded-xl transition no-underline"
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
              to="/changepasss"
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

          <!-- Action button in Mobile Drawer when NOT logged in -->
          <div v-else class="mt-4 pt-4 border-t border-slate-100">
            <router-link
              to="/logins"
              @click="isMobileMenuOpen = false"
              class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold no-underline cursor-pointer transition shadow-xs active:scale-98"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              前往系統登入
            </router-link>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuth } from '../../composables/useAuth'
import logoIcon from '@/assets/logo/saaa-logo-icon.svg'

const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const profileDropdownRef = ref(null)

const activeHoverMenu = ref(null)
const activeSubHover = ref(null)
let menuTimer = null

function handleMouseEnter(title) {
  if (menuTimer) clearTimeout(menuTimer)
  activeHoverMenu.value = title
}

function handleMouseLeave() {
  menuTimer = setTimeout(() => {
    activeHoverMenu.value = null
    activeSubHover.value = null
  }, 160)
}

const openMobileSubs = reactive({
  '成績專區': true,
  '綜合專區': false
})

function toggleMobileSubmenu(title) {
  openMobileSubs[title] = !openMobileSubs[title]
}

const { state, formattedCountdown, logout, switchRole, toggleIpMode } = useAuth()

const roleOptions = ['校長', '校管理者', '學年主任', '導師', '科任教師']

function handleSwitchRole(r) {
  switchRole(r)
  ElMessage.success(`已切換身分為：【${state.username}】`)
}

function handleToggleIp() {
  toggleIpMode()
  if (state.isRealIpMode) {
    if (state.realPublicIp) {
      ElMessage.success(`已切換為真實對外 IP：${state.ip}`)
    } else {
      ElMessage.info('正在偵測對外真實 IP 中...')
    }
  } else {
    ElMessage.info(`已切換回內網測試 IP：${state.ip}`)
  }
}

// Dynamic navigation items based on login status matching uploaded screenshots
const currentNavItems = computed(() => {
  if (state.isLoggedIn) {
    const baseNav = [
      { title: '最新消息', path: '/' },
      { title: '評量架構', path: '/AssessmentFrames' },
      { title: '試題公告', path: '/ExamReleases' },
      {
        title: '成績專區',
        path: '/scores',
        children: [
          { title: '學生成績查詢', path: '/scores?tab=inquiry' },
          { title: '各級報表下載', path: '/scores?tab=reports' },
          { title: '年度成果報告', path: '/scores?tab=annual' },
          { title: '試題分析結果', path: '/scores?tab=analysis' },
          { title: '背景資料分析', path: '/scores?tab=background' }
        ]
      }
    ]

    const integratedChildren = []
    if (state.role === '校管理者') {
      integratedChildren.push({ title: '教師帳號管理', path: '/integrated?tab=teachers' })
    }
    // 所有已登入學校人員（校長、校管理者、學年主任、導師、科任教師）皆可查看缺考名單下載
    integratedChildren.push({ title: '缺考名單下載', path: '/integrated?tab=absentee' })

    if (integratedChildren.length > 0) {
      baseNav.push({
        title: '綜合專區',
        path: '/integrated',
        children: integratedChildren
      })
    }

    return baseNav
  } else {
    return [
      { title: '最新消息', path: '/' },
      { title: '評量架構', path: '/AssessmentFrames' },
      { title: '試題公告', path: '/ExamReleases' }
    ]
  }
})

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(path + '/')
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
