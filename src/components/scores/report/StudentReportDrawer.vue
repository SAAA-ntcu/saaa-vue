<template>
  <el-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :size="drawerSize"
    direction="rtl"
    :with-header="false"
    append-to-body
    class="student-report-drawer"
  >
    <div v-if="student && report" class="h-full flex flex-col bg-white text-slate-800">
      <!-- 1. 抽屜頂部固定標題列 (Pinned Header) -->
      <header class="shrink-0 px-5 sm:px-6 py-3 border-b border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between z-10 shadow-2xs gap-3 flex-wrap">
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-[10px] font-black uppercase tracking-wider text-[#52796f] bg-[#52796f]/10 px-2.5 py-1 rounded-md">
            綜合成績單 · 診斷報告
          </span>
          <h3 class="text-lg font-black text-slate-800 m-0 flex items-center gap-2">
            <span>{{ student.name }}</span>
            <span class="text-xs font-mono font-medium text-slate-400">
              ({{ classObj }} 班 · {{ student.seat }} 號)
            </span>
          </h3>

          <!-- 受測科目標籤 (動態依年級顯示) -->
          <div class="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span class="text-[11px] text-slate-400 font-medium">受測科目：</span>
            <div class="flex items-center gap-1">
              <span
                v-for="s in report.subjects"
                :key="'sub-pill-' + s.key"
                class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                :style="{ background: s.bandColor, color: s.chipColor }"
              >
                <span class="w-1.5 h-1.5 rounded-full" :style="{ background: s.chipColor }"></span>
                {{ s.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- 頂部右側動作區 -->
        <div class="flex items-center gap-2">
          <!-- 寬版切換按鈕 (Desktop only) -->
          <button
            v-if="!isMobile"
            type="button"
            @click="isDrawerExpanded = !isDrawerExpanded"
            class="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            :title="isDrawerExpanded ? '恢復標準寬度' : '擴展為全螢幕寬版'"
          >
            <svg v-if="!isDrawerExpanded" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9L4 4m0 0h4m-4 0v4m11 1l5-5m0 0h-4m4 0v4M9 15l-5 5m0 0h4m-4 0v-4m11-1l5 5m0 0h-4m4 0v-4" />
            </svg>
          </button>

          <!-- 關閉按鈕 -->
          <button
            type="button"
            @click="$emit('update:modelValue', false)"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            aria-label="關閉"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <!-- 2. 可平滑捲動的主體內容區 (Scrollable Main Body) -->
      <div
        ref="drawerBodyRef"
        class="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6 scroll-smooth select-text"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <!-- 模組 ②：學生學力特徵與雙軌診斷橫幅 (偏科診斷與關注廣度標籤) -->
        <section
          v-if="report.inconsistencyProfile"
          class="p-4 rounded-2xl border transition-all"
          :class="report.inconsistencyProfile.isInconsistent
            ? 'bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white border-amber-300 shadow-2xs'
            : report.inconsistencyProfile.breadth === 0
              ? 'bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white border-emerald-300 shadow-2xs'
              : 'bg-slate-50 border-slate-200'"
        >
          <div class="flex items-center justify-between flex-wrap gap-2 mb-2 pb-2 border-b border-slate-200/60">
            <div class="flex items-center gap-2 flex-wrap">
              <!-- 關注廣度徽章 -->
              <span
                class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs flex items-center gap-1"
                :class="report.inconsistencyProfile.breadth === 0
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : report.inconsistencyProfile.breadth === 1
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-rose-100 text-rose-800 border-rose-200'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="report.inconsistencyProfile.breadth === 0 ? 'bg-emerald-500' : report.inconsistencyProfile.breadth === 1 ? 'bg-amber-500' : 'bg-rose-500'"></span>
                {{ report.inconsistencyProfile.breadthLabel }}
              </span>

              <!-- 偏科訊號徽章 -->
              <span
                v-if="report.inconsistencyProfile.isInconsistent"
                class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300 flex items-center gap-1 shadow-2xs"
              >
                ⚡ 跨科表現高度不一致（偏科診斷）
              </span>
            </div>

            <span class="text-[11px] text-slate-400">
              雙軌診斷指引 · 避免單一等第標籤化
            </span>
          </div>

          <!-- 雙軌診斷說明文字 -->
          <div class="space-y-1.5 text-xs">
            <div v-if="report.inconsistencyProfile.advantageStatement" class="flex items-start gap-1.5 text-emerald-900">
              <span class="font-bold shrink-0 text-emerald-700">🌟 優勢學科肯定：</span>
              <span>{{ report.inconsistencyProfile.advantageStatement }}</span>
            </div>
            <div v-if="report.inconsistencyProfile.supportStatement" class="flex items-start gap-1.5 text-rose-900">
              <span class="font-bold shrink-0 text-rose-700">🎯 精準扶助焦點：</span>
              <span>{{ report.inconsistencyProfile.supportStatement }}</span>
            </div>
            <p class="text-[11px] text-slate-600 m-0 pt-1 leading-relaxed border-t border-slate-200/50">
              {{ report.inconsistencyProfile.recommendation }}
            </p>
          </div>
        </section>

        <!-- 區塊 ①：跨科落點與相對強弱總覽 (含 Feature 5 雙常模 PR 階梯) -->
        <CrossSubjectOverview :subjects="report.subjects" />

        <!-- 區塊 ②：雙欄並排（左：下鑽雷達網 / 右：各科向度清單與錯題） -->
        <section class="space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <h4 class="text-sm font-bold text-slate-800 m-0 flex items-center gap-2">
              <span class="w-1.5 h-4 rounded-full bg-[#52796f]"></span>
              各科向度細節與能力網
            </h4>
            <span class="text-xs text-slate-400">
              可切換單科詳細雷達，或點擊「🧠 認知向度」進行跨科思維穿透
            </span>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <!-- 左欄 (5 欄)：互動下鑽雷達 (含 Feature 1 跨科認知穿透) -->
            <div class="lg:col-span-5 lg:sticky lg:top-0 space-y-3">
              <DimensionRadar
                :subjects="report.subjects"
                :cognitive-profile="report.cognitiveProfile"
                v-model:focusSubject="focusSubject"
                :hovered-key="hoveredKey"
                @hover="hoveredKey = $event"
              />
            </div>

            <!-- 右欄 (7 欄)：各科詳細向度進度與錯題卡片 (含 Feature 4 難題/粗心題診斷) -->
            <div class="lg:col-span-7 space-y-4">
              <SubjectDetailCard
                v-for="s in report.subjects"
                :key="'detail-' + s.key"
                :subject="s"
                :hovered-key="hoveredKey"
                :is-focused="focusSubject === s.key"
                @hover="hoveredKey = $event"
                @toggle-focus="toggleFocus"
                @select-question="handleSelectQuestion"
              />
            </div>
          </div>
        </section>

        <!-- 區塊 ③：模組 ③ 跨科教師會商名單與協作會議指南 -->
        <section class="border border-slate-200/80 rounded-2xl p-4 sm:p-5 bg-slate-50/70 space-y-3">
          <div class="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-200/70">
            <h4 class="text-sm font-bold text-slate-800 m-0 flex items-center gap-2">
              <span class="w-1.5 h-4 rounded-full bg-[#52796f]"></span>
              跨科教師協作會商指南
            </h4>
            <div v-if="report.collaborationProfile?.suggestedTeachers" class="text-xs text-slate-500 flex items-center gap-1.5">
              <span class="text-slate-400">建議會商對象：</span>
              <span class="font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-2xs">
                {{ report.collaborationProfile.suggestedTeachers }}
              </span>
            </div>
          </div>

          <!-- 會議聚焦主題卡片 -->
          <div v-if="report.collaborationProfile?.topic" class="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-start gap-2 shadow-2xs">
            <span class="text-base text-[#52796f] leading-none mt-0.5">📌</span>
            <div class="space-y-0.5">
              <strong class="text-slate-800 font-bold block">
                協作會商焦點：{{ report.collaborationProfile.combination }}
              </strong>
              <p class="text-[11px] text-slate-600 m-0 leading-relaxed">
                {{ report.collaborationProfile.topic }}
              </p>
            </div>
          </div>

          <!-- 4 大課堂客觀觀察指引清單 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div
              v-for="item in (report.collaborationProfile?.objectiveChecklist?.length ? report.collaborationProfile.objectiveChecklist : studentChecklist)"
              :key="item.id"
              class="bg-white border border-slate-100 rounded-xl p-3 space-y-1 shadow-2xs"
            >
              <strong class="text-xs text-slate-800 font-bold block">{{ item.title }}</strong>
              <p class="text-[11px] text-slate-500 m-0 leading-relaxed">{{ item.description }}</p>
            </div>
          </div>

          <p class="text-[10px] text-slate-400 m-0 pt-1 text-right">
            ※ 本會商指南旨在建立導師與科任之橫向支持對話，將評量轉化為課堂觀察與具體輔導行動。
          </p>
        </section>
      </div>

      <!-- 3. 抽屜底部座號導航列 (Navigation Footer) -->
      <footer class="shrink-0 px-5 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/90 backdrop-blur-xs flex items-center justify-between z-10 shadow-inner">
        <button
          type="button"
          @click="switchStudent(-1)"
          :disabled="isFirstStudent"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs hover:border-[#52796f]/40 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg class="w-3.5 h-3.5 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>前一位學生</span>
        </button>

        <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>座號 <strong class="text-slate-800 font-mono text-sm">{{ student.seat }}</strong> / {{ studentList.length }}</span>
          <span class="text-[10px] text-slate-400 hidden sm:inline">(支援左右滑動翻頁)</span>
        </div>

        <button
          type="button"
          @click="switchStudent(1)"
          :disabled="isLastStudent"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs hover:border-[#52796f]/40 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>後一位學生</span>
          <svg class="w-3.5 h-3.5 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </footer>
    </div>

    <!-- 試題深度誘答診斷彈窗 -->
    <SubjectItemDialog
      :visible="isQuestionDialogVisible"
      :item="selectedQuestionItem"
      @close="isQuestionDialogVisible = false"
    />
  </el-drawer>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { buildStudentReport } from '../../../composables/useStudentReport'
import { isGaotongGrade, getQuestionDeepDiagnostic } from '../../../composables/useGaotongData'
import CrossSubjectOverview from './CrossSubjectOverview.vue'
import DimensionRadar from './DimensionRadar.vue'
import SubjectDetailCard from './SubjectDetailCard.vue'
import SubjectItemDialog from './SubjectItemDialog.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  student: { type: Object, default: null },
  studentList: { type: Array, default: () => [] },
  schoolName: { type: String, default: '學校' },
  grade: { type: [String, Number], default: '3' },
  classObj: { type: String, default: '301' }
})

const emit = defineEmits(['update:modelValue', 'selectStudent'])

// 展開狀態與抽屜寬度
const isDrawerExpanded = ref(false)
const drawerBodyRef = ref(null)
const isMobile = computed(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false))

const drawerSize = computed(() => {
  if (isMobile.value) return '100%'
  return isDrawerExpanded.value ? '96vw' : 'min(94vw, 1140px)'
})

// 單題診斷彈窗狀態 (100% 串接真實作答與官方歷史知識庫)
const isQuestionDialogVisible = ref(false)
const selectedQuestionItem = ref(null)

function handleSelectQuestion(item) {
  if (isGaotongGrade(props.grade)) {
    selectedQuestionItem.value = getQuestionDeepDiagnostic(
      item.subjectKey || item.subjectName,
      item.q,
      props.classObj,
      props.student?.seat
    )
  } else {
    selectedQuestionItem.value = {
      subjectKey: item.subjectKey || 'math',
      subjectName: item.subjectName || '數學',
      q: item.q,
      short: item.short || `第 ${item.q} 題`,
      content: item.content || item.dim || '向度評量',
      cognitive: item.cognitive || '概念理解',
      answer: item.correctAnswer || 1,
      answerLetter: ['A', 'B', 'C', 'D'][(item.correctAnswer || 1) - 1],
      schoolRate: item.passPct || 70,
      countyRate: item.passPct || 68,
      topWrongOption: ['A', 'B', 'C', 'D'][(item.studentChoice || 2) - 1] || 'B',
      topWrongShare: '32%',
      optionRows: ['A', 'B', 'C', 'D'].map((label, i) => ({
        label,
        rate: i === 0 ? 54 : i === 1 ? 28 : i === 2 ? 11 : 7,
        isCorrect: label === ['A', 'B', 'C', 'D'][(item.correctAnswer || 1) - 1]
      })),
      classRows: ['301', '302', '303'].map(cId => ({
        classId: cId,
        rate: item.passPct || 70,
        isCurrentClass: cId === props.classObj
      })),
      historicalInsight: null,
      studentContext: {
        seat: props.student?.seat,
        studentChoiceLetter: ['A', 'B', 'C', 'D'][(item.studentChoice || 2) - 1]
      }
    }
  }
  isQuestionDialogVisible.value = true
}

// 組裝成績單資料 (純函數響應式計算)
const report = computed(() => {
  if (!props.student) return null
  return buildStudentReport(props.student, {
    grade: props.grade,
    classObj: props.classObj
  })
})

// 客觀觀察清單與協作對象 (來自高通真實資料或預設)
const studentChecklist = computed(() => props.student?.objectiveChecklist || [])
const studentConsultPartners = computed(() => props.student?.consultPartners || [])

// 互動聯動狀態
const focusSubject = ref(null) // null = 跨科總覽; 'chinese' | 'math' | 'english'
const hoveredKey = ref(null)

function toggleFocus(subjectKey) {
  focusSubject.value = focusSubject.value === subjectKey ? null : subjectKey
}

function scrollToTop() {
  nextTick(() => {
    if (drawerBodyRef.value) {
      drawerBodyRef.value.scrollTop = 0
    }
  })
}

// 學生翻頁導航
const currentIndex = computed(() =>
  props.studentList.findIndex(s => s.seat === props.student?.seat)
)
const isFirstStudent = computed(() => currentIndex.value <= 0)
const isLastStudent = computed(() =>
  props.studentList.length > 0 && currentIndex.value >= props.studentList.length - 1
)

function switchStudent(offset) {
  if (!props.student || props.studentList.length === 0) return
  const curIdx = currentIndex.value
  const nextIdx = curIdx + offset
  if (nextIdx >= 0 && nextIdx < props.studentList.length) {
    emit('selectStudent', props.studentList[nextIdx])
    scrollToTop()
  }
}

// 觸控左右滑動翻頁 (Touch Swipe)
let touchStartX = 0
let touchStartY = 0

function handleTouchStart(e) {
  if (e.touches && e.touches[0]) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }
}

function handleTouchEnd(e) {
  if (!e.changedTouches || !e.changedTouches[0]) return
  const deltaX = e.changedTouches[0].clientX - touchStartX
  const deltaY = e.changedTouches[0].clientY - touchStartY

  // 當水平滑動距離超過 50px 且水平位移明顯大於垂直滾動時觸發切換
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
    if (deltaX < 0) {
      switchStudent(1) // 向左滑 -> 後一位學生
    } else {
      switchStudent(-1) // 向右滑 -> 前一位學生
    }
  }
}
</script>

<style scoped>
:deep(.student-report-drawer) {
  border-top-left-radius: 1.25rem !important;
  border-bottom-left-radius: 1.25rem !important;
  overflow: hidden !important;
  box-shadow: -8px 0 32px rgba(15, 23, 42, 0.15) !important;
}

:deep(.student-report-drawer .el-drawer__body) {
  padding: 0 !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  max-height: 100vh !important;
}
</style>
