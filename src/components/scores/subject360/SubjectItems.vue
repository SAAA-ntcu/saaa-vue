<script setup>
import { computed, ref, watch } from 'vue';
import Subject360Chart from './Subject360Chart.vue';
import SubjectItemDialog from '../report/SubjectItemDialog.vue';
import {
  formatCount,
  formatPercent,
  formatPoints,
  getClassIds,
  getLinkedDimensions,
  itemPriority
} from '../../../composables/useSubject360';

const props = defineProps({
  subject: { type: Object, required: true },
  selectedClasses: { type: Array, required: true },
  visibleClassIds: { type: Array, default: () => [] },
  focusQuestion: { type: Number, default: null }
});

const emit = defineEmits(['select-class', 'select-student']);
const classScope = computed(() => props.visibleClassIds.length ? props.visibleClassIds : getClassIds(props.subject));
const comparisonLabel = computed(() => classScope.value.length === getClassIds(props.subject).length ? '全校' : '可見範圍');

const itemSort = ref('priority');
const linkedFilter = ref('all');
const priorityFilter = ref('all');
const focusedQuestion = ref(null);

watch(() => props.focusQuestion, (value) => {
  if (value) openQuestion(value);
});

const linkedDimensions = computed(() => getLinkedDimensions(props.subject));
const linkedKeys = computed(() => ['all', ...linkedDimensions.value.map((dimension) => dimension.key)]);
const hasCognitive = computed(() => Boolean(props.subject.dimensions?.cognitive?.length));

const rows = computed(() => (props.subject.items || []).map((item) => itemPriority(props.subject, item.q, props.selectedClasses, classScope.value)).filter((row) => {
  const rowLinkedKey = [row.item.content, row.item.cognitive].filter(Boolean).join(' × ');
  const linkedMatch = linkedFilter.value === 'all' || rowLinkedKey === linkedFilter.value;
  const priorityMatch = priorityFilter.value === 'all' || row.level === priorityFilter.value;
  return linkedMatch && priorityMatch;
}).sort((a, b) => {
  if (itemSort.value === 'q') return a.item.q - b.item.q;
  if (itemSort.value === 'rate') return (a.selected.rate ?? 1) - (b.selected.rate ?? 1);
  if (itemSort.value === 'classGap') return (a.delta ?? 0) - (b.delta ?? 0);
  return b.signals - a.signals || (a.selected.rate ?? 1) - (b.selected.rate ?? 1);
}));

const chartRows = computed(() => rows.value.slice(0, 10));

const chart = computed(() => ({
  animation: false,
  grid: { left: 55, right: 20, top: 25, bottom: 45, containLabel: true },
  tooltip: {
    position: 'top',
    formatter: (params) => {
      const row = chartRows.value[params.value[1]];
      const option = ['A', 'B', 'C', 'D', '其他／未答'][params.value[0]];
      return `Q${row?.item.q || ''} ${row?.item.short || ''}<br/>${option}：${Number(params.value[2]).toFixed(1)}%<br/>正確答案：${['A', 'B', 'C', 'D'][row?.item.answer - 1] || '—'}`;
    }
  },
  xAxis: { type: 'category', data: ['A', 'B', 'C', 'D', '其他／未答'], axisLabel: { interval: 0, fontSize: 11 } },
  yAxis: { type: 'category', data: chartRows.value.map((row) => `Q${row.item.q}`) },
  visualMap: { min: 0, max: 100, show: false, inRange: { color: ['#f8fafc', '#dbeafe', '#2563eb'] } },
  series: [{
    type: 'heatmap',
    data: chartRows.value.flatMap((row, y) => [0, 1, 2, 3, 4].map((option, x) => ({
      value: [x, y, Number(((row.selected.optionRates?.[option] || 0) * 100).toFixed(1))],
      question: row.item.q
    }))),
    label: { show: true, formatter: (params) => `${Number(params.value[2]).toFixed(0)}%`, color: '#1e293b', fontSize: 10 }
  }]
}));

