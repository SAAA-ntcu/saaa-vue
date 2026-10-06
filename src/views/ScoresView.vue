<template>
  <div class="w-full max-w-5xl mx-auto p-2 md:p-6 bg-white/80 backdrop-blur-xs rounded-2xl">
    <!-- Header title -->
    <div class="mb-6 md:mb-8 pb-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#52796f]/10 text-[#52796f] flex items-center justify-center shrink-0 shadow-xs">
          <!-- Analytics / Chart SVG -->
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl md:text-2xl font-black text-slate-800 tracking-wider m-0">
            成績專區
            <span class="text-xs md:text-sm font-medium text-slate-400 ml-1 font-mono">Score Reports & Analytics</span>
          </h2>
          <div class="h-1 w-8 bg-[#52796f] rounded-full mt-1"></div>
        </div>
      </div>

      <!-- Notice Alert -->
      <div class="bg-amber-50/80 border border-amber-200/80 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs text-amber-800">
        <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>成績查詢及下載功能僅以三年為限，請於期限內自行下載留存。</span>
      </div>
    </div>

    <!-- Filter Form -->
    <div class="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 sm:p-5 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <!-- School Year -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1.5">學年度</label>
          <select
            v-model="filters.year"
            class="w-full h-10 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition"
          >
            <option value="115">115 學年度</option>
            <option value="114">114 學年度</option>
            <option value="113">113 學年度</option>
          </select>
        </div>

        <!-- Grade -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1.5">施測年級</label>
          <select
            v-model="filters.grade"
            class="w-full h-10 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition"
          >
            <option value="all">全學年</option>
            <option value="3">三年級</option>
            <option value="4">四年級</option>
            <option value="5">五年級</option>
            <option value="6">六年級</option>
          </select>
        </div>

        <!-- Subject -->
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1.5">施測科目</label>
          <select
            v-model="filters.subject"
            class="w-full h-10 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition"
          >
            <option value="all">全部科目</option>
            <option value="國語文">國語文</option>
            <option value="數學">數學</option>
            <option value="英語文">英語文</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-end gap-2">
          <button
            @click="handleQuery"
            class="flex-1 h-10 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            查詢成績
          </button>
          <button
            @click="downloadAll"
            class="h-10 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            title="匯出查詢結果"
          >
            <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            匯出
          </button>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs bg-white">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <th class="py-3.5 px-4">學年度</th>
              <th class="py-3.5 px-4">年級/班級</th>
              <th class="py-3.5 px-4">科目</th>
              <th class="py-3.5 px-4 text-center">應測人數</th>
              <th class="py-3.5 px-4 text-center">實測人數</th>
              <th class="py-3.5 px-4 text-center">平均分數</th>
              <th class="py-3.5 px-4 text-center">通過率</th>
              <th class="py-3.5 px-4 text-center">報告下載</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
            <tr v-for="item in tableData" :key="item.id" class="hover:bg-slate-50/60 transition">
              <td class="py-3 px-4 font-mono text-slate-500">{{ item.year }}</td>
              <td class="py-3 px-4 font-bold text-slate-800">{{ item.gradeClass }}</td>
              <td class="py-3 px-4">
                <span
                  class="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                  :class="item.subject === '國語文' ? 'bg-amber-50 text-amber-700 border border-amber-200' : item.subject === '數學' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
                >
                  {{ item.subject }}
                </span>
              </td>
              <td class="py-3 px-4 text-center font-mono">{{ item.expected }}</td>
              <td class="py-3 px-4 text-center font-mono">{{ item.actual }}</td>
              <td class="py-3 px-4 text-center font-mono font-bold text-[#52796f]">{{ item.average }}</td>
              <td class="py-3 px-4 text-center">
                <div class="inline-flex items-center gap-1.5">
                  <div class="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div class="bg-[#52796f] h-full rounded-full" :style="{ width: item.passRate }"></div>
                  </div>
                  <span class="font-mono text-[11px] font-bold text-slate-600">{{ item.passRate }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  @click="downloadReport(item)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#52796f] text-[#52796f] hover:text-white border border-[#52796f]/40 hover:border-[#52796f] rounded-lg transition text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  清冊
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const filters = reactive({
  year: '115',
  grade: 'all',
  subject: 'all'
})

const tableData = ref([
  { id: 1, year: '115', gradeClass: '五年1班', subject: '國語文', expected: 28, actual: 28, average: '84.2', passRate: '89.3%' },
  { id: 2, year: '115', gradeClass: '五年1班', subject: '數學', expected: 28, actual: 27, average: '79.6', passRate: '82.1%' },
  { id: 3, year: '115', gradeClass: '五年1班', subject: '英語文', expected: 28, actual: 28, average: '88.5', passRate: '92.9%' },
  { id: 4, year: '115', gradeClass: '五年2班', subject: '國語文', expected: 27, actual: 27, average: '82.8', passRate: '85.2%' },
  { id: 5, year: '115', gradeClass: '五年2班', subject: '數學', expected: 27, actual: 27, average: '81.4', passRate: '85.2%' },
  { id: 6, year: '115', gradeClass: '五年2班', subject: '英語文', expected: 27, actual: 26, average: '86.1', passRate: '88.9%' },
  { id: 7, year: '115', gradeClass: '六年1班', subject: '國語文', expected: 29, actual: 29, average: '86.3', passRate: '93.1%' },
  { id: 8, year: '115', gradeClass: '六年1班', subject: '數學', expected: 29, actual: 29, average: '83.7', passRate: '89.7%' }
])

function handleQuery() {
  ElMessage.success('已更新查詢條件')
}

function downloadReport(item) {
  ElMessage.success(`開始下載【${item.gradeClass} ${item.subject}】成績清冊 PDF`)
}

function downloadAll() {
  ElMessage.success('已打包匯出全體選取成績清冊 EXCEL')
}
</script>
