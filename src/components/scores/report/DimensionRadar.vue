<template>
  <div class="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
    <!-- 頂部標題與視角切換器 (Plan A: 互動下鑽核心) -->
    <div class="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
      <div>
        <h4 class="text-sm font-bold text-slate-800 m-0 flex items-center gap-1.5">
          <span class="w-1.5 h-4 rounded-full bg-[#52796f]"></span>
          {{ radarTitle }}
        </h4>
        <p class="text-[11px] text-slate-400 m-0 mt-0.5">
          {{ radarSubtitle }}
        </p>
      </div>

      <!-- 視角切換按鈕群 -->
      <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
        <button
          type="button"
          @click="selectView('all')"
          class="px-2.5 py-1 rounded-md transition cursor-pointer"
          :class="selectedView === 'all' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
        >
          跨科總覽
        </button>
        <button
          v-for="s in subjects"
          :key="'btn-' + s.key"
          type="button"
          @click="selectView(s.key)"
          class="px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1"
          :class="selectedView === s.key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
        >
          <span class="w-1.5 h-1.5 rounded-full" :style="{ background: s.chipColor }"></span>
          {{ s.short }}
        </button>
      </div>
    </div>

    <!-- 雷達圖 SVG 繪製區 -->
    <div class="relative w-full aspect-square max-w-[360px] mx-auto select-none overflow-visible flex items-center justify-center my-1">
      <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" class="w-full h-full overflow-visible transition-all duration-300">
        <!-- 同心刻度圓 (25%, 50%, 75%, 100%) -->
        <circle
          v-for="f in [0.25, 0.5, 0.75, 1]"
          :key="'ring-' + f"
          :cx="C" :cy="C" :r="R * f"
          fill="none" stroke="#cbd5e1" stroke-width="0.8"
          :stroke-dasharray="f === 1 ? '0' : '2 3'"
        />

        <!-- 放射軸線 -->
        <line
          v-for="a in activeAxes"
          :key="'axis-' + a.key"
          :x1="C" :y1="C" :x2="a.outer[0]" :y2="a.outer[1]"
          :stroke="hoveredKey === a.key ? '#52796f' : '#cbd5e1'"
          :stroke-width="hoveredKey === a.key ? 1.8 : 0.8"
        />

        <!-- 縣市常模多邊形 (藍色點線) -->
        <polygon :points="polygonPoints('county')" fill="none" stroke="#2563eb" stroke-width="1.6" stroke-dasharray="2 3" />

        <!-- 學校平均多邊形 (橘色虛線) -->
        <polygon :points="polygonPoints('school')" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="5 3" />

        <!-- 個人答對率多邊形 -->
        <polygon
          :points="polygonPoints('rate')"
          :fill="currentThemeColor"
          fill-opacity="0.22"
          :stroke="currentThemeColor"
          stroke-width="2.6"
          stroke-linejoin="round"
        />

        <!-- 個人端點節點珠 -->
        <circle
          v-for="a in activeAxes"
          :key="'dot-' + a.key"
          :cx="a.point[0]" :cy="a.point[1]"
          :r="hoveredKey === a.key ? 5.5 : 3.6"
          :fill="currentThemeColor"
          stroke="#ffffff"
          stroke-width="1.4"
          class="cursor-pointer transition-all duration-150"
          @mouseenter="$emit('hover', a.key)"
          @mouseleave="$emit('hover', null)"
        >
          <title>{{ a.label }}：{{ a.rate }}%（縣市 {{ a.bench.county }}%）</title>
        </circle>

        <!-- 軸標籤 -->
        <text
          v-for="a in activeAxes"
          :key="'label-' + a.key"
          :x="a.labelPos[0]" :y="a.labelPos[1] + 3.5"
          :text-anchor="a.anchor"
          font-size="10.5"
          :font-weight="hoveredKey === a.key ? 900 : 700"
          :fill="a.color || '#334155'"
          class="cursor-pointer transition-colors"
          @mouseenter="$emit('hover', a.key)"
          @mouseleave="$emit('hover', null)"
        >
          {{ a.label }}
        </text>
      </svg>
    </div>

    <!-- 底部常模圖例與導讀指引 -->
    <div class="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
      <div class="flex items-center justify-center gap-4 flex-wrap text-[11px] text-slate-500">
        <span class="flex items-center gap-1">
          <span class="w-3 h-2 rounded-xs" :style="{ background: currentThemeColor }"></span>
          個人表現
        </span>
        <span class="flex items-center gap-1">
          <span class="w-4 border-t-2 border-dashed border-[#f59e0b]"></span>
          學校平均
        </span>
        <span class="flex items-center gap-1">
          <span class="w-4 border-t-2 border-dotted border-[#2563eb]"></span>
          縣市常模
        </span>
      </div>
      <p class="text-[10px] text-slate-400 text-center m-0">
        💡 點擊切換視角，可下鑽檢視單科專屬向度雷達（絕不壅擠）
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  subjects: { type: Array, required: true },
  hoveredKey: { type: String, default: null },
  focusSubject: { type: String, default: null }
})

