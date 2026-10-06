<template>
  <div class="flex-1 flex flex-col max-h-[600px] overflow-y-auto pr-2 w-full">
    <!-- Header title -->
    <div class="text-center mb-6 md:mb-8 shrink-0">
      <h2 class="text-2xl md:text-3xl font-bold text-slate-800 tracking-wide m-0">
        試題公告
      </h2>
      <div class="w-12 md:w-16 h-1 bg-[#52796f] mx-auto mt-2.5 rounded-full"></div>
    </div>

    <!-- Year Selection Tabs -->
    <div class="flex items-center justify-start md:justify-center space-x-2 mb-6 md:mb-8 overflow-x-auto pb-3 whitespace-nowrap w-full shrink-0">
      <button
        v-for="year in examYears"
        :key="year"
        type="button"
        @click="selectedYear = year"
        class="px-3.5 py-1.5 border rounded-lg transition transform active:scale-95 duration-150 font-medium text-xs md:text-base cursor-pointer"
        :class="selectedYear === year
          ? 'bg-[#52796f] text-white border-[#52796f] shadow-xs'
          : 'border-slate-300 text-slate-600 bg-white hover:border-[#52796f] hover:text-white hover:bg-[#52796f]'"
      >
        {{ year }}年
      </button>
    </div>

    <!-- Data Matrix Table -->
    <div class="w-full overflow-x-auto border border-slate-200/60 shadow-lg rounded-xl">
      <table class="w-full text-center border-collapse min-w-[850px]">
        <thead>
          <tr class="text-xs md:text-base font-bold text-white">
            <th class="bg-[#52796f] py-3.5 px-4 tracking-wider">科目</th>
            <th
              v-for="grade in examGradesHeader"
              :key="grade.key"
              class="bg-[#52796f] py-3.5 px-2 tracking-wider"
            >
              {{ grade.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs md:text-base font-medium text-slate-700 bg-white">
          <tr
            v-for="subject in examSubjects"
            :key="subject.name"
            class="hover:bg-slate-50/80 transition"
          >
            <td class="font-bold py-3.5 px-4 text-slate-800 bg-slate-50/40">
              {{ subject.name }}
            </td>
            <td
              v-for="grade in examGradesHeader"
              :key="grade.key"
              class="py-2.5"
            >
              <a
                :href="getExamDownloadUrl(selectedYear, grade.gradeName, subject.name)"
                target="_blank"
                class="inline-flex items-center space-x-1.5 py-1.5 px-2.5 rounded-lg text-slate-600 hover:text-[#52796f] hover:bg-slate-50 transition mx-auto no-underline group"
              >
                <!-- Replaced ✋ with download arrow SVG -->
                <svg class="w-4 h-4 text-slate-400 group-hover:text-[#52796f] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span class="underline decoration-slate-300">下載</span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  examYears,
  examSubjects,
  examGradesHeader,
  getExamDownloadUrl
} from '../data/examData'

const selectedYear = ref('115')
</script>
