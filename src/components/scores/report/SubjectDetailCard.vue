<template>
  <div
    class="border rounded-xl p-4 space-y-2.5 transition-all duration-200"
    :class="isFocused ? 'border-[#52796f] ring-2 ring-[#52796f]/20 bg-slate-50/60 shadow-xs' : 'border-slate-200 bg-white'"
  >
    <div class="flex items-center justify-between gap-2 flex-wrap">
      <div class="flex items-center gap-2 text-sm font-bold text-slate-800">
        <SubjectChip :subject="subject" />
        {{ subject.name }}
        <span class="text-[11px] font-normal text-slate-400">{{ subject.dims.length }} 個向度</span>
        <span
          v-if="isFocused"
          class="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
          :style="{ background: subject.chipColor }"
        >
          雷達聚焦中
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="$emit('toggle-focus', subject.key)"
          class="text-[11px] font-medium px-2 py-0.5 rounded border transition cursor-pointer"
          :class="isFocused ? 'bg-slate-200/70 text-slate-700 border-slate-300' : 'text-[#52796f] border-[#52796f]/40 hover:bg-[#52796f]/10'"
        >
          {{ isFocused ? '返回總覽' : '聚焦此科雷達' }}
        </button>
        <span class="text-[11px] text-slate-400 hidden sm:inline">
          刻度：<span class="text-amber-600 font-bold">校</span> / <span class="text-blue-600 font-bold">縣</span>
        </span>
      </div>
    </div>

    <!-- 向度答對率長條清單 -->
    <div
      v-for="d in subject.dims"
      :key="d.key"
      class="grid grid-cols-[88px_1fr_40px_36px] gap-2 items-center text-xs rounded-md px-1 py-0.5 transition-colors"
      :class="hoveredKey === d.key ? 'bg-[#52796f]/10' : ''"
      @mouseenter="$emit('hover', d.key)"
      @mouseleave="$emit('hover', null)"
    >
      <span class="font-bold text-slate-700 truncate" :title="d.name">{{ d.short }}</span>
      <div class="relative h-2.5 bg-slate-100 rounded-full">
        <div class="h-full rounded-full bg-[#52796f] transition-all duration-500" :style="{ width: `${d.rate}%` }"></div>
        <div class="absolute -top-1 -bottom-1 w-0.5 bg-[#f59e0b]" :style="{ left: `${d.bench.school}%` }" :title="`學校平均 ${d.bench.school}%`"></div>
        <div class="absolute -top-1 -bottom-1 w-0.5 bg-[#2563eb]" :style="{ left: `${d.bench.county}%` }" :title="`縣市平均 ${d.bench.county}%`"></div>
      </div>
      <span class="font-mono font-bold text-right text-slate-800">{{ d.rate }}%</span>
      <span class="font-mono text-[11px] text-right" :class="d.delta >= 0 ? 'text-emerald-700' : 'text-rose-600'">
        {{ d.delta > 0 ? '+' : '' }}{{ d.delta }}
      </span>
    </div>

    <!-- 答錯題號與難題/粗心題診斷 -->
    <details class="pt-2 border-t border-slate-100 group" open>
      <summary class="list-none cursor-pointer text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center justify-between select-none">
        <span class="flex items-center gap-1">
          <span class="inline-block transition-transform group-open:rotate-90">▸</span>
          錯題深度診斷（共 {{ displayWrongItems.length }} 題）
        </span>
        <span class="text-[10px] text-slate-400 font-normal">點擊題卡可下鑽選項誘答力</span>
      </summary>
      <div class="space-y-1.5 mt-2">
        <div
          v-for="w in displayWrongItems"
          :key="'wrong-' + w.q"
          @click="$emit('select-question', { ...w, subjectKey: subject.key, subjectName: subject.name })"
          class="flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all hover:scale-[1.01] hover:shadow-2xs"
          :class="w.mistakeType === 'careless'
            ? 'bg-amber-50/70 border-amber-200 text-amber-950 hover:bg-amber-100/80'
            : w.mistakeType === 'hard'
              ? 'bg-purple-50/70 border-purple-200 text-purple-950 hover:bg-purple-100/80'
              : 'bg-slate-50/70 border-slate-200 text-slate-800 hover:bg-slate-100'"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span class="font-mono font-bold px-1.5 py-0.5 rounded bg-white/90 border border-slate-200/60 text-slate-700 text-[11px] shrink-0">
              第 {{ w.q }} 題
            </span>
            <div class="truncate">
              <span class="font-bold text-slate-800">{{ w.short || `第 ${w.q} 題` }}</span>
              <span class="text-[10px] text-slate-500 ml-1.5 hidden sm:inline">({{ w.content || w.dim }} · {{ w.cognitive || '概念理解' }})</span>
            </div>
          </div>

          <div class="flex items-center gap-1.5 shrink-0">
            <span v-if="w.studentChoice" class="text-[10px] font-mono bg-white/90 px-1.5 py-0.5 rounded border border-slate-200/60 text-slate-600">
              選【{{ w.studentChoice }}】· 正解【{{ w.correctAnswer }}】
            </span>
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :class="w.mistakeType === 'careless'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : w.mistakeType === 'hard'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'"
            >
              {{ w.mistakeLabel || `通過率 ${w.passPct || 65}%` }}
            </span>
          </div>
        </div>

        <p v-if="!displayWrongItems.length" class="text-xs text-emerald-600 font-bold m-0 p-1 flex items-center gap-1">
          <span>🎉</span> 該科目全部作答正確，表現精熟！
        </p>
      </div>
    </details>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SubjectChip from './SubjectChip.vue'

const props = defineProps({
  subject: { type: Object, required: true },
  hoveredKey: { type: String, default: null },
  isFocused: { type: Boolean, default: false }
})

defineEmits(['hover', 'toggle-focus', 'select-question'])

const totalQ = computed(() => props.subject.dims.reduce((sum, d) => sum + d.totalQ, 0))

const displayWrongItems = computed(() => {
  if (props.subject.wrongItems && props.subject.wrongItems.length > 0) {
    return props.subject.wrongItems
  }
  return props.subject.dims
    .flatMap(d => (d.wrongQs || []).map(q => ({
      q: typeof q === 'object' ? q.q : q,
      short: typeof q === 'object' ? q.short : `第 ${q} 題`,
      dim: d.short,
      content: d.name,
      cognitive: '概念理解',
      studentChoice: typeof q === 'object' ? q.studentChoice : 2,
      correctAnswer: typeof q === 'object' ? q.correctAnswer : 1,
      passPct: typeof q === 'object' ? q.passPct : 65,
      mistakeType: typeof q === 'object' ? q.mistakeType : 'normal',
      mistakeLabel: typeof q === 'object' ? q.mistakeLabel : '📘 概念精進題',
      priority: typeof q === 'object' ? q.priority : 2
    })))
    .sort((a, b) => a.priority - b.priority || a.q - b.q)
})
</script>

<style scoped>
summary::-webkit-details-marker {
  display: none;
}
</style>
