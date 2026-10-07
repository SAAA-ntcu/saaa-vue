<template>
  <div class="w-full max-w-6xl mx-auto p-2 sm:p-4 md:p-6 bg-white/80 backdrop-blur-xs rounded-2xl">
    
    <!-- Top Main Tab Switcher (教師帳號管理 / 缺考名單下載) -->
    <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <button
          v-if="state.role === '校管理者'"
          type="button"
          @click="switchMainTab('teachers')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          :class="mainTab === 'teachers'
            ? 'bg-[#52796f] text-white shadow-xs'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          教師帳號管理
        </button>

        <button
          type="button"
          @click="switchMainTab('absentee')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          :class="mainTab === 'absentee'
            ? 'bg-[#52796f] text-white shadow-xs'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          缺考名單下載
        </button>
      </div>

      <!-- Username Tag -->
      <div class="flex items-center gap-3 text-xs flex-wrap">
        <span class="text-slate-600 font-medium">
          使用者名稱：<strong class="text-slate-800 font-bold font-mono">{{ state.username }}</strong>
        </span>
      </div>
    </div>

    <!-- VIEW 1: 教師帳號管理 (整合新版雙開關架構) -->
    <TeacherManagement v-if="mainTab === 'teachers'" />

    <!-- VIEW 2: 缺考名單下載 -->
    <AbsenteeList v-else-if="mainTab === 'absentee'" />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import TeacherManagement from '../components/integrated/TeacherManagement.vue'
import AbsenteeList from '../components/integrated/AbsenteeList.vue'

const { state } = useAuth()
const mainTab = ref(state.role === '校管理者' ? 'teachers' : 'absentee')

function switchMainTab(tab) {
  mainTab.value = tab
}
</script>
