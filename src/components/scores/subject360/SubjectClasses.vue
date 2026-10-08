<script setup>
import { computed, ref, watch } from 'vue';
import Subject360Chart from './Subject360Chart.vue';
import {
  formatPercent,
  formatPoints,
  getClassIds,
  getClassOverall,
  getLinkedDimensions,
  getLinkedDimensionStat,
  getStudentsForLinkedDimension,
  linkedDimensionPriority
} from '../../../composables/useSubject360';

const props = defineProps({
  subject: { type: Object, required: true },
  selectedClasses: { type: Array, required: true },
  visibleClassIds: { type: Array, default: () => [] }
});

const emit = defineEmits(['select-class', 'select-student']);
const selectedDimension = ref('');
const dimensions = computed(() => getLinkedDimensions(props.subject));
const hasCognitive = computed(() => Boolean(props.subject.dimensions?.cognitive?.length));
const activeDimension = computed(() => dimensions.value.find((dimension) => dimension.key === selectedDimension.value) || dimensions.value[0]);
const classScope = computed(() => props.visibleClassIds.length ? props.visibleClassIds : getClassIds(props.subject));
const comparisonLabel = computed(() => classScope.value.length === getClassIds(props.subject).length ? '全校' : '可見範圍');
const dimensionCards = computed(() => dimensions.value.map((dimension) => linkedDimensionPriority(props.subject, dimension, props.selectedClasses, classScope.value)));
const classRows = computed(() => classScope.value.map((classId) => ({ classId, stat: getClassOverall(props.subject, classId) })).sort((a, b) => (a.stat.rate ?? 1) - (b.stat.rate ?? 1)));
const dimensionRows = computed(() => activeDimension.value ? classScope.value.map((classId) => {
  const stat = getLinkedDimensionStat(props.subject, activeDimension.value, [classId]);
  return { classId, stat, students: getStudentsForLinkedDimension(props.subject, [classId], activeDimension.value) };
}).sort((a, b) => (a.stat?.rate ?? 1) - (b.stat?.rate ?? 1)) : []);

function dimensionColor(rate) {
  if (rate == null) return '#cbd5e1';
  if (rate < 0.6) return '#e07a5f'; // Morandi Terracotta
  if (rate < 0.75) return '#81a4b8'; // Morandi Soft Slate
  return '#3f7d6e'; // Morandi Sage Green
}

const dimensionTreemap = computed(() => {
  const priorityByKey = new Map(dimensionCards.value.map((card) => [card.dimension.key, card]));
  const leaf = (dimension) => {
    const priority = priorityByKey.get(dimension.key);
    const selected = priority?.selected?.rate;
    return {
      name: dimension.cognitiveKey || dimension.label || dimension.key,
      value: Math.max(dimension.items.length, 1),
      dimensionKey: dimension.key,
      rate: selected,
      gap: priority?.gap,
      itemCount: dimension.items.length,
      itemStyle: {
        color: dimensionColor(selected),
        borderColor: activeDimension.value?.key === dimension.key ? '#0f172a' : '#ffffff',
        borderWidth: activeDimension.value?.key === dimension.key ? 3 : 1.5
      }
    };
  };
  if (!hasCognitive.value) return dimensions.value.map(leaf);
  const groups = new Map();
  dimensions.value.forEach((dimension) => {
    const key = dimension.contentKey || dimension.key;
    if (!groups.has(key)) groups.set(key, { name: key, children: [] });
    groups.get(key).children.push(leaf(dimension));
  });
  return [...groups.values()];
});

