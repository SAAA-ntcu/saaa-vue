<template>
  <div class="w-full relative flex-1 flex flex-col pb-16">
    <!-- Header title -->
    <div class="text-center mb-4 md:mb-5 shrink-0">
      <h2 class="text-2xl md:text-3xl font-bold text-slate-800 tracking-wide m-0">
        試題公告
      </h2>
      <div class="w-12 md:w-16 h-1 bg-[#52796f] mx-auto mt-2 rounded-full"></div>
    </div>

    <!-- 頂部政策情境狀態提示條 (由右上角「切換測試身分」統一設定) -->
    <div
      class="mb-4 px-4 py-3 rounded-2xl border transition-all shadow-2xs shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
      :class="effectivePolicyMode === 'p6_login_required'
        ? 'bg-amber-50/80 border-amber-200/90 text-amber-950'
        : 'bg-[#edf2ee]/80 border-[#52796f]/25 text-[#243d32]'"
    >
      <div class="flex items-center gap-2.5 flex-wrap">
        <span
          class="px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
          :class="effectivePolicyMode === 'p6_login_required'
            ? 'bg-amber-100 text-amber-900 border border-amber-300'
            : 'bg-[#52796f] text-white'"
        >
          <span>{{ effectivePolicyMode === 'p6_login_required' ? '🔒 情況二：國小 6 年級需登入' : '🌐 情況一：現行（全開放）' }}</span>
        </span>
        <span class="font-medium text-slate-700">
          <template v-if="effectivePolicyMode === 'p6_login_required'">
            <span v-if="!authState.isLoggedIn" class="text-amber-800 font-semibold">
              最新 {{ latestExamYear }} 年國小 6 年級試題受保護需登入才能看；其他學段與歷年試題皆公開。
            </span>
            <span v-else class="text-emerald-700 font-semibold">
              您已登入（{{ authState.username }}），最新 {{ latestExamYear }} 年國小 6 年級試題已解鎖。
            </span>
          </template>
          <template v-else>
            全學段試題皆全面公開，免登入即可查看、單檔下載及批次打包下載。
          </template>
        </span>
      </div>

      <div class="flex items-center gap-1.5 text-[11px] text-slate-500 shrink-0">
        <span>💡 可於右上角</span>
        <span class="font-bold text-[#52796f] bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">切換測試身分</span>
        <span>隨時切換情況一 / 情況二</span>
      </div>
    </div>

    <!-- Year Selection & Batch Selection Controls Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 shrink-0 px-1">
      <!-- Year Selection (Recent 3 Years Pills + Historical Dropdown) -->
      <YearSelector
        v-model="selectedYear"
        :years="examYears"
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
          {{ isAllCurrentYearSelected ? '取消當年度全選' : `全選 ${selectedYear} 年度 (${availableYearCount}份)` }}
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
    <div class="w-full overflow-x-auto border border-slate-200/80 shadow-md rounded-2xl bg-white mb-12">
      <table class="w-full table-fixed text-center border-collapse min-w-[860px]">
        <thead>
          <tr class="text-xs md:text-sm font-bold text-white">
            <th class="w-36 md:w-44 bg-[#52796f] py-3.5 px-3 tracking-wider text-left pl-4">
              科目
              <span class="text-[10px] font-normal opacity-80 block font-mono">點擊列首可全選</span>
            </th>
            <th
              v-for="grade in examGradesHeader"
              :key="grade.key"
              @click="toggleSelectGrade(grade.gradeName)"
              class="w-[115px] bg-[#52796f] py-3.5 px-2 tracking-wider cursor-pointer hover:bg-[#43645b] transition select-none group"
              :title="isGradeLocked(grade.gradeName) ? '國小 6 年級需登入方可選取' : `點擊全選/取消 ${grade.label}`"
            >
              <div class="flex items-center justify-center gap-1.5 flex-wrap">
                <span>{{ grade.label }}</span>
                <span
                  v-if="!isGradeLocked(grade.gradeName)"
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
            v-for="subject in examSubjects"
            :key="subject.name"
            class="hover:bg-slate-50/60 transition"
          >
            <!-- Subject Row Header (Clickable to select whole row) -->
            <td
              @click="toggleSelectSubject(subject.name)"
              class="w-36 md:w-44 font-bold py-3 px-4 text-slate-800 bg-slate-50/70 hover:bg-[#52796f]/10 cursor-pointer transition select-none text-left"
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
              v-for="grade in examGradesHeader"
              :key="grade.key"
              class="w-[115px] py-2.5 px-2 transition-colors relative"
              :class="[
                isSelected(grade.gradeName, subject.name) ? 'bg-[#52796f]/10 ring-1 ring-inset ring-[#52796f]/25' : '',
                isGradeLocked(grade.gradeName) ? 'bg-amber-50/30' : ''
              ]"
            >
              <!-- 鎖定狀態 (需登入且未登入) -->
              <div v-if="isGradeLocked(grade.gradeName)" class="flex items-center justify-center">
                <button
                  type="button"
                  @click="handleLockedClick(subject.name)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-800 text-xs font-semibold shadow-2xs transition cursor-pointer group"
                  title="國小6年級試題需登入方可檢視，點擊查看登入提示"
                >
                  <svg class="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span>需登入</span>
                </button>
              </div>

              <!-- 開放/解鎖狀態 (正常選取與下載) -->
              <div v-else class="flex items-center justify-center gap-2">
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
                  :href="getExamDownloadUrl(selectedYear, grade.gradeName, subject.name)"
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
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10"
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

    <!-- 情況二：登入權限引導彈窗 (Interactive Modal) -->
    <el-dialog
      v-model="showLoginPromptDialog"
      title="試題存取權限受限"
      width="440px"
      align-center
      class="rounded-2xl overflow-hidden"
    >
      <div class="py-2 text-center space-y-3.5">
        <div class="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-200/80 shadow-xs">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>

        <div>
          <h3 class="text-lg font-black text-slate-800 m-0">國小 6 年級試題需登入驗證</h3>
          <p class="text-xs text-slate-500 mt-1.5 leading-relaxed px-4">
            依政策模擬情境二規範，<strong>{{ selectedYear }}年度 國小 6 年級 {{ loginPromptTarget.subject }}</strong> 試題受授權保護，<strong>需先登入帳號</strong>方可檢視與下載題本。
          </p>
        </div>

        <div class="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-left text-amber-900 space-y-1">
          <div class="font-bold flex items-center gap-1.5">
            <span>💡</span>
            <span>測試快捷解鎖方式：</span>
          </div>
          <p class="text-[11px] text-amber-700 m-0 pl-4">
            您可以點選下方「一鍵模擬登入」立刻解鎖體驗，或前往正式登入頁進行身分驗證。
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            @click="showLoginPromptDialog = false"
            class="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            稍後再說
          </button>
          <button
            type="button"
            @click="handleQuickMockLogin"
            class="px-4 py-2 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer"
          >
            <span>🔓 一鍵模擬登入解鎖</span>
          </button>
          <button
            type="button"
            @click="goToLoginPage"
            class="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            前往登入頁
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import YearSelector from '../components/common/YearSelector.vue'
import { useAssessmentYear } from '../composables/useAssessmentYear'
import { useAuth } from '../composables/useAuth'
import { examService } from '../services/examService'
import {
  examYears,
  examSubjects,
  examGradesHeader,
  getExamDownloadUrl
} from '../data/examData'
import { downloadMultipleFiles } from '../utils/batchDownloader'

