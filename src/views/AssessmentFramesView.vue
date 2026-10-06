<template>
  <div class="flex-1 flex flex-col max-h-[620px] overflow-y-auto pr-2 w-full relative">
    <!-- Header title -->
    <div class="text-center mb-5 md:mb-6 shrink-0">
      <h2 class="text-2xl md:text-3xl font-bold text-slate-800 tracking-wide m-0">
        評量架構
      </h2>
      <div class="w-12 md:w-16 h-1 bg-[#52796f] mx-auto mt-2 rounded-full"></div>
    </div>

    <!-- Year Selection & Batch Selection Controls Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 shrink-0 px-1">
      <!-- Year Selection (Recent 3 Years Pills + Historical Dropdown) -->
      <YearSelector
        v-model="selectedYear"
        :years="assessmentYears"
        @change="changeYear"
      />

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-2 text-xs shrink-0">
        <button
          type="button"
          @click="toggleSelectAllYear"
          class="px-3 py-1.5 border rounded-lg transition font-medium cursor-pointer shadow-2xs"
          :class="isAllCurrentYearSelected
            ? 'bg-[#52796f]/15 border-[#52796f] text-[#354f52]'
            : 'bg-white border-slate-200 text-slate-700 hover:border-[#52796f] hover:text-[#52796f]'"
        >
          {{ isAllCurrentYearSelected ? '取消當年度全選' : `全選 ${selectedYear} 年度 (24份)` }}
        </button>
        <button
          v-if="selectedCount > 0"
          type="button"
          @click="clearSelection"
          class="px-2.5 py-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
        >
          清除勾選 ({{ selectedCount }})
        </button>
      </div>
    </div>

    <!-- Data Matrix Table -->
    <div class="w-full overflow-x-auto border border-slate-200/80 shadow-md rounded-xl bg-white mb-20">
      <table class="w-full text-center border-collapse min-w-[850px]">
        <thead>
          <tr class="text-xs md:text-sm font-bold text-white">
            <th class="bg-[#52796f] py-3 px-3 tracking-wider text-left pl-4">
              科目
              <span class="text-[10px] font-normal opacity-80 block font-mono">點擊列首可全選</span>
            </th>
            <th
              v-for="grade in gradesHeader"
              :key="grade.key"
              @click="toggleSelectGrade(grade.gradeName)"
              class="bg-[#52796f] py-3 px-2 tracking-wider cursor-pointer hover:bg-[#43645b] transition select-none group"
              :title="`點擊全選/取消 ${grade.label}`"
            >
              <div class="flex items-center justify-center gap-1">
                <span>{{ grade.label }}</span>
                <span
                  class="w-3.5 h-3.5 rounded border border-white/60 flex items-center justify-center text-[10px] transition-colors"
                  :class="isGradeAllSelected(grade.gradeName) ? 'bg-white text-[#52796f]' : 'bg-transparent text-transparent'"
                >
                  ✓
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs md:text-sm font-medium text-slate-700 bg-white">
          <tr
            v-for="subject in assessmentSubjects"
            :key="subject.name"
            class="hover:bg-slate-50/60 transition"
          >
            <!-- Subject Row Header (Clickable to select whole row) -->
            <td
              @click="toggleSelectSubject(subject.name)"
              class="font-bold py-3 px-4 text-slate-800 bg-slate-50/70 hover:bg-[#52796f]/10 cursor-pointer transition select-none text-left"
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
              v-for="grade in gradesHeader"
              :key="grade.key"
              class="py-2.5 px-2 transition-colors relative"
              :class="isSelected(grade.gradeName, subject.name) ? 'bg-[#52796f]/10 ring-1 ring-inset ring-[#52796f]/25' : ''"
            >
              <div class="flex items-center justify-center gap-2">
                <!-- Checkbox for batch selection -->
                <input
                  type="checkbox"
                  :checked="isSelected(grade.gradeName, subject.name)"
                  @change="toggleItem(grade.gradeName, subject.name)"
                  class="w-4 h-4 rounded border-slate-300 text-[#52796f] focus:ring-[#52796f]/30 cursor-pointer accent-[#52796f]"
                  :aria-label="`選取 ${selectedYear}年 ${grade.label} ${subject.name}`"
                />

                <!-- Single File Download Link -->
                <a
                  :href="getAssessmentDownloadUrl(selectedYear, grade.gradeName, subject.name)"
                  target="_blank"
                  class="inline-flex items-center space-x-1 py-1 px-2 rounded-md text-slate-600 hover:text-[#52796f] hover:bg-white/80 transition no-underline text-xs"
                  title="直接單檔下載"
                >
                  <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-[#52796f] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  <span class="underline decoration-slate-300">下載</span>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Floating Batch Download Bar -->
    <transition name="slide-up">
      <div
        v-if="selectedCount > 0"
        class="sticky bottom-2 left-0 right-0 z-20 mx-auto max-w-xl bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-white/10"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="text-lg">📦</span>
          <div class="text-xs sm:text-sm font-medium truncate">
            已勾選 <span class="font-bold text-[#e9c46a] text-base">{{ selectedCount }}</span> 個檔案
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            @click="clearSelection"
            class="px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            @click="handleBatchDownload"
            :disabled="isDownloading"
            class="px-4 py-1.5 bg-[#52796f] hover:bg-[#43645b] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition transform active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <svg v-if="!isDownloading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span v-if="isDownloading">下載中 ({{ downloadProgress.current }}/{{ downloadProgress.total }})...</span>
            <span v-else>批量下載 ({{ selectedCount }})</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import YearSelector from '../components/common/YearSelector.vue'
import { useAssessmentYear } from '../composables/useAssessmentYear'
import {
  assessmentYears,
  assessmentSubjects,
  gradesHeader,
  getAssessmentDownloadUrl
} from '../data/assessmentData'
import { downloadMultipleFiles } from '../utils/batchDownloader'

const { activeYear: selectedYear, setYear: changeYear } = useAssessmentYear(assessmentYears)
const selectedMap = reactive(new Map())
const isDownloading = ref(false)
const downloadProgress = reactive({ current: 0, total: 0 })

function getItemKey(year, gradeName, subjectName) {
  return `${year}_${subjectName}_${gradeName}`
}

function getItemObject(year, gradeName, subjectName) {
  return {
    key: getItemKey(year, gradeName, subjectName),
    year,
    gradeName,
    subjectName,
    name: `${year}年度縣市學生學習能力檢測_${gradeName}${subjectName}.pdf`,
    url: getAssessmentDownloadUrl(year, gradeName, subjectName)
  }
}

function isSelected(gradeName, subjectName) {
  return selectedMap.has(getItemKey(selectedYear.value, gradeName, subjectName))
}

function toggleItem(gradeName, subjectName) {
  const key = getItemKey(selectedYear.value, gradeName, subjectName)
  if (selectedMap.has(key)) {
    selectedMap.delete(key)
  } else {
    selectedMap.set(key, getItemObject(selectedYear.value, gradeName, subjectName))
  }
}

// Grade Column Select
function isGradeAllSelected(gradeName) {
  return assessmentSubjects.every((s) =>
    selectedMap.has(getItemKey(selectedYear.value, gradeName, s.name))
  )
}

function toggleSelectGrade(gradeName) {
  const allSelected = isGradeAllSelected(gradeName)
  assessmentSubjects.forEach((s) => {
    const key = getItemKey(selectedYear.value, gradeName, s.name)
    if (allSelected) {
      selectedMap.delete(key)
    } else {
      selectedMap.set(key, getItemObject(selectedYear.value, gradeName, s.name))
    }
  })
}

// Subject Row Select
function isSubjectAllSelected(subjectName) {
  return gradesHeader.every((g) =>
    selectedMap.has(getItemKey(selectedYear.value, g.gradeName, subjectName))
  )
}

function toggleSelectSubject(subjectName) {
  const allSelected = isSubjectAllSelected(subjectName)
  gradesHeader.forEach((g) => {
    const key = getItemKey(selectedYear.value, g.gradeName, subjectName)
    if (allSelected) {
      selectedMap.delete(key)
    } else {
      selectedMap.set(key, getItemObject(selectedYear.value, g.gradeName, subjectName))
    }
  })
}

// Current Year Select All
const isAllCurrentYearSelected = computed(() => {
  return assessmentSubjects.every((s) =>
    gradesHeader.every((g) =>
      selectedMap.has(getItemKey(selectedYear.value, g.gradeName, s.name))
    )
  )
})

function toggleSelectAllYear() {
  const allSelected = isAllCurrentYearSelected.value
  assessmentSubjects.forEach((s) => {
    gradesHeader.forEach((g) => {
      const key = getItemKey(selectedYear.value, g.gradeName, s.name)
      if (allSelected) {
        selectedMap.delete(key)
      } else {
        selectedMap.set(key, getItemObject(selectedYear.value, g.gradeName, s.name))
      }
    })
  })
}

function clearSelection() {
  selectedMap.clear()
}


const selectedCount = computed(() => selectedMap.size)

async function handleBatchDownload() {
  if (selectedMap.size === 0 || isDownloading.value) return
  isDownloading.value = true
  downloadProgress.total = selectedMap.size
  downloadProgress.current = 0

  const files = Array.from(selectedMap.values())
  await downloadMultipleFiles(files, (curr, tot) => {
    downloadProgress.current = curr
    downloadProgress.total = tot
  })

  isDownloading.value = false
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
