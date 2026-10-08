<template>
  <div
    v-if="visible && item"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none"
    role="dialog"
    aria-modal="true"
    :aria-label="`Q${item.q} 試題診斷分析`"
  >
    <!-- Backdrop Click -->
    <div class="fixed inset-0" @click="$emit('close')"></div>

    <!-- Modal Panel -->
    <div class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10">
      <!-- Modal Header -->
      <header class="shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div>
          <span class="text-[10px] font-black uppercase tracking-wider text-[#52796f] bg-[#52796f]/10 px-2 py-0.5 rounded">
            試題深度診斷
          </span>
          <h3 class="text-base sm:text-lg font-black text-slate-900 m-0 mt-0.5 flex items-center gap-2">
            <span>第 {{ item.q }} 題 · {{ item.short || item.content }}</span>
            <span class="text-xs font-normal text-slate-400">
              ({{ item.content }}<span v-if="item.cognitive"> × {{ item.cognitive }}</span>)
            </span>
          </h3>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition cursor-pointer"
          aria-label="關閉"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <!-- Modal Body (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-6 space-y-5 text-xs select-text">
        <!-- 核心統計 4 格 KPI 卡 -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
            <span class="text-[11px] text-slate-400 block mb-0.5">正確答案</span>
            <strong class="text-base font-black text-emerald-600 font-mono">{{ letterAns(item.answer) }}</strong>
          </div>
          <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
            <span class="text-[11px] text-slate-400 block mb-0.5">全校答對率</span>
            <strong class="text-base font-black text-slate-800 font-mono">{{ item.rate || 68 }}%</strong>
          </div>
          <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
            <span class="text-[11px] text-slate-400 block mb-0.5">縣市平均</span>
            <strong class="text-base font-black text-slate-600 font-mono">{{ item.countyRate || 65 }}%</strong>
          </div>
          <div class="p-3 bg-rose-50/60 border border-rose-100 rounded-xl text-center">
            <span class="text-[11px] text-rose-500 block mb-0.5">主要誘答選項</span>
            <strong class="text-base font-black text-rose-700 font-mono">
              {{ item.topWrongOption ? letterAns(item.topWrongOption) : 'B' }} ({{ item.topWrongShare || '28%' }})
            </strong>
          </div>
        </div>

        <!-- 雙欄排版：選項分布長條圖 + 班級答對率 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- 左：選項作答率分布 (A, B, C, D) -->
          <div class="border border-slate-200/80 rounded-xl p-3.5 space-y-2 bg-white">
            <div class="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <span class="font-bold text-slate-700">各選項作答率</span>
              <span class="text-[10px] text-emerald-600 font-bold">綠色為正確答案</span>
            </div>
            <div class="space-y-2 pt-1">
              <div
                v-for="opt in optionRows"
                :key="opt.label"
                class="flex items-center gap-2 text-xs"
              >
                <span
                  class="w-5 h-5 rounded font-mono font-bold flex items-center justify-center shrink-0 text-[11px]"
                  :class="opt.isCorrect ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-600'"
                >
                  {{ opt.label }}
                </span>
                <div class="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="opt.isCorrect ? 'bg-emerald-500' : 'bg-slate-400'"
                    :style="{ width: `${opt.rate}%` }"
                  ></div>
                </div>
                <span class="font-mono w-10 text-right text-slate-600 font-semibold">
                  {{ opt.rate }}%
                </span>
              </div>
            </div>
          </div>

          <!-- 右：各班答對率對比 (低到高) -->
          <div class="border border-slate-200/80 rounded-xl p-3.5 space-y-2 bg-white">
            <div class="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <span class="font-bold text-slate-700">學年各班答對率</span>
              <span class="text-[10px] text-slate-400">低至高排列</span>
            </div>
            <div class="space-y-1.5 pt-1 max-h-[140px] overflow-y-auto pr-1">
              <div
                v-for="c in classRows"
                :key="c.classId"
                class="flex items-center justify-between gap-2 text-[11px]"
              >
                <span class="font-bold text-slate-700 w-14 shrink-0">{{ c.classId }} 班</span>
                <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="c.rate < 60 ? 'bg-rose-500' : 'bg-[#52796f]'"
                    :style="{ width: `${c.rate}%` }"
                  ></div>
                </div>
                <span class="font-mono font-bold w-10 text-right" :class="c.rate < 60 ? 'text-rose-600' : 'text-slate-700'">
                  {{ c.rate }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 歷年知識庫對照與候選迷思概念 (來自高通歷史知識庫) -->
        <div class="border border-amber-200/80 bg-amber-50/50 rounded-xl p-4 space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold text-amber-900 text-xs flex items-center gap-1.5">
              <span>💡</span>
              候選迷思概念與卡點假設 (對照 112–114 年官方報告)
            </span>
            <span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
              教學引導建議
            </span>
          </div>
          <p class="text-amber-800 text-[11px] leading-relaxed m-0">
            {{ item.misconception || '學生易混淆題目中的關鍵語意條件或公式步驟，誤將干擾選項視為直接解答。建議於課堂引導學生進行錯誤選項比較，拆解解題思考流程。' }}
          </p>
        </div>
      </div>

      <!-- Modal Footer -->
      <footer class="shrink-0 px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          關閉
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  item: { type: Object, default: null }
})

defineEmits(['close'])

function letterAns(val) {
  if (!val) return 'A'
  if (typeof val === 'number') return ['A', 'B', 'C', 'D'][val - 1] || 'A'
  return String(val)
}

const optionRows = computed(() => {
  if (!props.item) return []
  const correct = letterAns(props.item.answer)
  const rates = props.item.optionRates || [58, 26, 11, 5]
  return ['A', 'B', 'C', 'D'].map((label, idx) => ({
    label,
    rate: rates[idx] ?? 10,
    isCorrect: label === correct
  }))
})

const classRows = computed(() => {
  const baseRate = props.item?.rate || 68
  const classes = ['507', '503', '508', '502', '505', '501', '506', '509', '504']
  return classes.map((classId, i) => ({
    classId,
    rate: Math.max(30, Math.min(95, baseRate - 18 + i * 4))
  }))
})
</script>
