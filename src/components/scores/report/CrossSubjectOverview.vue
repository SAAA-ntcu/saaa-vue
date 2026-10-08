<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <h4 class="text-sm font-bold text-slate-800 m-0 flex items-center gap-2">
        <span class="w-1.5 h-4 rounded-full bg-[#52796f]"></span>
        跨科總覽 · 常模落點
      </h4>
      <div class="flex items-center gap-3 text-[11px] text-slate-500">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-[#52796f]"></span>個人</span>
        <span class="flex items-center gap-1"><span class="w-0.5 h-3 bg-[#f59e0b]"></span>學校</span>
        <span class="flex items-center gap-1"><span class="w-0.5 h-3 bg-[#2563eb]"></span>縣市</span>
        <span class="flex items-center gap-1"><span class="w-0.5 h-3 bg-[#9333ea]"></span>全體</span>
      </div>
    </div>

    <!-- ① 各科落點表：一科一列 -->
    <div class="border border-slate-200 rounded-xl overflow-hidden">
      <div class="hidden sm:grid grid-cols-[110px_1fr_64px_64px_64px] gap-3 px-4 py-2 bg-slate-50 text-[11px] font-bold text-slate-500">
        <span>科目</span>
        <span>答對率落點（0–100%）</span>
        <span class="text-right">答對率</span>
        <span class="text-right">縣市 PR</span>
        <span class="text-right">全體 PR</span>
      </div>
      <div class="divide-y divide-slate-100">
        <div
          v-for="s in subjects"
          :key="s.key"
          class="grid grid-cols-[96px_1fr] sm:grid-cols-[110px_1fr_64px_64px_64px] gap-x-3 gap-y-1.5 items-center px-4 py-3"
        >
          <div class="flex items-center gap-2 text-sm font-bold text-slate-800">
            <SubjectChip :subject="s" />
            {{ s.name }}
          </div>
          <div class="relative h-6 bg-slate-100 rounded-md">
            <div
              v-for="t in benchTicks(s)"
              :key="t.key"
              class="absolute top-0 bottom-0 w-0.5"
              :style="{ left: `${t.val}%`, background: t.color }"
              :title="`${t.label} ${t.val}%`"
            ></div>
            <div
              class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#52796f] ring-2 ring-white shadow"
              :style="{ left: `${s.rate}%` }"
              :title="`個人 ${s.rate}%`"
            ></div>
          </div>
          <div class="col-start-2 sm:col-start-auto flex sm:block items-center justify-end gap-2 text-right">
            <span class="font-mono font-black text-base text-slate-900">{{ s.rate }}%</span>
            <span class="sm:hidden text-[11px] text-slate-500">
              縣 PR <strong class="font-mono text-slate-700">{{ s.pr.county }}</strong> · 全 PR <strong class="font-mono text-slate-700">{{ s.pr.national }}</strong>
            </span>
          </div>
          <div class="hidden sm:block text-right font-mono font-bold text-slate-700">{{ s.pr.county }}</div>
          <div class="hidden sm:block text-right font-mono font-medium text-slate-500">{{ s.pr.national }}</div>
        </div>
      </div>
    </div>

    <!-- ② 跨科相對強弱（依「個人 − 縣市平均」排序，不設固定及格線） -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="border border-emerald-200 bg-emerald-50/40 rounded-xl p-3">
        <div class="text-xs font-bold text-emerald-800 mb-2">相對優勢向度（高於縣市平均最多）</div>
        <div class="space-y-1.5">
          <DimRankRow v-for="d in ranking.strengths" :key="d.key" :dim="d" />
          <p v-if="!ranking.strengths.length" class="text-xs text-slate-400 m-0">各向度皆未高於縣市平均</p>
        </div>
      </div>
      <div class="border border-rose-200 bg-rose-50/40 rounded-xl p-3">
        <div class="text-xs font-bold text-rose-800 mb-2">優先關注向度（低於縣市平均最多）</div>
        <div class="space-y-1.5">
          <DimRankRow v-for="d in ranking.focus" :key="d.key" :dim="d" />
          <p v-if="!ranking.focus.length" class="text-xs text-slate-400 m-0">各向度皆不低於縣市平均</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, h } from 'vue'
import SubjectChip from './SubjectChip.vue'
import { rankCrossSubjectDims } from '../../../composables/useStudentReport'

const props = defineProps({
  subjects: { type: Array, required: true }
})

const ranking = computed(() => rankCrossSubjectDims(props.subjects, 3))

function benchTicks(s) {
  return [
    { key: 'national', label: '全體平均', val: s.bench.national, color: '#9333ea' },
    { key: 'county', label: '縣市平均', val: s.bench.county, color: '#2563eb' },
    { key: 'school', label: '學校平均', val: s.bench.school, color: '#f59e0b' }
  ]
}

const DimRankRow = (p) => {
  const d = p.dim
  const up = d.delta >= 0
  return h('div', { class: 'flex items-center gap-2 text-xs bg-white border border-slate-100 rounded-lg px-2.5 py-1.5' }, [
    h(SubjectChip, { subject: d.subject }),
    h('span', { class: 'font-bold text-slate-800 flex-1 truncate', title: d.name }, d.name),
    h('span', { class: 'font-mono text-slate-500' }, `${d.rate}%`),
    h('span', { class: `font-mono font-bold w-10 text-right ${up ? 'text-emerald-700' : 'text-rose-600'}` }, `${up ? '+' : ''}${d.delta}`)
  ])
}
DimRankRow.props = ['dim']
</script>
