<script setup>
import { computed, ref, watch } from 'vue';
import SubjectItemDialog from '../report/SubjectItemDialog.vue';
import Subject360Chart from './Subject360Chart.vue';
import {
  formatCount,
  formatPercent,
  formatPoints,
  getClassStudents,
  getLinkedDimensions,
  getLinkedDimensionStat,
  getOverall,
  getStudentProfile
} from '../../../composables/useSubject360';

const props = defineProps({
  subject: { type: Object, required: true },
  selectedClasses: { type: Array, required: true },
  visibleClassIds: { type: Array, default: () => [] },
  initialStudentId: { type: String, default: '' },
  visible: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'select-class', 'select-student']);

const candidates = computed(() => getClassStudents(props.subject, props.selectedClasses));
const selectedStudentId = ref(props.initialStudentId || '');
const focusedQuestion = ref(null);
const dimensions = computed(() => getLinkedDimensions(props.subject));
const student = computed(() => candidates.value.find((candidate) => candidate.id === selectedStudentId.value) || candidates.value[0] || null);
const profile = computed(() => getStudentProfile(props.subject, student.value));
const classScope = computed(() => props.visibleClassIds.length ? props.visibleClassIds : props.subject?.classIds || []);
const comparisonLabel = computed(() => classScope.value.length === props.subject?.classIds?.length ? '全校' : '可見範圍');

const allResponses = computed(() => (props.subject?.items || []).map((item) => ({
  item,
  response: student.value?.responses?.[item.q - 1],
  status: student.value?.responses?.[item.q - 1] == null ? 'missing' : student.value.responses[item.q - 1] === item.answer ? 'correct' : 'wrong'
})));

const linkedRows = computed(() => dimensions.value.map((dimension) => {
  const studentRow = profile.value?.linked.find((row) => row.key === dimension.key);
  const classRate = student.value ? getLinkedDimensionStat(props.subject, dimension, [student.value.class]).rate : null;
  return { dimension, studentRate: studentRow?.rate, classRate };
}));

function radarLabel(dimension) {
  const label = dimension.cognitiveKey || dimension.label || dimension.key;
  return label.length > 8 ? `${label.slice(0, 7)}…` : label;
}

function radarValue(rate) {
  return rate == null ? 0 : Number((rate * 100).toFixed(1));
}

const dimensionRadarChart = computed(() => {
  const rows = linkedRows.value;
  return {
    animation: false,
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const values = Array.isArray(params.value) ? params.value : [];
        const details = rows.map((row, index) => `${row.dimension.label || row.dimension.key}：${Number(values[index] ?? 0).toFixed(1)}%`);
        return `${params.name}<br/>${details.join('<br/>')}`;
      }
    },
    legend: {
      bottom: 0,
      data: ['學生個人', '班級平均'],
      itemWidth: 14,
      itemHeight: 8,
      textStyle: { color: '#64748b', fontSize: 11 }
    },
    radar: {
      center: ['50%', '45%'],
      radius: '62%',
      splitNumber: 4,
      indicator: rows.map((row) => ({ name: radarLabel(row.dimension), max: 100 })),
      axisName: { color: '#475569', fontSize: 10, lineHeight: 13 },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
      splitArea: { areaStyle: { color: ['rgba(248, 250, 252, 0.8)', 'rgba(255, 255, 255, 0.8)'] } }
    },
    series: [{
      type: 'radar',
      symbol: 'circle',
      symbolSize: 4,
      data: [
        {
          name: '學生個人',
          value: rows.map((row) => radarValue(row.studentRate)),
          lineStyle: { color: '#3f7d6e', width: 2 },
          itemStyle: { color: '#3f7d6e' },
          areaStyle: { color: 'rgba(63, 125, 110, 0.2)' }
        },
        {
          name: '班級平均',
          value: rows.map((row) => radarValue(row.classRate)),
          lineStyle: { color: '#94a3b8', width: 2, type: 'dashed' },
          itemStyle: { color: '#94a3b8' },
          areaStyle: { color: 'rgba(148, 163, 184, 0.1)' }
        }
      ]
    }]
  };
});

