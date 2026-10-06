<template>
  <div class="flex-1 flex flex-col justify-center items-center w-full min-h-[500px] p-2 sm:p-4 my-auto">
    <div class="w-full max-w-lg mx-auto bg-[#fcfdfa] border border-slate-200/90 rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden select-none">
      
      <!-- Top bookmark decorative tag -->
      <div class="absolute top-0 right-8 w-5 h-7 bg-[#52796f] rounded-b-md shadow-xs opacity-90"></div>

      <!-- Card Title -->
      <div class="flex items-center space-x-2.5 border-b border-slate-200/60 pb-4 mb-6">
        <div class="w-8 h-8 rounded-lg bg-[#52796f]/10 text-[#52796f] flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h2 class="text-xl font-extrabold text-slate-800 tracking-wider m-0">忘記密碼</h2>
      </div>

      <!-- Notice Banner -->
      <div class="mb-6 bg-amber-50/70 border border-amber-200/60 rounded-xl p-4 sm:p-5 flex items-start space-x-3.5">
        <svg class="w-5 h-5 text-[#c47c5d] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-xs sm:text-sm font-medium text-amber-900 leading-relaxed m-0 text-left">
          為確認您的身分，請填寫您於系統登記的 <span class="font-bold underline decoration-[#c47c5d]/50">Email 帳號</span>。確認無誤後，系統將會把重置密碼信寄送至您的信箱。
        </p>
      </div>

      <!-- Reset Password Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="flex flex-col space-y-2 text-left">
          <label for="email" class="text-xs sm:text-sm font-extrabold text-slate-700 tracking-wide pl-0.5 m-0">
            Email 信箱
          </label>
          
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              v-model="email"
              type="email"
              id="email"
              required
              placeholder="example@mail.ntcu.edu.tw"
              class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 rounded-xl focus:outline-none focus:border-[#52796f] focus:ring-4 focus:ring-[#52796f]/15 transition duration-150 shadow-inner"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-2 flex flex-col sm:flex-row gap-3">
          <router-link
            to="/logins"
            class="w-full sm:w-1/3 py-2.5 sm:py-3 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition no-underline cursor-pointer flex items-center justify-center"
          >
            返回登入
          </router-link>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full sm:w-2/3 py-2.5 sm:py-3 bg-[#52796f] hover:bg-[#354f52] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition transform active:scale-[0.99] duration-150 cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>{{ isSubmitting ? '發送中...' : '發送重置信件' }}</span>
            <svg v-if="!isSubmitting" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const email = ref('')
const isSubmitting = ref(false)

function handleSubmit() {
  if (!email.value) {
    ElMessage.warning('請輸入 Email 信箱')
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    isSubmitting.value = false
    ElMessage.success(`重置密碼信已成功寄送至 ${email.value}，請查收信件！`)
    setTimeout(() => {
      router.push('/logins')
    }, 2000)
  }, 1000)
}
</script>
