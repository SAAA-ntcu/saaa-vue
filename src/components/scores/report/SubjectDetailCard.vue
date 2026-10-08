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

    <!-- 答錯題號（收合） -->
    <details class="pt-2 border-t border-slate-100 group">
      <summary class="list-none cursor-pointer text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 select-none">
        <span class="inline-block transition-transform group-open:rotate-90">▸</span>
        答錯題號（{{ wrongItems.length }} / {{ totalQ }} 題）
      </summary>
      <div class="flex flex-wrap gap-1.5 mt-2">
        <span
          v-for="w in wrongItems"
          :key="w.q"
          class="text-[11px] font-mono bg-rose-50 text-rose-700 border border-rose-200 rounded px-1.5 py-0.5"
        >第 {{ w.q }} 題 · {{ w.dim }}</span>
        <span v-if="!wrongItems.length" class="text-[11px] text-slate-400">全部答對</span>
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
defineEmits(['hover', 'toggle-focus'])

const totalQ = computed(() => props.subject.dims.reduce((sum, d) => sum + d.totalQ, 0))

const wrongItems = computed(() =>
  props.subject.dims
    .flatMap(d => d.wrongQs.map(q => ({ q, dim: d.short })))
    .sort((a, b) => a.q - b.q)
)
</script>

<style scoped>
summary::-webkit-details-marker {
  display: none;
}
</style>