const dimensionTreemapChart = computed(() => ({
  animation: false,
  tooltip: {
    formatter: (params) => {
      const data = params.data;
      if (!data?.dimensionKey) return `${data?.name || ''}<br/>向度群組`;
      return `${data.name}<br/>題數：${data.itemCount}<br/>答對率：${formatPercent(data.rate)}<br/>與${comparisonLabel.value}：${formatPoints(data.gap)}`;
    }
  },
  series: [{
    type: 'treemap',
    data: dimensionTreemap.value,
    roam: false,
    nodeClick: false,
    breadcrumb: { show: false },
    squareRatio: 1.15,
    visibleMin: 1,
    upperLabel: { show: hasCognitive.value, height: 24, color: '#1e293b', fontSize: 11, fontWeight: 700 },
    label: { show: true, formatter: (params) => params.data?.dimensionKey ? `${params.data.name}\n${formatPercent(params.data.rate)}` : params.name, color: '#fff', fontSize: 11, fontWeight: 700, overflow: 'truncate' },
    itemStyle: { borderColor: '#fff', borderWidth: 2, gapWidth: 2 },
    levels: [{ itemStyle: { borderColor: '#fff', borderWidth: 3, gapWidth: 3 }, label: { show: false } }, { itemStyle: { borderColor: '#fff', borderWidth: 2, gapWidth: 2 } }]
  }]
}));

const matrixRows = computed(() => classScope.value.map((classId) => ({
  classId,
  cells: dimensions.value.map((dimension) => ({
    dimension,
    stat: getLinkedDimensionStat(props.subject, dimension, [classId])
  }))
})));

const evidenceCell = ref(null);
const evidenceDimension = computed(() => dimensions.value.find((dimension) => dimension.key === evidenceCell.value?.dimensionKey));
const evidenceStudents = computed(() => evidenceCell.value && evidenceDimension.value
  ? getStudentsForLinkedDimension(props.subject, [evidenceCell.value.classId], evidenceDimension.value)
  : []);

watch(() => props.selectedClasses, (classes) => {
  if (evidenceCell.value && !classes.includes(evidenceCell.value.classId)) evidenceCell.value = null;
}, { deep: true });

const matrixChart = computed(() => ({
  animation: false,
  grid: { left: 60, right: 20, top: 10, bottom: dimensions.value.length > 5 ? 75 : 30, containLabel: true },
  tooltip: {
    position: 'top',
    formatter: (params) => {
      const [x, y, rate] = params.value;
      return `${matrixRows.value[y]?.classId || ''} 班<br/>${dimensions.value[x]?.label || dimensions.value[x]?.key || ''}<br/><strong>${Number(rate).toFixed(1)}%</strong>`;
    }
  },
  xAxis: { type: 'category', data: dimensions.value.map((dimension) => dimension.label || dimension.key), axisLabel: { interval: 0, rotate: 30, fontSize: 10 } },
  yAxis: { type: 'category', data: matrixRows.value.map((row) => `${row.classId} 班`) },
  visualMap: { min: 40, max: 100, show: false, inRange: { color: ['#fff1f0', '#fffbe6', '#e6f7f2'] } },
  series: [{
    type: 'heatmap',
    data: matrixRows.value.flatMap((row, y) => row.cells.map((cell, x) => ({
      value: [x, y, Number(((cell.stat?.rate || 0) * 100).toFixed(1))],
      classId: row.classId,
      dimensionKey: cell.dimension.key
    }))),
    label: { show: true, formatter: (params) => `${Number(params.value[2]).toFixed(0)}%`, color: '#334155', fontSize: 10 }
  }]
}));

function chooseDimension(dimension) {
  selectedDimension.value = dimension.key;
  if (evidenceCell.value && evidenceCell.value.dimensionKey !== dimension.key) evidenceCell.value = null;
}

function treemapClick(params) {
  const dimension = dimensions.value.find((candidate) => candidate.key === params.data?.dimensionKey);
  if (dimension) chooseDimension(dimension);
}

function showEvidence(classId) {
  if (activeDimension.value) evidenceCell.value = { classId, dimensionKey: activeDimension.value.key };
}

