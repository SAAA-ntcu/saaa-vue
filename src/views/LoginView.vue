<template>
  <div class="flex-1 flex flex-col justify-center items-center w-full min-h-[500px] p-2 sm:p-4 bg-slate-50/50 rounded-xl">
    <div class="w-full max-w-[920px] bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-300">
      
      <!-- Top Morandi accent gradient line -->
      <div class="h-1.5 w-full bg-gradient-to-r from-[#729289] to-[#52796f]"></div>

      <!-- Card Header -->
      <div class="px-8 pt-6 pb-2 text-center">
        <h3 class="text-xl font-bold text-slate-800 tracking-wider m-0">歡迎登入系統</h3>
        <p class="text-xs text-slate-400 mt-1 mb-0">請選擇您的單位與身分以開始檢測</p>
      </div>

      <!-- Form Body -->
      <div class="p-6 md:p-8 space-y-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- City & Role row -->
          <div class="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-[480px] mx-auto">
            <!-- City -->
            <div class="w-full relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200">
              <div class="pl-3.5 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 mr-2">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                縣市
              </div>
              <select
                v-model="form.city"
                class="w-full bg-transparent px-2 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4"
              >
                <option value="">請選擇縣市</option>
                <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <!-- Role -->
            <div class="w-full relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200">
              <div class="pl-3.5 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 mr-2">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                身分
              </div>
              <select
                v-model="form.role"
                class="w-full bg-transparent px-2 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4"
              >
                <option value="">請選擇身分</option>
                <option value="student">學生</option>
                <option value="teacher">教師</option>
                <option value="school_admin">學校管理者</option>
                <option value="city_admin">縣市管理者</option>
              </select>
            </div>
          </div>

          <div class="border-t border-slate-100 my-2"></div>

          <!-- Secondary Fields Grid -->
          <div class="flex flex-wrap items-center gap-2.5 w-full">
            <!-- Area -->
            <div class="flex-auto md:flex-1 min-w-[110px] w-full sm:w-auto relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200 overflow-hidden">
              <div class="pl-3 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 h-full whitespace-nowrap">
                區域
              </div>
              <select v-model="form.area" class="w-full h-full bg-transparent px-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4">
                <option value="">全部區域</option>
                <option value="central">中區</option>
                <option value="north">北區</option>
                <option value="south">南區</option>
                <option value="east">東區</option>
              </select>
            </div>

            <!-- School -->
            <div class="flex-auto md:flex-1 min-w-[110px] w-full sm:w-auto relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200 overflow-hidden">
              <div class="pl-3 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 h-full whitespace-nowrap">
                學校
              </div>
              <select v-model="form.school" class="w-full h-full bg-transparent px-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4">
                <option value="">市立仁愛國小</option>
                <option value="忠孝國小">市立忠孝國小</option>
                <option value="和平國小">市立和平國小</option>
                <option value="信義國中">市立信義國中</option>
              </select>
            </div>

            <!-- Grade -->
            <div class="flex-auto md:flex-1 min-w-[110px] w-full sm:w-auto relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200 overflow-hidden">
              <div class="pl-3 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 h-full whitespace-nowrap">
                年級
              </div>
              <select v-model="form.grade" class="w-full h-full bg-transparent px-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4">
                <option value="">請選擇</option>
                <option value="3">三年級</option>
                <option value="4">四年級</option>
                <option value="5">五年級</option>
                <option value="6">六年級</option>
                <option value="7">七年級</option>
                <option value="8">八年級</option>
              </select>
            </div>

            <!-- Class -->
            <div class="flex-auto md:flex-1 min-w-[110px] w-full sm:w-auto relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200 overflow-hidden">
              <div class="pl-3 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 h-full whitespace-nowrap">
                班級
              </div>
              <select v-model="form.classroom" class="w-full h-full bg-transparent px-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4">
                <option value="">請選擇</option>
                <option v-for="c in 10" :key="c" :value="c">{{ c }} 班</option>
              </select>
            </div>

            <!-- Seat -->
            <div class="flex-auto md:flex-1 min-w-[110px] w-full sm:w-auto relative flex items-center border border-slate-200 rounded-xl bg-slate-50/50 h-11 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15 transition-all duration-200 overflow-hidden">
              <div class="pl-3 pr-2 text-slate-400 shrink-0 select-none flex items-center text-xs font-medium border-r border-slate-200/60 h-full whitespace-nowrap">
                座號
              </div>
              <select v-model="form.seat" class="w-full h-full bg-transparent px-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer pr-4">
                <option value="">請選擇</option>
                <option v-for="s in 35" :key="s" :value="s">{{ s }} 號</option>
              </select>
            </div>
          </div>

          <!-- Password Field with eye toggle -->
          <div class="w-full max-w-[560px] mx-auto pt-2">
            <label for="password" class="block text-xs font-medium text-slate-500 tracking-wider text-left mb-1.5 pl-1 select-none">
              密碼
            </label>
            <div class="grid grid-cols-[1fr_50px] w-full border rounded-xl h-11 transition-all duration-200 overflow-hidden shadow-xs border-slate-200 bg-slate-50/50 focus-within:bg-white focus-within:border-[#52796f] focus-within:ring-4 focus-within:ring-[#52796f]/15">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="請輸入密碼"
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

          <!-- Submit Button -->
          <div class="text-center pt-2 max-w-[120px] mx-auto">
            <button
              type="submit"
              class="w-full bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold py-2.5 rounded-lg shadow-md shadow-[#52796f]/20 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 tracking-widest cursor-pointer"
            >
              登入
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const showPassword = ref(false)

const cities = [
  '臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市',
  '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣',
  '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'
]

const form = reactive({
  city: '',
  role: 'student',
  area: '',
  school: '市立仁愛國小',
  grade: '5',
  classroom: '1',
  seat: '1',
  password: ''
})

function handleSubmit() {
  if (!form.password) {
    ElMessage.warning('請輸入密碼')
    return
  }
  ElMessage.success('登入成功（前端模擬模式）')
}
</script>
