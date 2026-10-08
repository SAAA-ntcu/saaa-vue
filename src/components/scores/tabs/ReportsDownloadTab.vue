<template>
  <div class="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative">
    <!-- Header title -->
    <div class="text-center mb-5 shrink-0">
      <h3 class="text-2xl font-bold text-slate-800 tracking-wide m-0">各級報表下載</h3>
      <div class="w-12 h-1 bg-[#52796f] mx-auto mt-2 rounded-full"></div>
      <p class="text-xs text-slate-500 mt-2">全校、年級、班級與個別學生 5 大分析報表矩陣下載專區</p>
    </div>

    <!-- Controls & Quick Actions Bar -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-5 shrink-0 px-1">
      <!-- Year Selector (3 Years Only) -->
      <div class="flex items-center gap-2 flex-wrap">
        <YearSelector
          v-model="selectedReportYear"
          :years="reportYears"
          @change="changeReportYear"
        />
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2 text-xs flex-wrap">
        <button
          type="button"
          @click="toggleSelectAllReports"
          class="px-3 py-1.5 border rounded-lg transition font-medium cursor-pointer shadow-2xs"
          :class="isAllReportsSelected
            ? 'bg-[#52796f]/15 border-[#52796f] text-[#354f52]'
            : 'bg-white border-slate-200 text-slate-700 hover:border-[#52796f] hover:text-[#52796f]'"
        >
          {{ isAllReportsSelected ? '取消全選' : `全選當年度所有報表 (${allAvailableReports.length}份)` }}
        </button>
        <button
          v-if="selectedReportCount > 0"
          type="button"
          @click="clearReportSelection"
          class="px-2.5 py-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          清除勾選 ({{ selectedReportCount }})
        </button>
        <button
          type="button"
          @click="downloadAllSchoolPackage"
          class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          title="打包下載全校當年度所有各級報表"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span>一鍵全校打包</span>
        </button>
      </div>
    </div>

    <!-- Reports Matrix Table -->
    <div class="w-full overflow-x-auto border border-slate-200/80 shadow-md rounded-xl bg-white mb-6">
      <table class="w-full text-center border-collapse min-w-[860px]">
        <thead>
          <tr class="text-xs md:text-sm font-bold text-white">
            <!-- Paper Column Header -->
            <th class="bg-[#52796f] py-3.5 px-3 tracking-wider text-left pl-5 w-44">
              卷別 / 施測科目
              <span class="text-[10px] font-normal opacity-80 block font-mono">點擊列首可全選該卷</span>
            </th>

            <!-- 5 Report Type Headers (Clickable to select whole column) -->
            <th
              v-for="rpt in reportTypes"
              :key="rpt.key"
              @click="toggleSelectReportColumn(rpt.key)"
              class="bg-[#52796f] py-3.5 px-2 tracking-wider cursor-pointer hover:bg-[#43645b] transition select-none group"
              :title="`點擊全選/取消【${rpt.name}】所有卷別`"
            >
              <div class="flex items-center justify-center gap-1.5">
                <span>{{ rpt.name }}</span>
                <span
                  class="w-3.5 h-3.5 rounded border border-white/60 flex items-center justify-center text-[10px] transition-colors"
                  :class="isReportColumnAllSelected(rpt.key) ? 'bg-white text-[#52796f]' : 'bg-transparent text-transparent'"
                >
                  ✓
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs md:text-sm font-medium text-slate-700 bg-white">
          <tr
            v-for="paper in paperGrades"
            :key="paper.key"
            class="hover:bg-slate-50/60 transition"
          >
            <!-- Paper Row Header (Clickable to select whole row) -->
            <td
              @click="toggleSelectPaperRow(paper.key)"
              class="font-bold py-3.5 px-5 text-slate-800 bg-slate-50/70 hover:bg-[#52796f]/10 cursor-pointer select-none text-left transition"
              :title="`點擊全選/取消【${paper.label}】所有報表`"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="paper.subject === '國語文' ? 'bg-amber-500' : paper.subject === '數學' ? 'bg-sky-500' : 'bg-emerald-500'"
                  ></span>
                  <span>{{ paper.label }}</span>
                </div>
                <span
                  class="w-3.5 h-3.5 rounded border border-slate-300 flex items-center justify-center text-[10px] transition-colors"
                  :class="isPaperRowAllSelected(paper.key) ? 'bg-[#52796f] border-[#52796f] text-white' : 'bg-white text-transparent'"
                >
                  ✓
                </span>
              </div>
            </td>

            <!-- 5 Report Cells -->
            <td
              v-for="rpt in reportTypes"
              :key="rpt.key"
              class="py-3 px-2 transition-colors relative"
              :class="isReportSelected(paper.key, rpt.key) ? 'bg-[#52796f]/10 ring-1 ring-inset ring-[#52796f]/25' : ''"
            >
              <!-- Available Report Cell -->
              <div v-if="isReportTypeAvailable(paper.key, rpt.key)" class="flex items-center justify-center gap-2">
                <input
                  type="checkbox"
                  :checked="isReportSelected(paper.key, rpt.key)"
                  @change="toggleReportItem(paper.key, rpt.key)"
                  class="w-4 h-4 rounded border-slate-300 text-[#52796f] focus:ring-[#52796f]/30 cursor-pointer accent-[#52796f]"
                  :aria-label="`選取 ${selectedReportYear}年 ${paper.label} ${rpt.name}`"
                />
                <!-- Direct Download Button -->
                <button
                  type="button"
                  @click="downloadSingleReportFile(paper, rpt)"
                  class="inline-flex items-center gap-1 py-1 px-2 rounded-md text-amber-700 hover:text-amber-800 hover:bg-amber-50/80 transition cursor-pointer text-xs font-semibold group/btn"
                  :title="`下載 ${paper.label} ${rpt.name}`"
                >
                  <svg class="w-3.5 h-3.5 text-amber-600 transition group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  <span class="underline decoration-amber-300 group-hover/btn:decoration-amber-600">下載</span>
                </button>
              </div>

              <!-- Unavailable Cell (e.g. 各校等級比例 for 3rd grade) -->
              <div v-else class="flex items-center justify-center text-slate-300 select-none py-1" title="未施測 / 該年級無各校等級比例常模">
                <span class="text-rose-400 text-lg leading-none select-none" aria-label="未施測">🚫</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Quick Tips Card -->
    <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <span class="text-base">💡</span>
        <span>提示：點擊上方<strong>報表欄首</strong>可全選該報表之所有學段；點擊左側<strong>卷別列首</strong>可全選該學段之所有報表；支援個別勾選與批次下載。</span>
      </div>
    </div>

    <!-- Floating Batch Download Bar -->
    <transition name="slide-up">
      <div
        v-if="selectedReportCount > 0"
        class="sticky bottom-2 left-0 right-0 z-20 mx-auto max-w-xl bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-white/10 mt-4"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="text-lg">📦</span>
          <div class="text-xs sm:text-sm font-medium truncate">
            已勾選 <span class="font-bold text-[#e9c46a] text-base">{{ selectedReportCount }}</span> 個報表檔案
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            @click="clearReportSelection"
            class="px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            @click="handleBatchReportDownload"
            :disabled="isReportDownloading"
            class="px-4 py-1.5 bg-[#52796f] hover:bg-[#43645b] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition transform active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <svg v-if="!isReportDownloading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span v-if="isReportDownloading">下載中 ({{ reportDownloadProgress.current }}/{{ reportDownloadProgress.total }})...</span>
            <span v-else>批量下載 ({{ selectedReportCount }})</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import YearSelector from '../../common/YearSelector.vue'
