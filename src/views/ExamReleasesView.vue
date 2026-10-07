<template>
  <div class="flex-1 flex flex-col max-h-[620px] overflow-y-auto pr-2 w-full relative">
    <!-- Header title -->
    <div class="text-center mb-4 md:mb-5 shrink-0">
      <h2 class="text-2xl md:text-3xl font-bold text-slate-800 tracking-wide m-0">
        試題公告
      </h2>
      <div class="w-12 md:w-16 h-1 bg-[#52796f] mx-auto mt-2 rounded-full"></div>
    </div>

    <!-- 政策情境模擬切換控制台 (Simulation Switcher) -->
    <div class="bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/90 rounded-2xl p-4 mb-5 shadow-xs shrink-0">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <!-- 左側：情境模式切換 -->
        <div>
          <div class="flex items-center gap-2 mb-1.5 flex-wrap">
            <span class="text-[11px] font-black uppercase tracking-wider text-[#52796f] bg-[#52796f]/10 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <span>⚖️</span>
              <span>試題公告政策模擬</span>
            </span>
            <span class="text-[11px] text-slate-400 font-medium">切換比對不同資安與授權保護機制</span>
          </div>

          <!-- 雙情境切換 Segmented Switch -->
          <div class="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            <button
              type="button"
              @click="setPolicyMode('current')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              :class="policyMode === 'current'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'"
            >
              <span class="w-2 h-2 rounded-full" :class="policyMode === 'current' ? 'bg-emerald-500' : 'bg-slate-300'"></span>
              <span>情況一：現行（全開放）</span>
            </button>
            <button
              type="button"
              @click="setPolicyMode('p6_login_required')"
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              :class="policyMode === 'p6_login_required'
                ? 'bg-[#52796f] text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'"
            >
              <span class="w-2 h-2 rounded-full" :class="policyMode === 'p6_login_required' ? 'bg-amber-300' : 'bg-slate-300'"></span>
              <span>情況二：國小 6 年級需登入才能看</span>
            </button>
          </div>
        </div>

        <!-- 右側：身分模擬切換 (針對情況二測試未登入與已登入差異) -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div class="text-xs">
            <span class="text-slate-400 text-[10px] block font-medium">當前有效身分視角</span>
            <div class="flex items-center gap-1.5 font-bold" :class="isEffectiveLoggedIn ? 'text-emerald-700' : 'text-amber-700'">
              <span class="w-2 h-2 rounded-full" :class="isEffectiveLoggedIn ? 'bg-emerald-500' : 'bg-amber-500'"></span>
              <span>{{ isEffectiveLoggedIn ? `已登入 (${currentDisplayName})` : '未登入 (訪客視角)' }}</span>
            </div>
          </div>

          <!-- 快速模擬切換按鈕群 -->
          <div class="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/70 text-xs">
            <button
              type="button"
              @click="simulationIdentity = 'guest'"
              class="px-2.5 py-1 rounded-md font-semibold transition cursor-pointer"
              :class="simulationIdentity === 'guest' ? 'bg-white text-amber-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'"
              title="模擬未登入訪客視角（國小6年級鎖定）"
            >
              訪客 (未登入)
            </button>
            <button
              type="button"
              @click="simulationIdentity = 'auth'"
              class="px-2.5 py-1 rounded-md font-semibold transition cursor-pointer"
              :class="simulationIdentity === 'auth' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'"
              title="模擬已登入學校人員視角（國小6年級解鎖）"
            >
              已登入教師
            </button>
            <button
              type="button"
              @click="simulationIdentity = 'real'"
              class="px-2 py-1 rounded-md font-medium transition cursor-pointer"
              :class="simulationIdentity === 'real' ? 'bg-white text-[#52796f] shadow-2xs font-bold' : 'text-slate-400 hover:text-slate-700'"
              title="恢復跟隨系統真實登入狀態"
            >
              跟隨真實
            </button>
          </div>
        </div>
      </div>

      <!-- 政策說明小導覽 -->
      <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[11px]">
        <div v-if="policyMode === 'current'" class="text-slate-500 flex items-center gap-1.5">
          <span class="text-emerald-600 font-bold">● 現行開放政策：</span>
          <span>國小 3~6 年級及國中 7~8 年級全部公開，無需登入即可查看與單檔/批次下載。</span>
        </div>
        <div v-else class="text-slate-600 flex items-center gap-1.5">
          <span class="text-amber-700 font-bold">● 6年級需登入政策：</span>
          <span v-if="!isEffectiveLoggedIn" class="text-amber-800 font-medium">
            目前為<strong>未登入狀態</strong>，國小 6 年級試題受保護 🔒 需登入才能看；其他年級仍可自由查看。
          </span>
          <span v-else class="text-emerald-700 font-medium">
            您已處於<strong>登入狀態</strong> 🔓，國小 6 年級試題已成功授權解鎖，享有完整檢視與下載權限！
          </span>
        </div>
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
    <div class="w-full overflow-x-auto border border-slate-200/80 shadow-md rounded-xl bg-white mb-20">
      <table class="w-full text-center border-collapse min-w-[850px]">
        <thead>
          <tr class="text-xs md:text-sm font-bold text-white">
            <th class="bg-[#52796f] py-3 px-3 tracking-wider text-left pl-4">
              科目
              <span class="text-[10px] font-normal opacity-80 block font-mono">點擊列首可全選</span>
            </th>
            <th
              v-for="grade in examGradesHeader"
              :key="grade.key"
              @click="toggleSelectGrade(grade.gradeName)"
              class="bg-[#52796f] py-3 px-2 tracking-wider cursor-pointer hover:bg-[#43645b] transition select-none group"
              :title="isGradeLocked(grade.gradeName) ? '國小 6 年級需登入方可選取' : `點擊全選/取消 ${grade.label}`"
            >
              <div class="flex items-center justify-center gap-1 flex-wrap">
                <span>{{ grade.label }}</span>
                <!-- 鎖定/解鎖狀態徽章 (情況二) -->
                <span
                  v-if="policyMode === 'p6_login_required' && grade.gradeName === '六年級'"
                  class="text-[9px] px-1 py-0.2 rounded font-mono font-bold"
                  :class="isGradeLocked(grade.gradeName) ? 'bg-amber-400 text-amber-950' : 'bg-emerald-300 text-emerald-950'"
                >
                  {{ isGradeLocked(grade.gradeName) ? '🔒需登入' : '🔓已解鎖' }}
                </span>
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
              v-for="grade in examGradesHeader"
              :key="grade.key"
              class="py-2.5 px-2 transition-colors relative"
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
import {
  examYears,
  examSubjects,
  examGradesHeader,
  getExamDownloadUrl
} from '../data/examData'
import { downloadMultipleFiles } from '../utils/batchDownloader'