function chartClick(params) {
  if (params.data?.dimensionKey && params.data?.classId) {
    const dimension = dimensions.value.find((candidate) => candidate.key === params.data.dimensionKey);
    if (!dimension) return;
    chooseDimension(dimension);
    evidenceCell.value = { classId: params.data.classId, dimensionKey: dimension.key };
  } else if (params.data?.classId) {
    evidenceCell.value = null;
    emit('select-class', params.data.classId);
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- 頂部標題 -->
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div>
        <h3 class="text-base font-bold text-slate-800 m-0">班級 × 能力雙維交叉分析</h3>
        <p class="text-xs text-slate-500 m-0">{{ hasCognitive ? '以內容向度與認知層次交叉解析各班表現' : '依內容向度解析各班差異，點選單元格展開名單' }}</p>
      </div>
      <span class="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
        {{ hasCognitive ? '內容 × 認知' : '內容向度' }}
      </span>
    </div>

    <!-- 班級整體排序 + 向度樹狀圖 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <!-- 班級整體排序 -->
      <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 class="text-sm font-bold text-slate-800 m-0">班級整體排序</h4>
          <span class="text-[11px] text-slate-400">答對率由低至高</span>
        </div>
        <div class="space-y-2">
          <button
            v-for="(row, index) in classRows"
            :key="row.classId"
            type="button"
            class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-colors"
            @click="emit('select-class', row.classId)"
          >
            <span class="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold text-xs flex items-center justify-center">
              {{ index + 1 }}
            </span>
            <span class="w-14 text-xs font-bold text-slate-700">{{ row.classId }} 班</span>
            <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                :class="(row.stat.rate || 0) < 0.6 ? 'bg-amber-500' : 'bg-[#3f7d6e]'"
                :style="{ width: `${Math.max(2, (row.stat.rate || 0) * 100)}%` }"
              />
            </div>
            <strong class="w-12 text-right font-mono text-xs text-slate-800">{{ formatPercent(row.stat.rate) }}</strong>
          </button>
        </div>
        <p class="text-[10px] text-slate-400 m-0 pt-1">※ 點擊班級列可鎖定該班深入檢視。</p>
      </article>

      <!-- 向度 Treemap -->
      <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 class="text-sm font-bold text-slate-800 m-0">向度分佈樹狀圖</h4>
          <span class="text-[11px] text-slate-400">面積＝題數・色彩＝答對率</span>
        </div>
        <Subject360Chart
          v-if="dimensions.length"
          :option="dimensionTreemapChart"
          :height="260"
          aria-label="向度分佈樹狀圖"
          @chart-click="treemapClick"
        />
        <p v-else class="text-xs text-slate-400 text-center py-10">目前無可用向度資料。</p>
        <p class="text-[10px] text-slate-400 m-0">※ 點擊格子可切換下方聚焦向度。</p>
      </article>
    </div>

    <!-- 班級 × 向度 2D 熱力矩陣 -->
    <article class="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <h4 class="text-sm font-bold text-slate-800 m-0">班級 × 向度熱力矩陣</h4>
          <p class="text-[11px] text-slate-400 m-0">點擊熱圖單元格，即時展開該班需關注學生清單</p>
        </div>
        <span class="text-xs text-slate-400 font-mono">點擊單元格查看學生</span>
      </div>

      <Subject360Chart
        :option="matrixChart"
        :height="320"
        aria-label="班級向度熱力圖"
        @chart-click="chartClick"
      />

      <!-- 單元格點擊展開名單 (Evidence Students) -->
      <div v-if="evidenceCell && evidenceDimension" class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-2">
        <div class="flex items-center justify-between">
          <h5 class="text-xs font-bold text-slate-800 m-0">
            {{ evidenceCell.classId }} 班・{{ evidenceDimension.label || evidenceDimension.key }}（需教學加強關注學生）
          </h5>
          <span class="text-[11px] text-slate-500 font-mono">共 {{ evidenceStudents.length }} 位</span>
        </div>
        
        <div v-if="evidenceStudents.length" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          <button
            v-for="row in evidenceStudents.slice(0, 18)"
            :key="row.student.id"
            type="button"
            class="p-2 bg-white rounded-lg border border-slate-200 hover:border-emerald-500 text-left transition-colors"
            @click="emit('select-student', row.student.id)"
          >
            <span class="text-xs font-bold text-slate-700 block">{{ row.student.class }}班 {{ row.student.seat }}號</span>
            <strong class="text-xs font-mono text-emerald-700 block">總分 {{ formatPercent(row.student.score) }}</strong>
            <small class="text-[10px] text-rose-500 block">向度 {{ formatPercent(row.stat.rate) }}</small>
          </button>
        </div>
        <p v-else class="text-xs text-slate-400 m-0 py-2">該班在此向度表現平穩，未見顯著落後學生。</p>
      </div>
    </article>
  </div>
</template>
