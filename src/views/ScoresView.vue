<template>
  <div class="w-full max-w-5xl mx-auto p-2 md:p-6 bg-white/80 backdrop-blur-xs rounded-2xl">
    <!-- Header title -->
    <div class="mb-4 md:mb-6 pb-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
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

    <!-- Navigation Tabs matching Dropdown Fields -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-100 scrollbar-none">
      <button
        v-for="t in scoreTabs"
        :key="t.key"
        type="button"
        @click="switchTab(t.key)"
        class="px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5"
        :class="activeTab === t.key
          ? 'bg-[#52796f] text-white shadow-xs'
          : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'"
      >
        <span>{{ t.title }}</span>
      </button>
    </div>

    <!-- TAB 1: 學生成績查詢 (預設) -->
    <div v-if="activeTab === 'inquiry'">
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

    <!-- TAB 2: 各級報表下載 -->
    <div v-else-if="activeTab === 'reports'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="rpt in reportCards" :key="rpt.title" class="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="w-9 h-9 rounded-xl bg-[#52796f]/10 text-[#52796f] flex items-center justify-center mb-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 class="text-sm font-bold text-slate-800 mb-1">{{ rpt.title }}</h4>
            <p class="text-xs text-slate-500 leading-relaxed">{{ rpt.desc }}</p>
          </div>
          <button @click="downloadSpecialReport(rpt.title)" class="mt-4 w-full py-2 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下載檔案 (PDF/XLSX)
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 3: 年度成果報告 -->
    <div v-else-if="activeTab === 'annual'" class="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <h3 class="text-base font-bold text-slate-800 mb-2">115 學年度全校施測成果報告</h3>
      <p class="text-xs text-slate-500 mb-4">彙整全校各年級、各學科整體學力指標達成率及與縣市常模參照比對分析。</p>
      <div class="flex items-center gap-3">
        <button @click="downloadSpecialReport('115學年度成果總報告書')" class="px-4 py-2 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          下載完整成果報告書 (PDF)
        </button>
      </div>
    </div>

    <!-- TAB 4: 試題分析結果 -->
    <div v-else-if="activeTab === 'analysis'" class="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <h3 class="text-base font-bold text-slate-800 mb-2">試題難易度與鑑別度分析</h3>
      <p class="text-xs text-slate-500 mb-4">針對國語文、數學、英語文各題答對率(P值)及鑑別指標(D值)進行精準診斷。</p>
      <div class="flex items-center gap-3">
        <button @click="downloadSpecialReport('試題難易度分佈清單')" class="px-4 py-2 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
          下載試題分析矩陣表 (EXCEL)
        </button>
      </div>
    </div>

    <!-- TAB 5: 背景資料分析 -->
    <div v-else-if="activeTab === 'background'" class="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <h3 class="text-base font-bold text-slate-800 mb-2">背景變項與學力表現關聯分析</h3>
      <p class="text-xs text-slate-500 mb-4">深入比對學生家庭數位環境、閱讀自主習慣與學科表現之交叉交叉統計分析。</p>
      <div class="flex items-center gap-3">
        <button @click="downloadSpecialReport('背景資料交叉分析表')" class="px-4 py-2 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
          下載背景分析圖表 (PDF)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const scoreTabs = [
  { key: 'inquiry', title: '學生成績查詢' },
  { key: 'reports', title: '各級報表下載' },
  { key: 'annual', title: '年度成果報告' },
  { key: 'analysis', title: '試題分析結果' },
  { key: 'background', title: '背景資料分析' }
]

const activeTab = ref(route.query.tab || 'inquiry')

watch(() => route.query.tab, (newTab) => {
  if (newTab && scoreTabs.some(t => t.key === newTab)) {
    activeTab.value = newTab
  }
})

function switchTab(key) {
  activeTab.value = key
  router.replace({ query: { ...route.query, tab: key } })
}

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

const reportCards = [
  { title: '全校整體成績總冊', desc: '包含各年級、班級之全科平均分數、到考率與五標常模比對總覽。' },
  { title: '年級別學力報告書', desc: '針對單一年級進行各班表現、能力指標通過率分析之主管報表。' },
  { title: '班級成績通知單清冊', desc: '可直接列印提供導師與學生家長之個別成績診斷通知單。' }
]

function handleQuery() {
  ElMessage.success('已更新查詢條件')
}

function downloadReport(item) {
  ElMessage.success(`開始下載【${item.gradeClass} ${item.subject}】成績清冊 PDF`)
}

function downloadAll() {
  ElMessage.success('已打包匯出全體選取成績清冊 EXCEL')
}

function downloadSpecialReport(name) {
  ElMessage.success(`正在產生並下載【${name}】...`)
}
</script>