const router = useRouter()
const { state: authState, login } = useAuth()
const { activeYear: selectedYear, setYear: changeYear } = useAssessmentYear(examYears)

// ----------------------------------------------------
// 最新年度計算 (僅最新年度需進行政策模擬)
// ----------------------------------------------------
const latestExamYear = computed(() => {
  return [...examYears].sort((a, b) => Number(b) - Number(a))[0] || '115'
})

// 當前是否選擇最新年度
const isLatestYearSelected = computed(() => {
  return selectedYear.value === latestExamYear.value
})

// ----------------------------------------------------
// 政策情境模擬狀態 (Policy Simulation State)
// 由右上角「切換測試身分」統一控制，全站共享
// ----------------------------------------------------
const effectivePolicyMode = computed(() => {
  return authState.policyMode || 'current'
})

// 登入提示彈窗狀態
const showLoginPromptDialog = ref(false)
const loginPromptTarget = ref({ subject: '國語文', grade: '國小6年級' })

// 判斷特定年級是否處於鎖定狀態 (需登入且當前未登入，且【只有最新年度】才需遵循政策保護)
function isGradeLocked(gradeName) {
  // 歷年試題維持全面開放，只有最新年度才需遵循政策模擬
  if (!isLatestYearSelected.value) return false
  if (effectivePolicyMode.value === 'current') return false
  // 情況二：國小 6 年級需登入才能看
  if (gradeName === '六年級') {
    return !authState.isLoggedIn
  }
  return false
}

// 點擊受限項目時跳出登入引導彈窗
function handleLockedClick(subjectName) {
  if (!isLatestYearSelected.value) return
  loginPromptTarget.value = {
    subject: subjectName || '全學科',
    grade: `最新 ${latestExamYear.value} 年 國小6年級`
  }
  showLoginPromptDialog.value = true
}

// 彈窗內一鍵模擬登入
function handleQuickMockLogin() {
  login({ role: '導師' })
  showLoginPromptDialog.value = false
  ElMessage.success('🎉 已為您快速登入為導師！國小 6 年級試題已解鎖，現在可自由下載')
}

// 彈窗內前往登入頁
function goToLoginPage() {
  showLoginPromptDialog.value = false
  router.push('/logins')
}

