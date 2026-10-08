<template>
  <div class="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative">
    <!-- Header title matching Image 1 -->
    <div class="text-center mb-5 shrink-0">
      <h3 class="text-2xl font-bold text-slate-800 tracking-wide m-0">成果報告</h3>
      <div class="w-12 h-1 bg-[#52796f] mx-auto mt-2 rounded-full"></div>
    </div>

    <!-- Year Selection & Batch Selection Controls Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 shrink-0 px-1">
      <!-- Year Selection (Recent 3 Years Pills + Historical Dropdown) -->
      <YearSelector
        v-model="selectedAnnualYear"
        :years="annualReportYears"
        @change="changeAnnualYear"
      />

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2 text-xs shrink-0">
        <button
          type="button"
          @click="toggleSelectAllAnnualYear"
          class="px-3 py-1.5 border rounded-lg transition font-medium cursor-pointer shadow-2xs"
          :class="isAllCurrentAnnualYearSelected
            ? 'bg-[#52796f]/15 border-[#52796f] text-[#354f52]'
            : 'bg-white border-slate-200 text-slate-700 hover:border-[#52796f] hover:text-[#52796f]'"
        >
          {{ isAllCurrentAnnualYearSelected ? '取消當年度全選' : `全選 ${selectedAnnualYear} 年度成果報告 (${currentYearAvailableCount}份)` }}
        </button>
        <button
          v-if="selectedAnnualCount > 0"
          type="button"
          @click="clearAnnualSelection"
          class="px-2.5 py-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          清除勾選 ({{ selectedAnnualCount }})
        </button>
      </div>
    </div>

    <!-- Data Matrix Table matching Image 1 -->
    <div class="w-full overflow-x-auto border border-slate-200/80 shadow-md rounded-xl bg-white mb-6">
      <table class="w-full text-center border-collapse min-w-[760px]">
        <thead>
          <tr class="text-xs md:text-sm font-bold text-white">
            <th class="bg-[#52796f] py-3.5 px-3 tracking-wider text-left pl-5 w-28">
              科目
              <span class="text-[10px] font-normal opacity-80 block font-mono">點擊列首全選</span>
            </th>
            <th
              v-for="grade in annualGradesHeader.filter(g => isGradeHasAvailableItems(g.key))"
              :key="grade.key"
              @click="toggleSelectAnnualGrade(grade.key)"
              class="bg-[#52796f] py-3.5 px-2 tracking-wider select-none transition group cursor-pointer hover:bg-[#43645b]"
              :title="`點擊全選/取消 ${grade.label}`"
            >
              <div class="flex items-center justify-center gap-1.5">
                <span>{{ grade.label }}</span>
                <span
                  class="w-3.5 h-3.5 rounded border border-white/60 flex items-center justify-center text-[10px] transition-colors"
                  :class="isGradeAllSelected(grade.key) ? 'bg-white text-[#52796f]' : 'bg-transparent text-transparent'"
                >
                  ✓
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs md:text-sm font-medium text-slate-700 bg-white">
          <tr
            v-for="subject in annualReportSubjects.filter(s => isSubjectHasAvailableItems(s.name))"
            :key="subject.name"
            class="hover:bg-slate-50/60 transition"
          >
            <!-- Subject Row Header (Clickable to select whole row if available items exist) -->
            <td
              @click="toggleSelectAnnualSubject(subject.name)"
              class="font-bold py-3 px-5 text-slate-800 bg-slate-50/70 select-none text-left transition cursor-pointer hover:bg-[#52796f]/10"
              :title="`點擊全選/取消 ${subject.name}`"
            >
              <div class="flex items-center justify-between gap-2">
                <span>{{ subject.name }}</span>
                <span
                  class="w-3.5 h-3.5 rounded border border-slate-300 flex items-center justify-center text-[10px] transition-colors"
                  :class="isSubjectAllSelected(subject.name) ? 'bg-[#52796f] border-[#52796f] text-white' : 'bg-white text-transparent'"
                >
                  ✓
                </span>
              </div>
            </td>

            <!-- Grade Cells -->
            <td
              v-for="grade in annualGradesHeader.filter(g => isGradeHasAvailableItems(g.key))"
              :key="grade.key"
              class="py-3 px-2 transition-colors relative"
              :class="isAnnualSelected(grade.key, subject.name) ? 'bg-[#52796f]/10 ring-1 ring-inset ring-[#52796f]/25' : ''"
            >
              <!-- Available: Checkbox + Download Button matching Screenshot 1 -->
              <div v-if="isAnnualReportAvailable(selectedAnnualYear, grade.key, subject.name)" class="flex items-center justify-center gap-2">
                <input
                  type="checkbox"
                  :checked="isAnnualSelected(grade.key, subject.name)"
                  @change="toggleAnnualItem(grade.key, subject.name, grade.label)"
                  class="w-4 h-4 rounded border-slate-300 text-[#52796f] focus:ring-[#52796f]/30 cursor-pointer accent-[#52796f]"
                  :aria-label="`選取 ${selectedAnnualYear}年 ${grade.label} ${subject.name}`"
                />
                <button
                  type="button"
                  @click="downloadSingleAnnualReport(selectedAnnualYear, grade.label, subject.name)"
                  class="inline-flex items-center gap-1 py-1 px-2 rounded-md text-amber-700 hover:text-amber-800 hover:bg-amber-50/80 transition cursor-pointer text-xs font-semibold group/btn"
                  title="點擊單檔下載成果報告"
                >
                  <svg class="w-3.5 h-3.5 text-amber-600 transition group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  <span class="underline decoration-amber-300 group-hover/btn:decoration-amber-600">下載</span>
                </button>
              </div>

              <!-- Not Available: Prohibited icon 🚫 (未施測) matching Screenshot 1 -->
              <div v-else class="flex items-center justify-center text-slate-300 select-none py-1" title="未施測 / 無資料">
                <span class="text-rose-400 text-lg leading-none select-none" aria-label="未施測">🚫</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Floating Batch Download Bar -->
    <transition name="slide-up">
      <div
        v-if="selectedAnnualCount > 0"
        class="sticky bottom-2 left-0 right-0 z-20 mx-auto max-w-xl bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-white/10 mt-4"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="text-lg">📦</span>
          <div class="text-xs sm:text-sm font-medium truncate">
            已勾選 <span class="font-bold text-[#e9c46a] text-base">{{ selectedAnnualCount }}</span> 個成果報告
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            @click="clearAnnualSelection"
            class="px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            @click="handleAnnualBatchDownload"
            :disabled="isAnnualDownloading"
            class="px-4 py-1.5 bg-[#52796f] hover:bg-[#43645b] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition transform active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <svg v-if="!isAnnualDownloading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span v-if="isAnnualDownloading">下載中 ({{ annualDownloadProgress.current }}/{{ annualDownloadProgress.total }})...</span>
            <span v-else>批量下載 ({{ selectedAnnualCount }})</span>
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
  annualReportYears,
  annualReportSubjects,
  annualGradesHeader,
  isAnnualReportAvailable,
  getAnnualReportDownloadUrl
} from '../../../data/annualReportData'
import { downloadMultipleFiles } from '../../../utils/batchDownloader'

