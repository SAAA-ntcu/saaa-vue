<template>
  <div class="flex-1 flex flex-col justify-center items-center w-full min-h-[500px] p-2 sm:p-4 bg-slate-50/50 rounded-xl">
    <div class="w-full max-w-[920px] bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-300">
      
      <!-- Top Morandi accent gradient line -->
      <div class="h-1.5 w-full bg-gradient-to-r from-[#729289] to-[#52796f]"></div>

      <!-- Card Header -->
      <div class="px-8 pt-6 pb-2 text-center">
        <div class="inline-flex items-center justify-center gap-3 sm:gap-3.5 mb-3">
          <img
            :src="logoIcon"
            alt="SAAA Logo"
            class="h-11 sm:h-13 w-auto object-contain shrink-0"
          />
          <div class="text-left">
            <h2 class="text-lg sm:text-xl font-black text-[#203b46] tracking-wide m-0 leading-tight">
              縣市學生學習能力檢測
            </h2>
            <p class="text-[9px] sm:text-[10px] text-[#5f7f6f] uppercase tracking-wider font-bold m-0 mt-0.5 font-sans">
              Students' Academic Attainment Assessment
            </p>
          </div>
        </div>
        <h3 class="text-xl font-bold text-slate-800 tracking-wider m-0">歡迎登入系統</h3>
        <p class="text-xs text-slate-400 mt-1 mb-0">請選擇您的單位與身分以開始檢測</p>
      </div>

      <!-- Form Body -->
      <div class="p-6 md:p-8 space-y-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- City & Role row -->
          <div class="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-[500px] mx-auto">
            <!-- City (縣市) -->
            <div class="w-full relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200">
              <div class="pl-3.5 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 mr-2">
                <svg class="w-4 h-4 mr-1 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                縣市
              </div>
              <select
                v-model="form.city"
                @change="handleCityChange"
                class="w-full bg-transparent px-2 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4"
                required
              >
                <option value="">請選擇縣市</option>
                <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <!-- Role (身分) -->
            <div class="w-full relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200">
              <div class="pl-3.5 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 mr-2">
                <svg class="w-4 h-4 mr-1 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                身分
              </div>
              <select
                v-model="form.role"
                class="w-full bg-transparent px-2 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4"
                required
              >
                <option value="">請選擇身分</option>
                <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
          </div>

          <div class="border-t border-slate-100 my-2"></div>

          <!-- Secondary Fields Grid (Area, School, Grade, Class) -->
          <div class="flex flex-wrap items-center gap-2.5 w-full">
            <!-- Area (區域) -->
            <div class="flex-auto md:flex-1 min-w-[110px] w-full sm:w-auto relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200 overflow-hidden">
              <div class="pl-3 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 h-full whitespace-nowrap">
                區域
              </div>
              <select
                v-model="form.area"
                class="w-full h-full bg-transparent px-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4"
                :disabled="availableAreas.length === 0"
              >
                <option v-if="availableAreas.length === 0" value="">請先選擇縣市</option>
                <option v-for="a in availableAreas" :key="a" :value="a">{{ a }}</option>
              </select>
            </div>

            <!-- School (學校) -->
            <div class="flex-auto md:flex-1 min-w-[110px] w-full sm:w-auto relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200 overflow-hidden">
              <div class="pl-3 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 h-full whitespace-nowrap">
                學校
              </div>
              <select
                v-model="form.school"
                class="w-full h-full bg-transparent px-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4"
              >
                <option v-for="s in schools" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>

            <!-- Grade (年級) - 依身分顯示 -->
            <div
              v-if="needsGrade"
              class="flex-auto md:flex-1 min-w-[110px] w-full sm:w-auto relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200 overflow-hidden"
            >
              <div class="pl-3 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 h-full whitespace-nowrap">
                年級
              </div>
              <select
                v-model="form.grade"
                class="w-full h-full bg-transparent px-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4"
              >
                <option value="3">三年級</option>
                <option value="4">四年級</option>
                <option value="5">五年級</option>
                <option value="6">六年級</option>
              </select>
            </div>

            <!-- Class (班級) - 依身分顯示 -->
            <div
              v-if="needsClass"
              class="flex-auto md:flex-1 min-w-[110px] w-full sm:w-auto relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200 overflow-hidden"
            >
              <div class="pl-3 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 h-full whitespace-nowrap">
                班級
              </div>
              <select
                v-model="form.classroom"
                class="w-full h-full bg-transparent px-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4"
              >
                <option v-for="c in 8" :key="c" :value="c">{{ c }} 班</option>
              </select>
            </div>
          </div>

          <!-- Password Field with eye toggle -->
          <div class="w-full max-w-[500px] mx-auto pt-2">
            <div class="flex items-center justify-between mb-1.5 pl-1 pr-1">
              <label for="password" class="block text-xs font-medium text-slate-500 tracking-wider text-left select-none m-0">
                密碼
              </label>
              <!-- Quick fill helper for testing -->
              <button
                type="button"
                @click="fillTestPassword"
                class="text-[11px] text-[#52796f] hover:text-[#354f52] hover:underline cursor-pointer bg-transparent border-0 p-0"
              >
                預設密碼: saaa.ntcu（點擊自動填入）
              </button>
            </div>

            <div class="grid grid-cols-[1fr_50px] w-full border rounded-xl h-11 transition-all duration-200 overflow-hidden shadow-xs border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="請輸入密碼 (saaa.ntcu)"
                class="w-full min-w-0 bg-transparent px-3.5 text-xs text-slate-800 outline-none tracking-wider h-full"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="text-slate-400 hover:text-slate-600 transition flex items-center justify-center w-full h-full border-l border-slate-200/60 bg-slate-50/30 hover:bg-slate-100 cursor-pointer"
                aria-label="切換密碼顯示"
              >
                <!-- Eye off -->
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                <!-- Eye on -->
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Action Buttons: 登入系統 & 忘記密碼 -->
          <div class="flex items-center justify-center gap-3 pt-3 max-w-[320px] mx-auto">
            <button
              type="submit"
              class="flex-1 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-[#52796f]/20 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 tracking-wider cursor-pointer"
            >
              登入系統
            </button>

            <router-link
              to="/forgot-password?bWVtb2ZvcmdldHB3=TVRnek5qRTA="
              class="flex-1 text-center bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xs transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 tracking-wider no-underline cursor-pointer flex items-center justify-center gap-1"
            >
              忘記密碼
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <!-- 方案一：雙小人吉祥物分工卡片區 (Mascot Functional Distribution Pods) -->
    <div class="w-full max-w-[920px] mt-4.5 grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <!-- 【左側小男孩 👦】：操作說明手冊專區 -->
      <div class="relative bg-white/95 backdrop-blur-md rounded-2xl border border-emerald-200/90 p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3 sm:gap-4 overflow-hidden group">
        <!-- 頂部莫蘭迪綠點綴條 -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-[#52796f]"></div>

        <!-- 認真讀書小男孩 (read_boy) -->
        <div class="shrink-0 flex flex-col items-center justify-center">
          <img
            src="/images/read_boy.png"
            alt="操作說明手冊小幫手"
            class="w-20 sm:w-24 h-auto drop-shadow-sm group-hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
          />
          <span class="text-[10px] font-bold text-[#52796f] mt-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 whitespace-nowrap">
            📖 手冊專員
          </span>
        </div>

        <!-- 對話氣泡卡片內容 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100">
            <span class="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>操作說明手冊</span>
            </span>
            <span class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
              PDF 下載
            </span>
          </div>

          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="role in ['校長', '校管理者', '學年主任', '導師', '科任教師']"
              :key="role"
              type="button"
              @click="handleDownloadManual(role)"
              class="px-2.5 py-1 bg-slate-50 hover:bg-[#52796f]/10 text-slate-700 hover:text-[#52796f] border border-slate-200/90 hover:border-[#52796f]/40 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95 shadow-2xs flex items-center gap-1"
            >
              <span>{{ role }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 【右側小女孩 👧】：登入 Q&A 與瀏覽器建議專區 -->
      <div class="relative bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/90 p-4 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3 sm:gap-4 overflow-hidden group">
        <!-- 頂部暖杏色點綴條 -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-[#c47c5d]"></div>

        <!-- 好好學習小女孩 (read_girl) -->
        <div class="shrink-0 flex flex-col items-center justify-center">
          <img
            src="/images/read_girl.png"
            alt="疑難諮詢小幫手"
            class="w-20 sm:w-24 h-auto drop-shadow-sm group-hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
          />
          <span class="text-[10px] font-bold text-[#c47c5d] mt-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70 whitespace-nowrap">
            💡 解答顧問
          </span>
        </div>

        <!-- 登入 Q&A 按鈕與瀏覽器建議 -->
        <div class="flex-1 min-w-0 space-y-2">
          <div class="flex items-center justify-between pb-1 border-b border-slate-100">
            <span class="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
              <span>疑難排解與支援</span>
            </span>
            <span class="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-semibold">
              常見問題
            </span>
          </div>

          <!-- 登入 Q&A 按鈕 -->
          <button
            type="button"
            @click="showQaModal = true"
            class="w-full px-3 py-1.5 bg-gradient-to-r from-[#c47c5d]/10 to-amber-50 hover:from-[#c47c5d]/20 hover:to-amber-100 text-[#c47c5d] border border-[#c47c5d]/30 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-between shadow-2xs active:scale-98"
          >
            <span class="flex items-center gap-1.5">
              <span class="text-sm">❓</span>
              <span>登入 Q&A 常見問題</span>
            </span>
            <span class="text-[11px] font-semibold bg-white/90 px-2 py-0.5 rounded-md border border-[#c47c5d]/20">
              點擊查看 &rarr;
            </span>
          </button>

          <!-- 瀏覽器建議 -->
          <div class="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-slate-600 flex items-center gap-1">
              <span>🌐</span> 建議使用：
            </span>
            <span class="px-1.5 py-0.5 bg-slate-100 border border-slate-200/70 rounded text-slate-700 font-medium">Chrome</span>
            <span class="px-1.5 py-0.5 bg-slate-100 border border-slate-200/70 rounded text-slate-700 font-medium">Edge</span>
            <span class="px-1.5 py-0.5 bg-slate-100 border border-slate-200/70 rounded text-slate-700 font-medium">Firefox</span>
          </div>
        </div>
      </div>

    </div>

    <!-- 登入 Q&A 彈窗 -->
    <LoginQaDialog v-model="showQaModal" />
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import LoginQaDialog from '../components/common/LoginQaDialog.vue'
import logoIcon from '@/assets/logo/saaa-logo-icon.svg'

const router = useRouter()
const route = useRoute()
const showPassword = ref(false)
const showQaModal = ref(false)

function handleDownloadManual(type) {
  ElMessage.success(`正在為您下載【${type}操作手冊.pdf】...`)
}

// 縣市選項
const cities = ['測試市', '測試縣']

// 身分選項
const roles = ['校長', '校管理者', '學年主任', '導師', '科任教師']

// 縣市與區域對應
const cityAreaMap = {
  '測試市': ['測試區'],
  '測試縣': ['測試鄉']
}

// 學校選項
const schools = ['測試國小']

const form = reactive({
  city: '測試市',
  role: '導師',
  area: '測試區',
  school: '測試國小',
  grade: '5',
  classroom: '1',
  password: ''
})

// 根據所選縣市取得可用區域
const availableAreas = computed(() => {
  if (!form.city) return []
  return cityAreaMap[form.city] || []
})

// 縣市切換時自動連動區域
function handleCityChange() {
  if (form.city === '測試市') {
    form.area = '測試區'
  } else if (form.city === '測試縣') {
    form.area = '測試鄉'
  } else {
    form.area = ''
  }
}

// 根據身分判斷是否需選年級與班級
const needsGrade = computed(() => {
  return ['學年主任', '導師', '科任教師'].includes(form.role)
})

const needsClass = computed(() => {
  return ['導師', '科任教師'].includes(form.role)
})

// 快速填入測試密碼
function fillTestPassword() {
  form.password = 'saaa.ntcu'
  ElMessage.info('已填入測試密碼：saaa.ntcu')
}

import { useAuth, buildUsername } from '../composables/useAuth'

const { login } = useAuth()

// 登入提交校驗
function handleSubmit() {
  if (!form.city) {
    ElMessage.warning('請選擇縣市')
    return
  }
  if (!form.role) {
    ElMessage.warning('請選擇身分')
    return
  }
  if (!form.password) {
    ElMessage.warning('請輸入密碼')
    return
  }

  // 驗證密碼是否為 saaa.ntcu
  if (form.password !== 'saaa.ntcu') {
    ElMessage.error('密碼錯誤！測試密碼請輸入：saaa.ntcu')
    return
  }

  const userDisplayName = buildUsername({
    city: form.city,
    school: form.school,
    role: form.role,
    grade: needsGrade.value ? form.grade : '',
    classroom: needsClass.value ? form.classroom : ''
  })

  login({
    city: form.city,
    area: form.area,
    role: form.role,
    school: form.school,
    grade: form.grade,
    classroom: form.classroom,
    username: userDisplayName
  })

  ElMessage.success(`登入成功！歡迎【${userDisplayName}】`)
  
  // 1 秒後跳轉回原頁面或首頁
  setTimeout(() => {
    const targetUrl = route.query.redirect || '/'
    router.push(targetUrl)
  }, 1000)
}
</script>
