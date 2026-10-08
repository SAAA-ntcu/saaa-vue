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

      <div class="flex flex-col items-end gap-2">
        <!-- Notice Alert -->
        <div class="bg-amber-50/80 border border-amber-200/80 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs text-amber-800">
          <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>成績查詢及下載功能僅以三年為限，請於期限內自行下載留存。</span>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs matching Dropdown Fields -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-100 scrollbar-none">
      <button
        v-for="t in visibleScoreTabs"
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
    <InquiryDrillDown v-if="activeTab === 'inquiry'" />

    <!-- TAB 2: 各級報表下載 -->
    <ReportsDownloadTab v-else-if="activeTab === 'reports'" />

    <!-- TAB 3: 年度成果報告 -->
    <AnnualReportsTab v-else-if="activeTab === 'annual'" />

    <!-- TAB 4: 試題分析結果 -->
    <ItemAnalysisTab v-else-if="activeTab === 'analysis'" />

    <!-- TAB 5: 背景資料分析 -->
    <BackgroundAnalysisTab v-else-if="activeTab === 'background'" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

import InquiryDrillDown from '../components/scores/InquiryDrillDown.vue'
import ReportsDownloadTab from '../components/scores/tabs/ReportsDownloadTab.vue'
import AnnualReportsTab from '../components/scores/tabs/AnnualReportsTab.vue'
import ItemAnalysisTab from '../components/scores/tabs/ItemAnalysisTab.vue'
import BackgroundAnalysisTab from '../components/scores/tabs/BackgroundAnalysisTab.vue'

const { state } = useAuth()
const route = useRoute()
const router = useRouter()

const baseTabs = [
  { key: 'inquiry', title: '學生成績查詢' },
  { key: 'reports', title: '各級報表下載' }
]

const adminTabs = [
  { key: 'annual', title: '年度成果報告' },
  { key: 'analysis', title: '試題分析結果' },
  { key: 'background', title: '背景資料分析' }
]

const visibleScoreTabs = computed(() => {
  if (state.role === '校長' || state.role === '校管理者') {
    return [...baseTabs, ...adminTabs]
  }
  return baseTabs
})

const activeTab = ref(route.query.tab || 'inquiry')

watch(() => state.role, () => {
  // If current tab is hidden by role switch, redirect to 'inquiry'
  if (!visibleScoreTabs.value.some(t => t.key === activeTab.value)) {
    switchTab('inquiry')
  }
})

watch(() => route.query.tab, (newTab) => {
  if (newTab && visibleScoreTabs.value.some(t => t.key === newTab)) {
    activeTab.value = newTab
  }
})

function switchTab(key) {
  activeTab.value = key
  router.replace({ query: { ...route.query, tab: key } })
}
</script>
