<script setup>
import { computed, ref, watch } from 'vue';
import SubjectItemDialog from '../report/SubjectItemDialog.vue';
import {
  formatCount,
  formatPercent,
  formatPoints,
  getClassIds,
  getHistoricalDimensionDiagnosis,
  getLinkedDimensions,
  itemPriority,
  linkedDimensionPriority
} from '../../../composables/useSubject360';

const props = defineProps({
  subject: { type: Object, required: true },
  selectedClasses: { type: Array, required: true },
  visibleClassIds: { type: Array, default: () => [] },
  scopeLabel: { type: String, default: '' },
  initialDimension: { type: String, default: '' }
});

const emit = defineEmits(['select-class', 'select-student']);
const selectedKey = ref(props.initialDimension);
const focusedQuestion = ref(null);
const dimensions = computed(() => getLinkedDimensions(props.subject));
const hasCognitive = computed(() => Boolean(props.subject.dimensions?.cognitive?.length));
const classScope = computed(() => props.visibleClassIds.length ? props.visibleClassIds : getClassIds(props.subject));
const comparisonLabel = computed(() => classScope.value.length === getClassIds(props.subject).length ? '全校' : '可見範圍');
const activeDimension = computed(() => dimensions.value.find((dimension) => dimension.key === selectedKey.value) || dimensions.value[0]);
const selectedPriority = computed(() => activeDimension.value ? linkedDimensionPriority(props.subject, activeDimension.value, props.selectedClasses, classScope.value) : null);
const questionRows = computed(() => activeDimension.value ? activeDimension.value.items.map((question) => itemPriority(props.subject, question, props.selectedClasses, classScope.value)) : []);
const historicalDiagnosis = computed(() => activeDimension.value ? getHistoricalDimensionDiagnosis(props.subject, activeDimension.value, props.selectedClasses) : null);
const historyDimension = computed(() => historicalDiagnosis.value?.historyDimension);
const historyActions = computed(() => historyDimension.value?.actions || []);
const historyYears = computed(() => props.subject.historicalAnalysis?.historicalYears || []);

watch(() => [props.subject.key, props.initialDimension], () => {
  selectedKey.value = props.initialDimension;
  focusedQuestion.value = null;
}, { immediate: true });

function chooseDimension(dimension) {
  selectedKey.value = dimension.key;
  focusedQuestion.value = null;
}

function openQuestion(q) {
  const item = props.subject.items?.[q - 1];
  if (item) {
    focusedQuestion.value = {
      ...item,
      options: [
        { label: 'A', percent: 25, isCorrect: item.answer === 1 },
        { label: 'B', percent: 25, isCorrect: item.answer === 2 },
        { label: 'C', percent: 25, isCorrect: item.answer === 3 },
        { label: 'D', percent: 25, isCorrect: item.answer === 4 }
      ]
    };
  }
}

function priorityClass(level) {
  if (level === '高優先') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (level === '中優先') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
}
</script>