watch([candidates, () => props.initialStudentId], () => {
  if (props.initialStudentId && candidates.value.some((candidate) => candidate.id === props.initialStudentId)) {
    selectedStudentId.value = props.initialStudentId;
  } else if (!candidates.value.some((candidate) => candidate.id === selectedStudentId.value)) {
    selectedStudentId.value = candidates.value[0]?.id || '';
  }
}, { immediate: true });

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
  <div v-if="visible" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" @click="emit('close')"></div>

    <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
      <div class="w-screen max-w-xl bg-white shadow-2xl flex flex-col">
        <!-- 抽屜頂部 -->
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {{ student?.class }} 班・單科個人診斷卡
            </span>
            <h3 class="text-lg font-bold text-slate-800 m-0">
              座號 {{ student?.seat }} 號
              <span class="text-xs font-normal text-slate-400 font-mono ml-1">({{ student?.id }})</span>
            </h3>
          </div>
          <button
            type="button"
            class="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <!-- 學生切換選單 -->
        <div class="p-3 bg-white border-b border-slate-100 flex items-center gap-2">
          <label class="text-xs font-bold text-slate-500">切換學生：</label>
          <select
            v-model="selectedStudentId"
            class="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 flex-1 outline-none"
            @change="emit('select-student', selectedStudentId)"
          >
            <option v-for="c in candidates" :key="c.id" :value="c.id">
              {{ c.class }} 班 {{ c.seat }} 號 ({{ c.id }}) - 答對率 {{ formatPercent(c.score) }}
            </option>
          </select>
        </div>

        <!-- 抽屜內容 -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <!-- 3 大摘要指標 -->
          <div class="grid grid-cols-3 gap-2.5">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <span class="text-[11px] font-bold text-slate-400 block">科目答對率</span>
              <strong class="text-lg font-black text-slate-800 font-mono block mt-0.5">{{ formatPercent(student?.score) }}</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <span class="text-[11px] font-bold text-slate-400 block">錯題總數</span>
              <strong class="text-lg font-black text-rose-600 font-mono block mt-0.5">{{ formatCount(profile?.wrongItems?.length) }}</strong>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <span class="text-[11px] font-bold text-slate-400 block">未答/缺答</span>
              <strong class="text-lg font-black text-slate-500 font-mono block mt-0.5">{{ formatCount(profile?.missing) }}</strong>
            </div>
          </div>

          <!-- 雷達圖 -->
          <div class="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-slate-800 m-0">向度能力雷達對照</h4>
              <span class="text-[10px] text-slate-400">個人 vs 班級平均</span>
            </div>
            <Subject360Chart
              :option="dimensionRadarChart"
              :height="240"
              aria-label="學生向度雷達圖"
            />
          </div>

          <!-- 25 題作答矩陣 -->
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-slate-800 m-0">試卷全題作答分佈</h4>
              <div class="flex items-center gap-3 text-[10px] text-slate-500">
                <span class="flex items-center gap-1"><i class="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></i>答對</span>
                <span class="flex items-center gap-1"><i class="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></i>錯題</span>
                <span class="flex items-center gap-1"><i class="w-2.5 h-2.5 rounded bg-slate-300 inline-block"></i>缺答</span>
              </div>
            </div>
            <div class="grid grid-cols-5 sm:grid-cols-7 gap-1.5 pt-1">
              <button
                v-for="r in allResponses"
                :key="r.item.q"
                type="button"
                class="p-1.5 rounded-lg border text-center transition-transform hover:scale-105"
                :class="r.status === 'correct' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : r.status === 'wrong' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-slate-100 text-slate-500 border-slate-200'"
                @click="openQuestion(r.item.q)"
              >
                <b class="text-xs block font-mono">Q{{ r.item.q }}</b>
                <small class="text-[10px] block mt-0.5">
                  {{ r.status === 'correct' ? '✓' : r.response ? ['A', 'B', 'C', 'D'][r.response - 1] : '—' }}
                </small>
              </button>
            </div>
          </div>

          <!-- 錯題明細與誘答分析 -->
          <div v-if="profile?.wrongItems?.length" class="space-y-2">
            <h4 class="text-xs font-bold text-slate-800 m-0">錯題診斷明細（點選題號展開診斷）：</h4>
            <div class="space-y-2">
              <div
                v-for="item in profile.wrongItems"
                :key="item.q"
                class="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs hover:border-slate-300 cursor-pointer"
                @click="openQuestion(item.q)"
              >
                <div>
                  <strong class="text-slate-800 block">Q{{ item.q }} {{ item.short }}</strong>
                  <span class="text-[11px] text-slate-400">{{ [item.content, item.cognitive].filter(Boolean).join(' × ') }}</span>
                </div>
                <div class="text-right">
                  <span class="text-rose-600 font-bold block">
                    選答 {{ student.responses[item.q - 1] ? ['A', 'B', 'C', 'D'][student.responses[item.q - 1] - 1] : '未答' }}
                  </span>
                  <small class="text-[10px] text-emerald-700">正解 {{ ['A', 'B', 'C', 'D'][item.answer - 1] }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 試題診斷彈窗 -->
    <SubjectItemDialog
      :visible="Boolean(focusedQuestion)"
      :item="focusedQuestion"
      @close="focusedQuestion = null"
    />
  </div>
</template>