function chartClick(params) {
  if (params.data?.question) {
    openQuestion(params.data.question);
  }
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
</script>

<template>
  <div class="space-y-4">
    <!-- 頂部標題與控制列 -->
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h3 class="text-base font-bold text-slate-800 m-0">試題詳細與誘答熱圖</h3>
        <p class="text-xs text-slate-500 m-0">檢視各題選項誘答力分佈，點選單元格或列表可開啟試題診斷</p>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-xs font-bold text-slate-500">排序：</label>
        <select
          v-model="itemSort"
          class="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
        >
          <option value="priority">教學優先度</option>
          <option value="q">題號順序</option>
          <option value="rate">答對率由低至高</option>
          <option value="classGap">班級落差由低至高</option>
        </select>
      </div>
    </div>

    <!-- 篩選列 -->
    <div class="flex items-center gap-3 flex-wrap p-3 bg-slate-50 rounded-xl border border-slate-200/80">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-slate-500">{{ hasCognitive ? '向度：' : '內容向度：' }}</span>
        <select
          v-model="linkedFilter"
          class="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-slate-700"
        >
          <option v-for="key in linkedKeys" :key="key" :value="key">{{ key === 'all' ? '全部向度' : key }}</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold text-slate-500">優先度：</span>
        <select
          v-model="priorityFilter"
          class="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-slate-700"
        >
          <option value="all">全部</option>
          <option value="高優先">高優先</option>
          <option value="中優先">中優先</option>
          <option value="建議觀察">建議觀察</option>
        </select>
      </div>
      <span class="text-xs text-slate-400 ml-auto">共符合 {{ rows.length }} 題</span>
    </div>

    <!-- 題目 × 選項熱圖 + 解讀提示 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <article class="lg:col-span-2 p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 class="text-sm font-bold text-slate-800 m-0">題目 × 選項 2D 誘答熱力矩陣</h4>
          <span class="text-[11px] text-slate-400">前 {{ chartRows.length }} 題｜顏色越深選答率越高</span>
        </div>
        <Subject360Chart
          v-if="chartRows.length"
          :option="chart"
          :height="Math.max(260, chartRows.length * 30 + 60)"
          aria-label="題目選項熱圖"
          @chart-click="chartClick"
        />
        <p v-else class="text-xs text-slate-400 text-center py-8">無符合條件之題目。</p>
        <p class="text-[10px] text-slate-400 m-0">※ 點擊熱圖單元格可直接展開該題深度診斷對話框。</p>
      </article>

      <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 class="text-sm font-bold text-slate-800 m-0">誘答力解讀提示</h4>
          <span class="text-[11px] text-slate-400">客觀指標</span>
        </div>
        <div class="space-y-2.5 text-xs text-slate-600">
          <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <strong class="text-slate-800 block mb-1">主要誘答力：</strong>
            <p class="m-0 text-slate-500">若某一錯誤選項選答率超過 20%，代表該選項設計具有強烈認知干擾，需留意學生是否存在特定迷思。</p>
          </div>
          <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
            <strong class="text-slate-800 block mb-1">未作答比例：</strong>
            <p class="m-0 text-slate-500">若第 5 欄（其他/未答）比例偏高，可能代表題幹閱讀量過大、作答時間不足或完全缺乏解題線索。</p>
          </div>
        </div>
      </article>
    </div>

    <!-- 題目總覽清單 -->
    <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 class="text-sm font-bold text-slate-800 m-0">試題總覽（{{ rows.length }} / {{ subject.questionCount || 25 }}）</h4>
        <span class="text-[11px] text-slate-400">點選列開啟單題診斷</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 text-slate-500 font-bold">
            <tr>
              <th class="p-2.5">題目概念</th>
              <th class="p-2.5">{{ hasCognitive ? '向度' : '內容向度' }}</th>
              <th class="p-2.5 text-right">所選答對率</th>
              <th class="p-2.5 text-right">{{ comparisonLabel }}</th>
              <th class="p-2.5 text-right">差距</th>
              <th class="p-2.5 text-right">主要錯誤選項</th>
              <th class="p-2.5 text-center">優先度</th>
              <th class="p-2.5 text-right">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="row in rows"
              :key="row.item.q"
              class="hover:bg-slate-50/80 cursor-pointer transition-colors"
              @click="openQuestion(row.item.q)"
            >
              <td class="p-2.5 font-bold font-mono text-slate-800">Q{{ row.item.q }} {{ row.item.short }}</td>
              <td class="p-2.5 text-slate-600">{{ [row.item.content, row.item.cognitive].filter(Boolean).join(' × ') }}</td>
              <td class="p-2.5 text-right font-mono font-bold text-slate-800">{{ formatPercent(row.selected.rate) }}</td>
              <td class="p-2.5 text-right font-mono text-slate-500">{{ formatPercent(row.school.rate) }}</td>
              <td class="p-2.5 text-right font-mono font-medium" :class="(row.delta || 0) < 0 ? 'text-rose-600' : 'text-emerald-600'">
                {{ formatPoints(row.delta) }}
              </td>
              <td class="p-2.5 text-right font-mono font-bold text-amber-700">
                {{ row.selected.topWrong ? ['A', 'B', 'C', 'D'][row.selected.topWrong.option - 1] : '—' }}
              </td>
              <td class="p-2.5 text-center">
                <span
                  class="px-2 py-0.5 rounded-full text-[11px] font-bold border"
                  :class="row.level === '高優先' ? 'bg-rose-50 text-rose-700 border-rose-200' : row.level === '中優先' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
                >
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
