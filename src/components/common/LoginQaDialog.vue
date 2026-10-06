<template>
  <el-dialog
    v-model="visible"
    title="登入常見問題與解答 (Q&A)"
    width="640px"
    class="rounded-2xl overflow-hidden"
    append-to-body
  >
    <div class="space-y-4 text-xs text-slate-700 py-1">
      <!-- 搜尋與快選標籤 -->
      <div class="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center gap-2.5 text-amber-900">
        <svg class="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>如果您在登入過程中遇到問題，請先參考下列解答；若仍無法排除，可撥打客服專線 (04) 2218-8100 洽詢。</span>
      </div>

      <!-- FAQ Items Accordion / Cards -->
      <div class="space-y-3">
        <!-- Q1 -->
        <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
          <div class="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span class="w-5 h-5 rounded-md bg-[#52796f] text-white flex items-center justify-center text-xs font-mono shrink-0">Q1</span>
            <span>忘記登入密碼該如何處理？</span>
          </div>
          <p class="text-slate-600 pl-7 m-0 leading-relaxed">
            • <strong>導師 / 科任教師</strong>：請洽貴校「校管理者」至【教師帳號管理】中協助重設密碼。<br />
            • <strong>校長 / 校管理者</strong>：請點選登入畫面下方之「忘記密碼」按鈕，輸入單位公務信箱進行密碼重設驗證。
          </p>
        </div>

        <!-- Q2 -->
        <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
          <div class="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span class="w-5 h-5 rounded-md bg-[#52796f] text-white flex items-center justify-center text-xs font-mono shrink-0">Q2</span>
            <span>初次登入系統的預設密碼是什麼？</span>
          </div>
          <p class="text-slate-600 pl-7 m-0 leading-relaxed">
            初次登入預設密碼請參閱各校發放之開通信件或操作手冊。首次登入成功後，為維護學生個資安全，系統會強制引導進行密碼變更。
          </p>
        </div>

        <!-- Q3 -->
        <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
          <div class="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span class="w-5 h-5 rounded-md bg-[#52796f] text-white flex items-center justify-center text-xs font-mono shrink-0">Q3</span>
            <span>下拉選單中找不到所屬學校或任教班級？</span>
          </div>
          <p class="text-slate-600 pl-7 m-0 leading-relaxed">
            請先確認上方「縣市」與「區域」是否選擇正確；若已正確仍未顯示貴校，請由學校承辦主管洽詢縣市教育局處學力檢測承辦人員開通受測名冊。
          </p>
        </div>

        <!-- Q4 -->
        <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
          <div class="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span class="w-5 h-5 rounded-md bg-[#52796f] text-white flex items-center justify-center text-xs font-mono shrink-0">Q4</span>
            <span>建議使用的瀏覽器環境？</span>
          </div>
          <p class="text-slate-600 pl-7 m-0 leading-relaxed">
            為獲得最佳數據圖表繪製效能與報表匯出穩定度，強烈建議使用最新版 <strong>Google Chrome</strong>、<strong>Microsoft Edge</strong> 或 <strong>Mozilla Firefox</strong>。請避免使用舊版 Internet Explorer (IE)。
          </p>
        </div>

        <!-- Q5 -->
        <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
          <div class="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span class="w-5 h-5 rounded-md bg-[#52796f] text-white flex items-center justify-center text-xs font-mono shrink-0">Q5</span>
            <span>系統提示「帳號已過期」或「無法連線」？</span>
          </div>
          <p class="text-slate-600 pl-7 m-0 leading-relaxed">
            教師帳號依年度建置，若效期過期請洽校管理者更新有效訖日；若顯示網段受限，請確認是否透過校內學術網路連線登入。
          </p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