const { activeYear: selectedAnnualYear, setYear: changeAnnualYear } = useAssessmentYear(annualReportYears)
const selectedAnnualMap = reactive(new Map())
const isAnnualDownloading = ref(false)
const annualDownloadProgress = reactive({ current: 0, total: 0 })

function getAnnualItemKey(year, gradeKey, subjectName) {
  return `${year}_${subjectName}_${gradeKey}`
}

function getAnnualItemObject(year, gradeKey, subjectName, gradeLabel) {
  return {
    key: getAnnualItemKey(year, gradeKey, subjectName),
    year,
    gradeKey,
    subjectName,
    gradeLabel,
    name: `${year}年度縣市學生學習能力檢測成果報告_${gradeLabel}_${subjectName}.pdf`,
    url: getAnnualReportDownloadUrl(year, gradeLabel, subjectName)
  }
}

function isAnnualSelected(gradeKey, subjectName) {
  return selectedAnnualMap.has(getAnnualItemKey(selectedAnnualYear.value, gradeKey, subjectName))
}

function toggleAnnualItem(gradeKey, subjectName, gradeLabel) {
  const key = getAnnualItemKey(selectedAnnualYear.value, gradeKey, subjectName)
  if (selectedAnnualMap.has(key)) {
    selectedAnnualMap.delete(key)
  } else {
    selectedAnnualMap.set(key, getAnnualItemObject(selectedAnnualYear.value, gradeKey, subjectName, gradeLabel))
  }
}

const currentYearAvailableItems = computed(() => {
  const list = []
  annualGradesHeader.forEach((g) => {
    annualReportSubjects.forEach((s) => {
      if (isAnnualReportAvailable(selectedAnnualYear.value, g.key, s.name)) {
        list.push({ gradeKey: g.key, gradeLabel: g.label, subjectName: s.name })
      }
    })
  })
  return list
})

