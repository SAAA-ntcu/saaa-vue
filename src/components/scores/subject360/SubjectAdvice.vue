<script setup>
import { computed } from 'vue';
import {
  formatCount,
  formatPercent,
  formatPoints,
  getDimensionStat,
  getItemStat,
  getOverall,
  getClassIds
} from '../../../composables/useSubject360';

const props = defineProps({
  subject: { type: Object, required: true },
  selectedClasses: { type: Array, default: () => [] },
  scopeLabel: { type: String, default: '' }
});

const emit = defineEmits(['open-item']);
const analysis = computed(() => props.subject.historicalAnalysis || null);
const legacyAdvice = computed(() => props.subject.teachingAdvice || null);
const scope = computed(() => props.selectedClasses.length ? props.selectedClasses : getClassIds(props.subject));
const currentOverall = computed(() => getOverall(props.subject, scope.value));
const historicalAverage = computed(() => {
  const rates = analysis.value?.overall?.historical?.map((entry) => entry.rate).filter((rate) => rate != null) || [];
  return rates.length ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length : null;
});

const dimensionRows = computed(() => (analysis.value?.dimensions || [])
  .map((dimension) => {
    const stat = getDimensionStat(props.subject, 'content', dimension.key, scope.value);
    const currentRate = stat?.rate ?? dimension.currentRate;
    return {
      ...dimension,
      currentRate,
      historyGap: currentRate == null || dimension.historyAverage == null ? null : currentRate - dimension.historyAverage
    };
  })
  .sort((a, b) => (a.currentRate ?? 1) - (b.currentRate ?? 1)));

const priorityDimensions = computed(() => dimensionRows.value
  .filter((dimension) => dimension.currentRate < 0.7 || dimension.recurrenceYears?.length >= 2)
  .slice(0, 4));

const itemRows = computed(() => Object.values(analysis.value?.itemInsights || {})
  .map((insight) => {
    const stat = getItemStat(props.subject, insight.q, scope.value);
    const currentRate = stat?.rate ?? insight.currentRate;
    const level = currentRate < 0.4 ? '優先查看' : currentRate < 0.6 ? '需查看' : currentRate < 0.7 ? '觀察' : '一般';
    return { ...insight, currentRate, level, topWrong: stat?.topWrong || insight.topWrong };
  })
  .sort((a, b) => (a.currentRate ?? 1) - (b.currentRate ?? 1)));

const priorityItems = computed(() => itemRows.value.filter((item) => item.currentRate < 0.6).length);
const priorityDimensionCount = computed(() => dimensionRows.value.filter((dimension) => dimension.currentRate < 0.7 || dimension.recurrenceYears?.length >= 2).length);

function priorityClass(level) {
  if (level === '優先查看' || level === '需查看') return 'high';
  if (level === '觀察') return 'medium';
  return 'observe';
}
</script>