import { useAssessmentYear } from '../../../composables/useAssessmentYear'
import {
  reportYears,
  reportTypes,
  paperGrades,
  isReportTypeAvailable,
  getReportDownloadUrl
} from '../../../data/reportsMatrixData'
import { downloadMultipleFiles } from '../../../utils/batchDownloader'

const { activeYear: selectedReportYear, setYear: changeReportYear } = useAssessmentYear(reportYears)
const selectedReportMap = reactive(new Map())
const isReportDownloading = ref(false)
const reportDownloadProgress = reactive({ current: 0, total: 0 })

function getReportItemKey(paperKey, reportKey) {
  return `${selectedReportYear.value}_${paperKey}_${reportKey}`
}

function getReportItemObject(paper, rpt) {
  return {
    key: getReportItemKey(paper.key, rpt.key),
    year: selectedReportYear.value,
    paperKey: paper.key,
    paperLabel: paper.label,
    reportKey: rpt.key,
    reportName: rpt.name,
    name: `${selectedReportYear.value}年度_${paper.label}_${rpt.name}.pdf`,
    url: getReportDownloadUrl(selectedReportYear.value, paper.label, rpt.name)
  }
}

function isReportSelected(paperKey, reportKey) {
  return selectedReportMap.has(getReportItemKey(paperKey, reportKey))
}