const emit = defineEmits(['hover', 'update:focusSubject'])

const selectedView = ref(props.focusSubject || 'all')

watch(() => props.focusSubject, (newVal) => {
  if (newVal) selectedView.value = newVal
})

function selectView(val) {
  selectedView.value = val
  emit('update:focusSubject', val === 'all' ? null : val)
}

const SIZE = 400
const C = SIZE / 2
const R = 130

const toXY = (angle, r) => [
  Number((C + r * Math.cos(angle)).toFixed(1)),
  Number((C + r * Math.sin(angle)).toFixed(1))
]

// 根據目前選取的視角決定雷達標題
const activeSubject = computed(() =>
  props.subjects.find(s => s.key === selectedView.value)
)

const radarTitle = computed(() => {
  if (activeSubject.value) return `${activeSubject.value.name} 向度深入雷達`
  return '跨領域能力總覽網'
})

const radarSubtitle = computed(() => {
  if (activeSubject.value) {
    return `${activeSubject.value.dims.length} 軸專屬向度 · 空間充裕清晰`
  }
  return `跨 ${props.subjects.length} 科宏觀常模落點 · 乾淨清爽`
})

const currentThemeColor = computed(() => {
  if (activeSubject.value) return activeSubject.value.chipColor
  return '#52796f'
})

// 計算當前顯示的軸向清單
const rawAxes = computed(() => {
  // 1. 單科深潛視角 (國語 10 軸、數學 4 軸、英語 4 軸)
  if (activeSubject.value) {
    const s = activeSubject.value
    return s.dims.map(d => ({
      key: d.key,
      label: d.short,
      fullName: d.name,
      rate: d.rate,
      bench: d.bench,
      color: s.chipColor
    }))
  }

  // 2. 跨科總覽視角
  if (props.subjects.length === 3) {
    // 3 年級有 3 科 (5 年級：國、數、英) -> 3 軸三角雷達
    return props.subjects.map(s => ({
      key: `sub-${s.key}`,
      label: `${s.name} (${s.rate}%)`,
      fullName: s.name,
      rate: s.rate,
      bench: s.bench,
      color: s.chipColor
    }))
  }

  // 2 科 (3 年級：國、數) -> 4 軸 (每科抓 2 大核心群組，正方形/菱形)
  const items = []
  props.subjects.forEach(s => {
    if (s.dims.length >= 2) {
      const half = Math.ceil(s.dims.length / 2)
      const d1 = s.dims.slice(0, half)
      const d2 = s.dims.slice(half)
      const avgRate = (arr) => Math.round(arr.reduce((sum, d) => sum + d.rate, 0) / arr.length)
      const avgBench = (arr, key) => Math.round(arr.reduce((sum, d) => sum + d.bench[key], 0) / arr.length)

      items.push({
        key: `core-${s.key}-1`,
        label: `${s.short}－基礎理解`,
        fullName: `${s.name} 基礎`,
        rate: avgRate(d1),
        bench: { school: avgBench(d1, 'school'), county: avgBench(d1, 'county') },
        color: s.chipColor
      })
      items.push({
        key: `core-${s.key}-2`,
        label: `${s.short}－進階應用`,
        fullName: `${s.name} 進階`,
        rate: avgRate(d2),
        bench: { school: avgBench(d2, 'school'), county: avgBench(d2, 'county') },
        color: s.chipColor
      })
    } else {
      items.push({
        key: `sub-${s.key}`,
        label: s.name,
        fullName: s.name,
        rate: s.rate,
        bench: s.bench,
        color: s.chipColor
      })
    }
  })
  return items
})

const activeAxes = computed(() => {
  const n = rawAxes.value.length
  const step = (2 * Math.PI) / Math.max(1, n)
  return rawAxes.value.map((a, i) => {
    const angle = -Math.PI / 2 + i * step
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return {
      ...a,
      angle,
      outer: toXY(angle, R),
      point: toXY(angle, (Math.max(0, Math.min(100, a.rate)) / 100) * R),
      labelPos: toXY(angle, R + 14),
      anchor: cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle'
    }
  })
})

function polygonPoints(type) {
  const axes = activeAxes.value
  return axes
    .map(a => {
      const v = type === 'rate' ? a.rate : (a.bench ? a.bench[type] : 70)
      const r = (Math.max(0, Math.min(100, v)) / 100) * R
      return toXY(a.angle, r).join(',')
    })
    .join(' ')
}
</script>