const currentYearAvailableCount = computed(() => currentYearAvailableItems.value.length)

const isAllCurrentAnnualYearSelected = computed(() => {
  if (currentYearAvailableItems.value.length === 0) return false
  return currentYearAvailableItems.value.every((item) =>
    selectedAnnualMap.has(getAnnualItemKey(selectedAnnualYear.value, item.gradeKey, item.subjectName))
  )
})

function toggleSelectAllAnnualYear() {
  const allSelected = isAllCurrentAnnualYearSelected.value
  currentYearAvailableItems.forEach((item) => {
    const key = getAnnualItemKey(selectedAnnualYear.value, item.gradeKey, item.subjectName)
    if (allSelected) {
      selectedAnnualMap.delete(key)
    } else {
      selectedAnnualMap.set(key, getAnnualItemObject(selectedAnnualYear.value, item.gradeKey, item.subjectName, item.gradeLabel))
    }
  })
}

function isGradeHasAvailableItems(gradeKey) {
  return annualReportSubjects.some((s) => isAnnualReportAvailable(selectedAnnualYear.value, gradeKey, s.name))
}

function isGradeAllSelected(gradeKey) {
  const avail = annualReportSubjects.filter((s) => isAnnualReportAvailable(selectedAnnualYear.value, gradeKey, s.name))
  if (avail.length === 0) return false
  return avail.every((s) => selectedAnnualMap.has(getAnnualItemKey(selectedAnnualYear.value, gradeKey, s.name)))
}

function toggleSelectAnnualGrade(gradeKey) {
  const gradeObj = annualGradesHeader.find((g) => g.key === gradeKey)
  const avail = annualReportSubjects.filter((s) => isAnnualReportAvailable(selectedAnnualYear.value, gradeKey, s.name))
  if (avail.length === 0) return
  const allSelected = isGradeAllSelected(gradeKey)
  avail.forEach((s) => {
    const key = getAnnualItemKey(selectedAnnualYear.value, gradeKey, s.name)
    if (allSelected) {
      selectedAnnualMap.delete(key)
    } else {
      selectedAnnualMap.set(key, getAnnualItemObject(selectedAnnualYear.value, gradeKey, s.name, gradeObj?.label || gradeKey))
    }
  })
}

function isSubjectHasAvailableItems(subjectName) {
  return annualGradesHeader.some((g) => isAnnualReportAvailable(selectedAnnualYear.value, g.key, subjectName))
}

function isSubjectAllSelected(subjectName) {
  const avail = annualGradesHeader.filter((g) => isAnnualReportAvailable(selectedAnnualYear.value, g.key, subjectName))
  if (avail.length === 0) return false
  return avail.every((g) => selectedAnnualMap.has(getAnnualItemKey(selectedAnnualYear.value, g.key, subjectName)))
}

function toggleSelectAnnualSubject(subjectName) {
  const avail = annualGradesHeader.filter((g) => isAnnualReportAvailable(selectedAnnualYear.value, g.key, subjectName))
  if (avail.length === 0) return
  const allSelected = isSubjectAllSelected(subjectName)
  avail.forEach((g) => {
    const key = getAnnualItemKey(selectedAnnualYear.value, g.key, subjectName)
    if (allSelected) {
      selectedAnnualMap.delete(key)
    } else {
      selectedAnnualMap.set(key, getAnnualItemObject(selectedAnnualYear.value, g.key, subjectName, g.label))
    }
  })
}

const selectedAnnualCount = computed(() => selectedAnnualMap.size)

function clearAnnualSelection() {
  selectedAnnualMap.clear()
}

function downloadSingleAnnualReport(year, gradeLabel, subject) {
  const url = getAnnualReportDownloadUrl(year, gradeLabel, subject)
  const filename = `${year}年度縣市學生學習能力檢測成果報告_${gradeLabel}_${subject}.pdf`
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success(`開始下載【${year}年度 ${gradeLabel} ${subject}】成果報告`)
}

async function handleAnnualBatchDownload() {
  if (selectedAnnualCount.value === 0) return
  const files = Array.from(selectedAnnualMap.values())
  isAnnualDownloading.value = true
  annualDownloadProgress.current = 0
  annualDownloadProgress.total = files.length

  try {
    await downloadMultipleFiles(files, (curr, tot) => {
      annualDownloadProgress.current = curr
      annualDownloadProgress.total = tot
    })
    clearAnnualSelection()
  } finally {
    isAnnualDownloading.value = false
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