function toggleReportItem(paperKey, reportKey) {
  const paper = paperGrades.find(p => p.key === paperKey)
  const rpt = reportTypes.find(r => r.key === reportKey)
  if (!paper || !rpt) return

  const key = getReportItemKey(paperKey, reportKey)
  if (selectedReportMap.has(key)) {
    selectedReportMap.delete(key)
  } else {
    selectedReportMap.set(key, getReportItemObject(paper, rpt))
  }
}

const allAvailableReports = computed(() => {
  const list = []
  paperGrades.forEach(p => {
    reportTypes.forEach(r => {
      if (isReportTypeAvailable(p.key, r.key)) {
        list.push(getReportItemObject(p, r))
      }
    })
  })
  return list
})

const selectedReportCount = computed(() => selectedReportMap.size)

const isAllReportsSelected = computed(() => {
  if (allAvailableReports.value.length === 0) return false
  return allAvailableReports.value.every(r => selectedReportMap.has(r.key))
})

function toggleSelectAllReports() {
  const allSel = isAllReportsSelected.value
  allAvailableReports.value.forEach(r => {
    if (allSel) {
      selectedReportMap.delete(r.key)
    } else {
      selectedReportMap.set(r.key, r)
    }
  })
}

function clearReportSelection() {
  selectedReportMap.clear()
}

function isReportColumnAllSelected(reportKey) {
  const avail = paperGrades.filter(p => isReportTypeAvailable(p.key, reportKey))
  if (avail.length === 0) return false
  return avail.every(p => selectedReportMap.has(getReportItemKey(p.key, reportKey)))
}

function toggleSelectReportColumn(reportKey) {
  const rpt = reportTypes.find(r => r.key === reportKey)
  const avail = paperGrades.filter(p => isReportTypeAvailable(p.key, reportKey))
  if (avail.length === 0 || !rpt) return

  const allSel = isReportColumnAllSelected(reportKey)
  avail.forEach(p => {
    const key = getReportItemKey(p.key, reportKey)
    if (allSel) {
      selectedReportMap.delete(key)
    } else {
      selectedReportMap.set(key, getReportItemObject(p, rpt))
    }
  })
}

function isPaperRowAllSelected(paperKey) {
  const avail = reportTypes.filter(r => isReportTypeAvailable(paperKey, r.key))
  if (avail.length === 0) return false
  return avail.every(r => selectedReportMap.has(getReportItemKey(paperKey, r.key)))
}

function toggleSelectPaperRow(paperKey) {
  const paper = paperGrades.find(p => p.key === paperKey)
  const avail = reportTypes.filter(r => isReportTypeAvailable(paperKey, r.key))
  if (avail.length === 0 || !paper) return

  const allSel = isPaperRowAllSelected(paperKey)
  avail.forEach(r => {
    const key = getReportItemKey(paperKey, r.key)
    if (allSel) {
      selectedReportMap.delete(key)
    } else {
      selectedReportMap.set(key, getReportItemObject(paper, r))
    }
  })
}

function downloadSingleReportFile(paper, rpt) {
  const url = getReportDownloadUrl(selectedReportYear.value, paper.label, rpt.name)
  const filename = `${selectedReportYear.value}年度_${paper.label}_${rpt.name}.pdf`
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success(`開始下載【${selectedReportYear.value}年度 ${paper.label} - ${rpt.name}】`)
}

function downloadAllSchoolPackage() {
  ElMessage.success(`已觸發打包【${selectedReportYear.value}年度 全校各級報表總包裹 (共${allAvailableReports.value.length}份)】`)
}

async function handleBatchReportDownload() {
  if (selectedReportCount.value === 0) return
  const files = Array.from(selectedReportMap.values())
  isReportDownloading.value = true
  reportDownloadProgress.current = 0
  reportDownloadProgress.total = files.length

  try {
    await downloadMultipleFiles(files, (curr, tot) => {
      reportDownloadProgress.current = curr
      reportDownloadProgress.total = tot
    })
    clearReportSelection()
  } finally {
    isReportDownloading.value = false
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
