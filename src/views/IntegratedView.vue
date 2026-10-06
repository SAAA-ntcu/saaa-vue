<template>
  <div class="w-full max-w-5xl mx-auto p-2 md:p-6 bg-white/80 backdrop-blur-xs rounded-2xl">
    <!-- Header title -->
    <div class="mb-6 md:mb-8 pb-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#52796f]/10 text-[#52796f] flex items-center justify-center shrink-0 shadow-xs">
          <!-- Integrated / Collection SVG -->
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl md:text-2xl font-black text-slate-800 tracking-wider m-0">
            綜合專區
            <span class="text-xs md:text-sm font-medium text-slate-400 ml-1 font-mono">Integrated Center</span>
          </h2>
          <div class="h-1 w-8 bg-[#52796f] rounded-full mt-1"></div>
        </div>
      </div>

      <!-- Year badge -->
      <div class="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
        當前檢測週期：115 學年度
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      <!-- Card 1: 問卷調查專區 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#52796f]/40 transition duration-200 flex flex-col justify-between group">
        <div>
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-slate-800 mb-1.5">學習態度與背景問卷</h3>
          <p class="text-xs text-slate-500 leading-relaxed m-0">包含學生學習動機、數位學習習慣與各項課外自主學習背景資料填答狀態統計。</p>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">填答率 96.4%</span>
          <button @click="showToast('問卷填答統計')" class="text-xs font-bold text-[#52796f] hover:text-[#354f52] flex items-center gap-1 cursor-pointer">
            檢視統計
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Card 2: 診斷分析專區 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#52796f]/40 transition duration-200 flex flex-col justify-between group">
        <div>
          <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-105 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-slate-800 mb-1.5">學校整體成效診斷</h3>
          <p class="text-xs text-slate-500 leading-relaxed m-0">對比全縣市常模與學校班級表現，提供弱勢指標補救教學策略與診斷圖表。</p>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">常模比對報告</span>
          <button @click="showToast('成效診斷報告')" class="text-xs font-bold text-[#52796f] hover:text-[#354f52] flex items-center gap-1 cursor-pointer">
            進入診斷
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Card 3: 操作手冊與資源 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#52796f]/40 transition duration-200 flex flex-col justify-between group">
        <div>
          <div class="w-10 h-10 rounded-xl bg-[#52796f]/10 text-[#52796f] flex items-center justify-center mb-4 group-hover:scale-105 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-base font-bold text-slate-800 mb-1.5">相關文件與手冊</h3>
          <p class="text-xs text-slate-500 leading-relaxed m-0">提供最新年度施測說明手冊、監考人員注意事項與系統操作指引下載。</p>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">共 4 份文件</span>
          <button @click="showToast('操作手冊清單')" class="text-xs font-bold text-[#52796f] hover:text-[#354f52] flex items-center gap-1 cursor-pointer">
            檔案下載
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Administrative Notices Section -->
    <div class="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-5">
      <h4 class="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-[#52796f]"></span>
        綜合專區最新公告事項
      </h4>
      <div class="space-y-2.5 text-xs text-slate-600">
        <div class="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-100">
          <span class="px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono text-[11px] shrink-0">115-08-20</span>
          <span>115學年度學生學習態度問卷調查結果已完成匯整，學校管理者可至專區下載綜合診斷報告。</span>
        </div>
        <div class="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-100">
          <span class="px-2 py-0.5 bg-slate-100 text-slate-500 rounded font-mono text-[11px] shrink-0">115-05-10</span>
          <span>若修改密碼時未顯示「更改密碼」按鈕，建議可嘗試調整瀏覽器畫面縮放比例，以顯示完整功能按鈕。</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

function showToast(feature) {
  ElMessage.info(`已前往【${feature}】`)
}
</script>
