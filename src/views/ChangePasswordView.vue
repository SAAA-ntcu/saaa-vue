<template>
  <div class="w-full max-w-3xl mx-auto p-4 md:p-8 bg-white/90 backdrop-blur-xs rounded-2xl">
    <!-- Header title -->
    <div class="mb-8 text-center">
      <h2 class="text-xl md:text-2xl font-bold text-slate-800 tracking-wider m-0">
        更改密碼
      </h2>
      <div class="h-1 w-12 bg-[#52796f] rounded-full mx-auto mt-2"></div>
    </div>

    <!-- Password Change Form -->
    <form @submit.prevent="handleSubmit" class="max-w-xl mx-auto space-y-5">
      <!-- 姓名 (Readonly) -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">姓名</label>
        <input
          type="text"
          :value="state.username"
          disabled
          class="w-full h-11 px-3.5 text-xs text-slate-500 bg-slate-100/80 border border-slate-200 rounded-xl cursor-not-allowed select-none"
        />
      </div>

      <!-- 更新密碼 -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">更新密碼</label>
        <div class="relative flex items-center">
          <input
            v-model="form.newPassword"
            :type="showNewPw ? 'text' : 'password'"
            placeholder="請輸入新密碼"
            required
            class="w-full h-11 px-3.5 pr-10 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 outline-none transition"
          />
          <button
            type="button"
            @click="showNewPw = !showNewPw"
            class="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            aria-label="切換密碼顯示"
          >
            <!-- Eye slash -->
            <svg v-if="!showNewPw" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
            </svg>
            <!-- Eye -->
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 確認密碼 -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">確認密碼</label>
        <div class="relative flex items-center">
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPw ? 'text' : 'password'"
            placeholder="請再次輸入新密碼"
            required
            class="w-full h-11 px-3.5 pr-10 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 outline-none transition"
          />
          <button
            type="button"
            @click="showConfirmPw = !showConfirmPw"
            class="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            aria-label="切換密碼顯示"
          >
            <!-- Eye slash -->
            <svg v-if="!showConfirmPw" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
            </svg>
            <!-- Eye -->
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 信箱地址 -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1.5">信箱地址</label>
        <input
          v-model="form.email"
          type="email"
          placeholder=""
          required
          class="w-full h-11 px-3.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 outline-none transition"
        />
      </div>

      <!-- 密碼設定安全提示 (Screenshot 1 matching box) -->
      <div class="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 text-xs">
        <div class="flex items-center gap-1.5 text-amber-800 font-bold mb-1">
          <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>密碼設定安全提示</span>
        </div>
        <p class="text-slate-600 text-[11px] mb-3 leading-relaxed">
          密碼長度應至少 8 碼，並包含下列四類字元的三種：
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
          <div class="px-2.5 py-1.5 bg-white/80 rounded-lg border border-amber-100">
            (1) 大寫英文字母 A-Z
          </div>
          <div class="px-2.5 py-1.5 bg-white/80 rounded-lg border border-amber-100">
            (2) 小寫英文字母 a-z
          </div>
          <div class="px-2.5 py-1.5 bg-white/80 rounded-lg border border-amber-100">
            (3) 數字 0-9
          </div>
          <div class="px-2.5 py-1.5 bg-white/80 rounded-lg border border-amber-100">
            (4) 特殊符號 !@#$%^&*
          </div>
        </div>
      </div>

      <!-- Submit button -->
      <div class="pt-2 text-center">
        <button
          type="submit"
          class="px-8 py-2.5 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
        >
          更改密碼
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { state } = useAuth()

const showNewPw = ref(false)
const showConfirmPw = ref(false)

const form = reactive({
  newPassword: '',
  confirmPassword: '',
  email: ''
})

function handleSubmit() {
  if (form.newPassword.length < 8) {
    ElMessage.warning('密碼長度應至少 8 碼')
    return
  }
  if (form.newPassword !== form.confirmPassword) {
    ElMessage.error('兩次輸入的密碼不一致，請重新確認！')
    return
  }
  if (!form.email) {
    ElMessage.warning('請輸入有效的信箱地址')
    return
  }

  ElMessage.success('密碼修改成功！下次登入請使用新密碼。')
  setTimeout(() => {
    router.push('/')
  }, 1200)
}
</script>