const router = useRouter()
const { state: authState } = useAuth()
const { activeYear: selectedYear, setYear: changeYear } = useAssessmentYear(examYears)

// ----------------------------------------------------
// 政策情境模擬狀態 (Policy Simulation State)
// ----------------------------------------------------
// 模式：'current' (情況一：現行全開放) | 'p6_login_required' (情況二：國小6年級需登入才能看)
const policyMode = ref('current')

// 測試身分覆寫：'real' (跟隨真實狀態) | 'guest' (強制模擬未登入) | 'auth' (強制模擬已登入)
const simulationIdentity = ref('real')

// 登入提示彈窗狀態
const showLoginPromptDialog = ref(false)
const loginPromptTarget = ref({ subject: '國語文', grade: '國小6年級' })

// 計算當前有效登入狀態
const isEffectiveLoggedIn = computed(() => {
  if (simulationIdentity.value === 'guest') return false
  if (simulationIdentity.value === 'auth') return true
  return Boolean(authState.isLoggedIn)
})

const currentDisplayName = computed(() => {
  if (simulationIdentity.value === 'auth') return '模擬教師身分'
  if (simulationIdentity.value === 'guest') return '未登入訪客'
  return authState.isLoggedIn ? (authState.username || '已登入人員') : '未登入訪客'
})

// 判斷特定年級是否處於鎖定狀態 (需登入且當前未登入)
function isGradeLocked(gradeName) {
  if (policyMode.value === 'current') return false
  // 情況二：國小 6 年級受保護
  if (gradeName === '六年級') {
    return !isEffectiveLoggedIn.value
  }
  return false
}

// 切換政策情境
function setPolicyMode(mode) {
  policyMode.value = mode
  if (mode === 'p6_login_required' && !isEffectiveLoggedIn.value) {
    // 若切換為受限模式且未登入，清除任何已勾選的 6 年級試題
    examSubjects.forEach((s) => {
      selectedMap.delete(getItemKey(selectedYear.value, '六年級', s.name))
    })
    ElMessage({
      message: '已切換為【情況二：國小 6 年級需登入模式】（未登入者無法檢視與下載 6 年級試題）',
      type: 'warning',
      duration: 3500
    })
  } else {
    ElMessage.success('已切換為【情況一：現行公開模式】（全學段試題皆開放檢視與下載）')
  }
}

// 點擊受限項目時跳出登入引導彈窗
function handleLockedClick(subjectName) {
  loginPromptTarget.value = {
    subject: subjectName || '全學科',
    grade: '國小6年級'
  }
  showLoginPromptDialog.value = true
}

// 彈窗內一鍵模擬登入
function handleQuickMockLogin() {
  simulationIdentity.value = 'auth'
  showLoginPromptDialog.value = false
  ElMessage.success('🎉 已為您模擬登入！國小 6 年級試題已解鎖，現在可自由下載')
}

// 彈窗內前往登入頁
function goToLoginPage() {
  showLoginPromptDialog.value = false
  router.push('/Login')
}

// 監聽身分切換，若是未登入則自動清除已選 6 年級試題
watch(isEffectiveLoggedIn, (isLogged) => {
  if (policyMode.value === 'p6_login_required' && !isLogged) {
    examSubjects.forEach((s) => {
      selectedMap.delete(getItemKey(selectedYear.value, '六年級', s.name))
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
    url: getExamDownloadUrl(year, gradeName, subjectName)
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