<template>
  <div class="space-y-4">
    <!-- 頂部標題 -->
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div>
        <h3 class="text-base font-bold text-slate-800 m-0">能力向度深度診斷</h3>
        <p class="text-xs text-slate-500 m-0">{{ hasCognitive ? '切換向度檢視關聯試題與歷年官方知識庫' : '切換向度檢視試題作答與迷思診斷' }}</p>
      </div>
      <span class="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
        {{ hasCognitive ? '內容 × 認知' : '內容向度' }}
      </span>
    </div>

    <!-- 向度切換卡片網格 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
      <button
        v-for="dimension in dimensions"
        :key="dimension.key"
        type="button"
        class="p-3 rounded-xl border text-left transition-all"
        :class="activeDimension?.key === dimension.key ? 'bg-emerald-50/70 border-emerald-500 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'"
        @click="chooseDimension(dimension)"
      >
        <div class="flex items-baseline justify-between gap-1">
          <strong class="text-xs font-bold text-slate-800 truncate">{{ dimension.label || dimension.key }}</strong>
          <b class="text-xs font-mono font-black text-emerald-700">
            {{ formatPercent(linkedDimensionPriority(subject, dimension, selectedClasses, classScope).selected?.rate) }}
          </b>
        </div>
        <p class="text-[11px] text-slate-400 m-0 mt-1 line-clamp-1">{{ dimension.description }}</p>
        <small class="text-[10px] text-slate-400 block mt-1">
          {{ dimension.items.length }} 題 · {{ formatPoints(linkedDimensionPriority(subject, dimension, selectedClasses, classScope).gap) }} vs {{ comparisonLabel }}
        </small>
      </button>
    </div>

    <!-- 歷年知識庫對照 -->
    <section v-if="historicalDiagnosis" class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2 flex-wrap gap-2">
        <div>
          <h4 class="text-sm font-bold text-slate-800 m-0">能力診斷 × 歷年官方研究知識庫</h4>
          <p class="text-xs text-slate-500 m-0">{{ historicalDiagnosis.label }}｜對照 {{ historyYears.join('、') }} 年官方報告</p>
        </div>
        <span class="text-xs font-bold px-2.5 py-1 rounded-md border" :class="historicalDiagnosis.hasCurrentSignal ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'">
          {{ historicalDiagnosis.evidenceLabel }}
        </span>
      </div>

      <div class="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200/60 text-xs text-blue-800">
        本次題目表現用以對照歷年資料；下述迷思概念為常見錯誤假設候選，供教師課堂引導與提問確認。
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <span class="text-[11px] font-bold text-slate-400 block">本次向度答對率</span>
          <strong class="text-base font-bold font-mono text-slate-800 block mt-0.5">{{ formatPercent(historicalDiagnosis.currentRate, 1) }}</strong>
        </div>
        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <span class="text-[11px] font-bold text-slate-400 block">歷年平均答對率</span>
          <strong class="text-base font-bold font-mono text-slate-800 block mt-0.5">{{ formatPercent(historyDimension?.historyAverage, 1) }}</strong>
        </div>
        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <span class="text-[11px] font-bold text-slate-400 block">本次支持題目數</span>
          <strong class="text-base font-bold font-mono text-rose-600 block mt-0.5">{{ historicalDiagnosis.signalItems.length }}</strong>
        </div>
        <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <span class="text-[11px] font-bold text-slate-400 block">知識庫對照狀態</span>
          <strong class="text-base font-bold text-emerald-700 block mt-0.5">{{ historyDimension ? '已對照' : '無對應' }}</strong>
        </div>
      </div>

      <!-- 候選迷思概念 -->
      <div v-if="historicalDiagnosis.misconceptions.length" class="space-y-1.5 pt-1">
        <span class="text-xs font-bold text-slate-700 block">歷年歸納候選迷思概念：</span>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="misconception in historicalDiagnosis.misconceptions"
            :key="misconception"
            class="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs rounded-lg font-medium"
          >
            {{ misconception }}
          </span>
        </div>
      </div>
    </section>

    <!-- 該向度關聯試題清單 -->
    <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 class="text-sm font-bold text-slate-800 m-0">向度涵蓋試題（{{ questionRows.length }} 題）</h4>
        <span class="text-[11px] text-slate-400">點選列開啟單題診斷彈窗</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 text-slate-500 font-bold">
            <tr>
              <th class="p-2.5">題號</th>
              <th class="p-2.5">題目概念摘要</th>
              <th class="p-2.5 text-right">所選答對率</th>
              <th class="p-2.5 text-right">{{ comparisonLabel }}</th>
              <th class="p-2.5 text-right">主要誘答選項</th>
              <th class="p-2.5 text-center">檢視優先度</th>
              <th class="p-2.5 text-right">動作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="row in questionRows"
              :key="row.item.q"
              class="hover:bg-slate-50/80 cursor-pointer transition-colors"
              @click="openQuestion(row.item.q)"
            >
              <td class="p-2.5 font-bold font-mono text-slate-800">Q{{ row.item.q }}</td>
              <td class="p-2.5 text-slate-700">{{ row.item.short }}</td>
              <td class="p-2.5 text-right font-mono font-bold text-slate-800">{{ formatPercent(row.selected.rate) }}</td>
              <td class="p-2.5 text-right font-mono text-slate-500">{{ formatPercent(row.school.rate) }}</td>
              <td class="p-2.5 text-right font-mono font-bold text-amber-700">
                {{ row.selected.topWrong ? ['A', 'B', 'C', 'D'][row.selected.topWrong.option - 1] : '—' }}
              </td>
              <td class="p-2.5 text-center">
                <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border" :class="priorityClass(row.level)">
                  {{ row.level }}
                </span>
              </td>
              <td class="p-2.5 text-right">
                <button
                  type="button"
                  class="px-2 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200"
                  @click.stop="openQuestion(row.item.q)"
                >
                  診斷
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <!-- 試題診斷彈窗 -->
    <SubjectItemDialog
      :visible="Boolean(focusedQuestion)"
      :item="focusedQuestion"
      @close="focusedQuestion = null"
    />
  </div>
</template>