<template>
  <article v-if="analysis || legacyAdvice" class="subject360-card space-y-4">
    <template v-if="analysis">
      <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <h3 class="text-base font-bold text-slate-800 m-0">題目表現與歷年報告知識庫</h3>
          <p class="text-xs text-slate-500 m-0 pt-0.5">本年度評量資料｜對照 {{ analysis.historicalYears.join('、') }} 年官方五年級評量研究報告</p>
        </div>
        <span class="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
          校內資料・歷年報告
        </span>
      </div>

      <div class="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-800 leading-relaxed">
        {{ analysis.summary }}
      </div>

      <!-- KPI 摘要 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span class="text-[11px] font-bold text-slate-400 block">目前範圍整體</span>
          <strong class="text-lg font-black text-slate-800 font-mono block mt-1">{{ formatPercent(currentOverall.rate, 1) }}</strong>
          <small class="text-[10px] text-slate-400">{{ scopeLabel || '目前範圍' }}｜N={{ formatCount(currentOverall.valid) }}</small>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span class="text-[11px] font-bold text-slate-400 block">歷年整體平均基線</span>
          <strong class="text-lg font-black text-slate-800 font-mono block mt-1">{{ formatPercent(historicalAverage, 1) }}</strong>
          <small class="text-[10px] text-slate-400">歷年報告向度基線</small>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span class="text-[11px] font-bold text-slate-400 block">待優先向度數</span>
          <strong class="text-lg font-black text-amber-600 font-mono block mt-1">{{ priorityDimensionCount }}</strong>
          <small class="text-[10px] text-slate-400">低於 70% 或歷年反覆偏低</small>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          <span class="text-[11px] font-bold text-slate-400 block">需優先查看題目</span>
          <strong class="text-lg font-black text-rose-600 font-mono block mt-1">{{ priorityItems }}</strong>
          <small class="text-[10px] text-slate-400">答對率偏低題數</small>
        </div>
      </div>

      <!-- 歷年對照 + 本期教學循環 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <!-- 歷年整體對照 -->
        <article class="p-4 bg-slate-50/60 rounded-xl border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-slate-800 m-0">歷年整體對照</h4>
            <span class="text-[11px] text-slate-400">群體基線（非個案追蹤）</span>
          </div>
          <div class="space-y-2">
            <div
              v-for="entry in analysis.overall.historical"
              :key="entry.year"
              class="flex items-center gap-3 text-xs"
            >
              <span class="w-14 font-mono font-bold text-slate-500">{{ entry.year }} 年</span>
              <strong class="w-12 text-right font-mono font-bold text-slate-700">{{ formatPercent(entry.rate, 1) }}</strong>
              <div class="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div class="h-full bg-slate-400 rounded-full" :style="{ width: `${Math.max(2, entry.rate * 100)}%` }" />
              </div>
            </div>
            <div class="flex items-center gap-3 text-xs pt-2 border-t border-slate-200">
              <span class="w-14 font-mono font-black text-emerald-800">本次校內</span>
              <strong class="w-12 text-right font-mono font-black text-emerald-700">{{ formatPercent(currentOverall.rate, 1) }}</strong>
              <div class="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div class="h-full bg-[#3f7d6e] rounded-full" :style="{ width: `${Math.max(2, (currentOverall.rate || 0) * 100)}%` }" />
              </div>
            </div>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed m-0 pt-1">{{ analysis.methodology }}</p>
        </article>

        <!-- 本期教學循環 -->
        <article class="p-4 bg-slate-50/60 rounded-xl border border-slate-200/80 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-slate-800 m-0">本期教學循環指引</h4>
            <span class="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">先概念，後熟練</span>
          </div>
          <div class="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            <div
              v-for="plan in analysis.teachingPlan"
              :key="plan.title"
              class="p-2.5 bg-white border border-slate-200/70 rounded-lg space-y-1.5"
            >
              <div class="flex items-baseline justify-between gap-2">
                <strong class="text-xs font-bold text-slate-800">{{ plan.title }}</strong>
                <span class="text-[11px] text-emerald-600 font-medium">{{ plan.focus }}</span>
              </div>
              <ol class="text-[11px] text-slate-600 pl-4 space-y-0.5 list-decimal m-0">
                <li v-for="step in plan.steps" :key="step">{{ step }}</li>
              </ol>
              <p class="text-[11px] text-slate-500 m-0 bg-slate-50 p-1.5 rounded">
                <b class="text-slate-700 mr-1">檢核點：</b>{{ plan.lookFor }}
              </p>
            </div>
          </div>
        </article>
      </div>

      <!-- 學生可能卡點與教學建議 -->
      <div class="pt-3 border-t border-slate-100 space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-slate-800 m-0">學生卡點分析與教學介入建議</h4>
          <span class="text-xs text-slate-400">保留官方歷年對照依據</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <article
            v-for="dimension in priorityDimensions"
            :key="dimension.key"
            class="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <strong class="text-xs font-bold text-slate-800 block">{{ dimension.label }}</strong>
                <span class="text-[11px] text-slate-400">{{ dimension.title }} · {{ dimension.trend }}</span>
              </div>
              <span
                class="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                :class="dimension.currentRate < 0.6 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
              >
                {{ formatPercent(dimension.currentRate, 1) }}
              </span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed m-0 bg-slate-50/80 p-2 rounded-lg">
              <span class="font-bold text-slate-700 block mb-0.5">教學重點：</span>
              {{ dimension.advice || '加強具體物操作與表徵轉換，建立穩固概念基底。' }}
            </p>
          </article>
        </div>
      </div>
    </template>
  </article>
</template>