// 監聽政策情境、登入狀態或年度變化，若未登入且處於受限狀態，則自動清除已選 6 年級試題
watch([effectivePolicyMode, () => authState.isLoggedIn, selectedYear], () => {
  if (effectivePolicyMode.value === 'p6_login_required' && !authState.isLoggedIn && isLatestYearSelected.value) {
    examSubjects.forEach((s) => {
      selectedMap.delete(getItemKey(latestExamYear.value, '六年級', s.name))
    })
  }
})

// ----------------------------------------------------
// 試題勾選與批次下載邏輯 (Batch Download Logic)
// ----------------------------------------------------
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
    name: `${year}年縣市學生學力檢測正式施測題本(${subjectName}${gradeName}).zip`,
    url: examService.getDownloadUrl(year, gradeName, subjectName)
  }
}

function isSelected(gradeName, subjectName) {
  return selectedMap.has(getItemKey(selectedYear.value, gradeName, subjectName))
}

function toggleItem(gradeName, subjectName) {
  if (isGradeLocked(gradeName)) {
    handleLockedClick(subjectName)
    return
  }
  const key = getItemKey(selectedYear.value, gradeName, subjectName)
  if (selectedMap.has(key)) {
    selectedMap.delete(key)
  } else {
    selectedMap.set(key, getItemObject(selectedYear.value, gradeName, subjectName))
  }
}

// 當年度可供勾選的總試題份數 (全開放為 24 份，若 6 年級鎖定則為 20 份)
const availableYearCount = computed(() => {
  const unlockedGrades = examGradesHeader.filter((g) => !isGradeLocked(g.gradeName))
  return unlockedGrades.length * examSubjects.length
})

// 年級欄全選判斷
function isGradeAllSelected(gradeName) {
  if (isGradeLocked(gradeName)) return false
  return examSubjects.every((s) =>
    selectedMap.has(getItemKey(selectedYear.value, gradeName, s.name))
  )
}

function toggleSelectGrade(gradeName) {
  if (isGradeLocked(gradeName)) {
    handleLockedClick('全學科')
    return
  }
  const allSelected = isGradeAllSelected(gradeName)
  examSubjects.forEach((s) => {
    const key = getItemKey(selectedYear.value, gradeName, s.name)
    if (allSelected) {
      selectedMap.delete(key)
    } else {
      selectedMap.set(key, getItemObject(selectedYear.value, gradeName, s.name))
    }
  })
}

// 科目列全選判斷 (僅勾選未鎖定之年級)
function isSubjectAllSelected(subjectName) {
  const unlockedGrades = examGradesHeader.filter((g) => !isGradeLocked(g.gradeName))
  if (unlockedGrades.length === 0) return false
  return unlockedGrades.every((g) =>
    selectedMap.has(getItemKey(selectedYear.value, g.gradeName, subjectName))
  )
}

function toggleSelectSubject(subjectName) {
  const unlockedGrades = examGradesHeader.filter((g) => !isGradeLocked(g.gradeName))
  const allSelected = isSubjectAllSelected(subjectName)

  unlockedGrades.forEach((g) => {
    const key = getItemKey(selectedYear.value, g.gradeName, subjectName)
    if (allSelected) {
      selectedMap.delete(key)
    } else {
      selectedMap.set(key, getItemObject(selectedYear.value, g.gradeName, subjectName))
    }
  })

  if (isGradeLocked('六年級') && !allSelected) {
    ElMessage.info(`已為您勾選 ${subjectName} 開放年級試題（國小 6 年級需登入方可下載）`)
  }
}

// 當年度全部全選判斷
const isAllCurrentYearSelected = computed(() => {
  const unlockedGrades = examGradesHeader.filter((g) => !isGradeLocked(g.gradeName))
  if (unlockedGrades.length === 0) return false
  return examSubjects.every((s) =>
    unlockedGrades.every((g) =>
      selectedMap.has(getItemKey(selectedYear.value, g.gradeName, s.name))
    )
  )
})

function toggleSelectAllYear() {
  const allSelected = isAllCurrentYearSelected.value
  const unlockedGrades = examGradesHeader.filter((g) => !isGradeLocked(g.gradeName))

  if (allSelected) {
    examSubjects.forEach((s) => {
      examGradesHeader.forEach((g) => {
        selectedMap.delete(getItemKey(selectedYear.value, g.gradeName, s.name))
      })
    })
  } else {
    examSubjects.forEach((s) => {
      unlockedGrades.forEach((g) => {
        selectedMap.set(getItemKey(selectedYear.value, g.gradeName, s.name), getItemObject(selectedYear.value, g.gradeName, s.name))
      })
    })
    if (policyMode.value === 'p6_login_required' && !isEffectiveLoggedIn.value) {
      ElMessage({
        message: `已全選開放之 ${unlockedGrades.length * examSubjects.length} 份試題（國小 6 年級需登入方可下載）`,
        type: 'warning',
        duration: 3500
      })
    }
  }
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
