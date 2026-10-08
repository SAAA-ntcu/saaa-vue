<script setup>
import { computed } from 'vue';
import SubjectAdvice from './SubjectAdvice.vue';
import {
  formatCount,
  formatPercent,
  formatPoints,
  getClassIds,
  getClassOverall,
  getClassStudents,
  getLinkedDimensions,
  itemPriority,
  linkedDimensionPriority
} from '../../../composables/useSubject360';

const props = defineProps({
  subject: { type: Object, required: true },
  selectedClasses: { type: Array, required: true },
  visibleClassIds: { type: Array, default: () => [] },
  scopeLabel: { type: String, required: true }
});

const emit = defineEmits(['open-page', 'open-ability', 'open-item']);

const selectedStudents = computed(() => getClassStudents(props.subject, props.selectedClasses));
const classScope = computed(() => props.visibleClassIds.length ? props.visibleClassIds : getClassIds(props.subject));
const comparisonLabel = computed(() => classScope.value.length === getClassIds(props.subject).length ? '全校' : '可見範圍');
const classRows = computed(() => classScope.value.map((classId) => ({ classId, stat: getClassOverall(props.subject, classId) })).sort((a, b) => (a.stat.rate ?? 1) - (b.stat.rate ?? 1)));
const dimensions = computed(() => getLinkedDimensions(props.subject).map((dimension) => linkedDimensionPriority(props.subject, dimension, props.selectedClasses, classScope.value)));
const items = computed(() => props.subject.items.map((item) => itemPriority(props.subject, item.q, props.selectedClasses, classScope.value)).sort((a, b) => b.signals - a.signals || (a.selected.rate ?? 1) - (b.selected.rate ?? 1)));
const topClass = computed(() => classRows.value[0]);
const topDimension = computed(() => [...dimensions.value].sort((a, b) => (a.selected.rate ?? 1) - (b.selected.rate ?? 1))[0]);
const topItem = computed(() => items.value[0]);
const watchDimensions = computed(() => dimensions.value.filter((row) => row.level !== '建議觀察').length);
const highItems = computed(() => items.value.filter((row) => row.level === '高優先').length);

const priorityQueue = computed(() => [
  { type: 'class', label: '班級', title: topClass.value ? `${topClass.value.classId} 班` : '班級比較', detail: topClass.value ? `${formatPercent(topClass.value.stat.rate)} 整體答對率` : '目前無排序訊號' },
  { type: 'ability', label: '向度', title: topDimension.value?.dimension?.label || topDimension.value?.dimension?.key || '能力向度', detail: topDimension.value ? `${formatPoints(topDimension.value.gap)} vs ${comparisonLabel.value}` : '目前無可用向度' },
  { type: 'item', label: '題目', title: topItem.value ? `Q${topItem.value.item.q} ${topItem.value.item.short}` : '試題資料', detail: topItem.value ? `${formatPercent(topItem.value.selected.rate)} 所選範圍答對率` : '目前無可用試題' }
]);

function openQueue(entry) {
  if (entry.type === 'class') emit('open-page', 'classes');
  if (entry.type === 'ability' && topDimension.value) emit('open-ability', topDimension.value);
  if (entry.type === 'item' && topItem.value) emit('open-item', topItem.value.item.q);
}
</script>

<template>
  <div class="space-y-4">
    <!-- 頂部標題與說明 -->
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div>
        <h3 class="text-base font-bold text-slate-800 m-0">領域資料總覽</h3>
        <p class="text-xs text-slate-500 m-0">{{ scopeLabel }}｜依序查看班級、能力向度、題目與學生資料</p>
      </div>
      <span class="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
        循序決策路徑
      </span>
    </div>

    <!-- 4 大 KPI -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-400 font-bold block">分析班級數</span>
        <strong class="text-2xl font-black text-slate-800 font-mono block mt-1">{{ selectedClasses.length }}</strong>
        <small class="text-[11px] text-slate-400">{{ scopeLabel }}</small>
      </div>
      <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-400 font-bold block">有效學生數</span>
        <strong class="text-2xl font-black text-slate-800 font-mono block mt-1">{{ formatCount(selectedStudents.length) }}</strong>
        <small class="text-[11px] text-slate-400">所選班級有效學生</small>
      </div>
      <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-400 font-bold block">待關注向度數</span>
        <strong class="text-2xl font-black text-amber-600 font-mono block mt-1">{{ watchDimensions }}</strong>
        <small class="text-[11px] text-slate-400">{{ subject.dimensions?.cognitive?.length ? '內容 × 認知聯結' : '內容向度' }}</small>
      </div>
      <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-xs text-slate-400 font-bold block">優先查看題目</span>
        <strong class="text-2xl font-black text-rose-600 font-mono block mt-1">{{ highItems }}</strong>
        <small class="text-[11px] text-slate-400">符合多項待確認條件</small>
      </div>
    </div>

    <!-- 決策卡：三步驟聚焦 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs border-t-3 border-t-[#3f7d6e] flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">第一步：查看班級</span>
          <strong class="text-base font-bold text-slate-800 block mt-1">{{ topClass ? `${topClass.classId} 班` : '—' }}</strong>
          <p class="text-xs text-slate-500 m-0 mt-1">{{ topClass ? formatPercent(topClass.stat.rate) + ' 整體答對率' : '目前無排序訊號' }}</p>
        </div>
        <button
          type="button"
          class="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-1.5 px-3 rounded-lg text-left transition-colors"
          @click="emit('open-page', 'classes')"
        >
          查看班級與能力 →
        </button>
      </article>

      <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs border-t-3 border-t-[#3f7d6e] flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">第二步：查看向度</span>
          <strong class="text-base font-bold text-slate-800 block mt-1">{{ topDimension?.dimension?.key || '—' }}</strong>
          <p class="text-xs text-slate-500 m-0 mt-1">{{ topDimension ? formatPoints(topDimension.gap) + ' vs ' + comparisonLabel : '目前無向度資料' }}</p>
        </div>
        <button
          type="button"
          class="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-1.5 px-3 rounded-lg text-left transition-colors"
          @click="topDimension && emit('open-ability', topDimension)"
        >
          查看能力診斷 →
        </button>
      </article>

      <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs border-t-3 border-t-[#3f7d6e] flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">第三步：題目 → 學生</span>
          <strong class="text-base font-bold text-slate-800 block mt-1">Q{{ topItem?.item.q || '—' }} {{ topItem?.item.short || '' }}</strong>
          <p class="text-xs text-slate-500 m-0 mt-1">{{ topItem ? formatPercent(topItem.selected.rate) + ' 所選範圍答對率' : '目前無試題資料' }}</p>
        </div>
        <button
          type="button"
          class="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-1.5 px-3 rounded-lg text-left transition-colors"
          @click="topItem && emit('open-item', topItem.item.q)"
        >
          查看試題與受影響學生 →
        </button>
      </article>
    </div>

    <!-- 優先處理項目與重點摘要 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 class="text-sm font-bold text-slate-800 m-0">優先處理佇列</h4>
          <span class="text-[11px] text-slate-400">依序建議流程</span>
        </div>
        <div class="space-y-2">
          <button
            v-for="(entry, index) in priorityQueue"
            :key="entry.type"
            type="button"
            class="w-full flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-left transition-colors"
            @click="openQueue(entry)"
          >
            <span class="w-6 h-6 rounded-full bg-[#3f7d6e] text-white font-bold text-xs flex items-center justify-center font-mono">
              {{ index + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <strong class="text-xs font-bold text-slate-800 block">{{ entry.label }}｜{{ entry.title }}</strong>
              <small class="text-[11px] text-slate-400">{{ entry.detail }}</small>
            </div>
            <span class="text-slate-400 text-sm font-bold">→</span>
          </button>
        </div>
      </article>

      <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 class="text-sm font-bold text-slate-800 m-0">重點關鍵訊號</h4>
          <span class="text-[11px] text-slate-400">客觀作答統計</span>
        </div>
        <div class="space-y-2.5 text-xs text-slate-600">
          <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <strong class="text-slate-800 block mb-1">共同現象：</strong>
            <p class="m-0 text-slate-500">{{ highItems ? `共有 ${highItems} 題需要優先回到試題確認。` : '目前未見顯著全校共同偏低題組。' }}</p>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <strong class="text-slate-800 block mb-1">班級差異：</strong>
            <p class="m-0 text-slate-500">{{ topClass ? `${topClass.classId} 班答對率 ${formatPercent(topClass.stat.rate)}，建議優先檢視班級差異。` : '目前各班表現均衡。' }}</p>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <strong class="text-slate-800 block mb-1">選項誘答線索：</strong>
            <p class="m-0 text-slate-500">{{ topItem?.selected?.topWrong ? `Q${topItem.item.q} 的主要錯誤選項集中於 ${['A', 'B', 'C', 'D'][topItem.selected.topWrong.option - 1]} 選項。` : '目前未見高度集中的錯誤選項。' }}</p>
          </div>
        </div>
      </article>
    </div>

    <!-- 歷年教學建議組件 -->
    <SubjectAdvice
      :subject="subject"
      :selected-classes="selectedClasses"
      :scope-label="scopeLabel"
      @open-item="emit('open-item', $event)"
    />
  </div>
</template>
