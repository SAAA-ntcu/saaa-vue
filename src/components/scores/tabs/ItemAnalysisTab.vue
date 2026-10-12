<template>
  <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
    <!-- Top Actions Bar -->
    <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
      <div class="flex items-center gap-3 flex-wrap">
        <select v-model="analysisFilters.year" class="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition">
          <option value="115">115 年度</option>
          <option value="114">114 年度</option>
          <option value="113">113 年度</option>
        </select>
        <select v-model="analysisFilters.grade" class="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition">
          <option value="3">三年級</option>
          <option value="4">四年級</option>
          <option value="5">五年級</option>
          <option value="6">六年級</option>
        </select>
        <select v-model="analysisFilters.subject" class="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition">
          <option value="國語文">國語文</option>
          <option value="數學">數學</option>
          <option value="英語文">英語文</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <button @click="downloadSpecialReport('學校試題分析結果')" class="h-9 px-3 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          學校試題分析結果
        </button>
        <button @click="downloadSpecialReport('縣市試題分析結果')" class="h-9 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
          <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          縣市試題分析結果
        </button>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="p-5 border-b border-slate-100 relative">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-sm font-bold text-slate-800 flex items-center gap-2">
          <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
          校級答對率圖
        </h4>
        <div class="flex items-center gap-4 text-xs font-medium">
          <div class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-[#52796f]"></span>學校</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-[#e07a5f]"></span>縣市</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-slate-300" style="border-top: 2px dashed #94a3b8"></span>整體</div>
        </div>
      </div>

      <div class="w-full overflow-x-auto scrollbar-thin py-2" @mouseleave="hoveredPoint = null">
        <div class="min-w-[720px] relative px-1">
          <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="w-full h-auto overflow-visible">
            <!-- Y Axis labels -->
            <g class="text-[10px] fill-slate-400 font-mono">
              <text :x="chartPadding.left - 10" :y="chartPadding.top + 4" text-anchor="end">100%</text>
              <text :x="chartPadding.left - 10" :y="(chartHeight - chartPadding.bottom + chartPadding.top) / 2 + 4" text-anchor="end">50%</text>
              <text :x="chartPadding.left - 10" :y="chartHeight - chartPadding.bottom + 4" text-anchor="end">0%</text>
            </g>
            
            <!-- Grid lines -->
            <g class="stroke-slate-100" stroke-width="1" stroke-dasharray="4 4">
              <line :x1="chartPadding.left" :y1="chartPadding.top" :x2="chartWidth - chartPadding.right" :y2="chartPadding.top" />
              <line :x1="chartPadding.left" :y1="(chartHeight - chartPadding.bottom + chartPadding.top) / 2" :x2="chartWidth - chartPadding.right" :y2="(chartHeight - chartPadding.bottom + chartPadding.top) / 2" />
              <line :x1="chartPadding.left" :y1="chartHeight - chartPadding.bottom" :x2="chartWidth - chartPadding.right" :y2="chartHeight - chartPadding.bottom" stroke-dasharray="none" class="stroke-slate-200" />
            </g>

            <!-- Overall Path -->
            <path :d="chartPaths.overall" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4" />
            <!-- County Path -->
            <path :d="chartPaths.county" fill="none" stroke="#e07a5f" stroke-width="2" />
            <!-- School Path -->
            <path :d="chartPaths.school" fill="none" stroke="#52796f" stroke-width="2.5" />

            <!-- Hover interaction area per point -->
            <g v-for="p in chartPoints" :key="'area-'+p.data.qNum">
              <rect 
                :x="p.x - ((chartWidth - chartPadding.left - chartPadding.right) / Math.max(1, chartPoints.length - 1)) / 2" 
                :y="chartPadding.top" 
                :width="(chartWidth - chartPadding.left - chartPadding.right) / Math.max(1, chartPoints.length - 1)" 
                :height="chartHeight - chartPadding.top - chartPadding.bottom" 
                fill="transparent" 
                class="cursor-pointer"
                @mouseover="hoveredPoint = p"
              />
            </g>

            <!-- Points and Indicators -->
            <g v-for="p in chartPoints" :key="'pt-'+p.data.qNum">
              <!-- X Axis labels -->
              <text :x="p.x" :y="chartHeight - 12" text-anchor="middle" class="text-[10px] fill-slate-500 font-mono">{{ p.data.qNum }}</text>
              
              <!-- Highlight weak questions on X axis -->
              <circle v-if="p.isWeak" :cx="p.x" :cy="chartHeight - 26" r="3" fill="#e07a5f" />

              <!-- Hover state styling -->
              <g v-if="hoveredPoint && hoveredPoint.data.qNum === p.data.qNum">
                <!-- Vertical guideline -->
                <line :x1="p.x" :y1="chartPadding.top" :x2="p.x" :y2="chartHeight - chartPadding.bottom" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3" />
                
                <!-- Hovered Points -->
                <circle :cx="p.x" :cy="p.overallY" r="4" fill="#fff" stroke="#94a3b8" stroke-width="2" />
                <circle :cx="p.x" :cy="p.countyY" r="4" fill="#fff" stroke="#e07a5f" stroke-width="2" />
                <circle :cx="p.x" :cy="p.schoolY" r="5" fill="#fff" stroke="#52796f" stroke-width="2.5" />
              </g>
              <g v-else>
                <!-- Normal Points -->
                <circle :cx="p.x" :cy="p.schoolY" r="3" fill="#52796f" />
              </g>
            </g>
          </svg>
          
          <!-- Tooltip (自動防切邊：上下自適應翻轉、左右安全邊界錨定) -->
          <div
            v-if="hoveredPoint && tooltipConfig"
            class="absolute z-30 bg-slate-900/95 backdrop-blur-sm text-white px-3.5 py-2.5 rounded-xl shadow-2xl border border-slate-700/80 text-xs pointer-events-none transition-all duration-150 min-w-[170px]"
            :class="[
              tooltipConfig.isUpperHalf ? 'mt-3.5 translate-y-0' : '-mt-3.5 -translate-y-full',
              tooltipConfig.horizontalAlign === 'left' ? 'translate-x-[-15%]' : tooltipConfig.horizontalAlign === 'right' ? 'translate-x-[-85%]' : '-translate-x-1/2'
            ]"
            :style="{
              left: `${tooltipConfig.xPercent}%`,
              top: `${tooltipConfig.yPercent}%`
            }"
          >
            <!-- 題號標題 -->
            <div class="mb-1.5 border-b border-slate-700/80 pb-1.5 font-bold text-emerald-300">
              第 {{ hoveredPoint.data.qNum }} 題
            </div>

            <!-- 答對率指標矩陣 -->
            <div class="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
              <div class="flex justify-between items-center text-slate-300">
                <span>學校:</span>
                <span class="font-bold text-emerald-400">{{ hoveredPoint.data.schoolAcc }}%</span>
              </div>
              <div class="flex justify-between items-center text-slate-300">
                <span>縣市:</span>
                <span class="text-amber-200">{{ hoveredPoint.data.countyAcc }}%</span>
              </div>
              <div class="flex justify-between items-center text-slate-400">
                <span>整體:</span>
                <span>{{ hoveredPoint.data.overallAcc }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-400">落差:</span>
                <span
                  class="font-bold"
                  :class="Number(hoveredPoint.data.schoolAcc) - Number(hoveredPoint.data.countyAcc) < 0 ? 'text-rose-400' : 'text-emerald-400'"
                >
                  {{ (Number(hoveredPoint.data.schoolAcc) - Number(hoveredPoint.data.countyAcc)) > 0 ? '+' : '' }}{{ (Number(hoveredPoint.data.schoolAcc) - Number(hoveredPoint.data.countyAcc)).toFixed(1) }}%
                </span>
              </div>
            </div>

            <!-- 指示箭頭 -->
            <div
              v-if="tooltipConfig.isUpperHalf"
              class="absolute -top-1.5 w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-slate-900"
              :class="{
                'left-1/2 -translate-x-1/2': tooltipConfig.horizontalAlign === 'center',
                'left-5': tooltipConfig.horizontalAlign === 'left',
                'right-5': tooltipConfig.horizontalAlign === 'right'
              }"
            ></div>
            <div
              v-else
              class="absolute -bottom-1.5 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-slate-900"
              :class="{
                'left-1/2 -translate-x-1/2': tooltipConfig.horizontalAlign === 'center',
                'left-5': tooltipConfig.horizontalAlign === 'left',
                'right-5': tooltipConfig.horizontalAlign === 'right'
              }"
            ></div>
          </div>
        </div>
      </div>
      <div class="mt-2 text-center text-[11px] text-slate-400">
        <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#e07a5f]"></span> 題號上方的紅點表示該題本校答對率顯著低於縣市平均 (相差 > 10%)</span>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="p-5">
      <h4 class="text-sm font-bold text-slate-800 mb-3">試題詳細數據</h4>
      <div class="border border-slate-200/80 rounded-xl overflow-hidden">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <th class="py-2.5 px-4 cursor-pointer hover:bg-slate-100 select-none w-20" @click="sortBy('qNum')">
                <div class="flex items-center gap-1">題號 <span v-if="sortKey==='qNum'" class="text-[10px]">{{ sortOrder==='asc'?'▲':'▼' }}</span></div>
              </th>
              <th class="py-2.5 px-4 text-center cursor-pointer hover:bg-slate-100 select-none" @click="sortBy('schoolAcc')">
                <div class="flex items-center justify-center gap-1">學校答對率 <span v-if="sortKey==='schoolAcc'" class="text-[10px]">{{ sortOrder==='asc'?'▲':'▼' }}</span></div>
              </th>
              <th class="py-2.5 px-4 text-center cursor-pointer hover:bg-slate-100 select-none hidden sm:table-cell" @click="sortBy('countyAcc')">
                <div class="flex items-center justify-center gap-1">縣市答對率 <span v-if="sortKey==='countyAcc'" class="text-[10px]">{{ sortOrder==='asc'?'▲':'▼' }}</span></div>
              </th>
              <th class="py-2.5 px-4 text-center cursor-pointer hover:bg-slate-100 select-none hidden md:table-cell" @click="sortBy('overallAcc')">
                <div class="flex items-center justify-center gap-1">整體答對率 <span v-if="sortKey==='overallAcc'" class="text-[10px]">{{ sortOrder==='asc'?'▲':'▼' }}</span></div>
              </th>
              <th class="py-2.5 px-4 text-center cursor-pointer hover:bg-slate-100 select-none" @click="sortBy('delta')">
                <div class="flex items-center justify-center gap-1">校與縣市落差 (Δ) <span v-if="sortKey==='delta'" class="text-[10px]">{{ sortOrder==='asc'?'▲':'▼' }}</span></div>
              </th>
              <th class="py-2.5 px-3 text-center w-20">試題診斷</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
            <tr
              v-for="d in sortedAnalysisData"
              :key="d.qNum"
              @click="openQuestionDialog(d)"
              class="hover:bg-slate-50/80 transition cursor-pointer"
              :class="{'bg-rose-50/30': (Number(d.schoolAcc) - Number(d.countyAcc)) <= -10}"
            >
              <td class="py-2 px-4 font-mono text-slate-500 font-bold">{{ d.qNum }}</td>
              <td class="py-2 px-4 text-center font-mono font-bold text-[#52796f]">{{ d.schoolAcc }}%</td>
              <td class="py-2 px-4 text-center font-mono hidden sm:table-cell">{{ d.countyAcc }}%</td>
              <td class="py-2 px-4 text-center font-mono hidden md:table-cell text-slate-400">{{ d.overallAcc }}%</td>
              <td class="py-2 px-4 text-center font-mono font-bold">
                <span :class="(Number(d.schoolAcc) - Number(d.countyAcc)) < 0 ? 'text-[#e07a5f]' : 'text-emerald-600'">
                  {{ (Number(d.schoolAcc) - Number(d.countyAcc)) > 0 ? '+' : '' }}{{ (Number(d.schoolAcc) - Number(d.countyAcc)).toFixed(1) }}%
                </span>
              </td>
              <td class="py-2 px-3 text-center">
                <button
                  type="button"
                  @click.stop="openQuestionDialog(d)"
                  class="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition cursor-pointer"
                >
                  診斷
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 試題深度診斷對話框 -->
    <SubjectItemDialog
      :visible="isQuestionDialogVisible"
      :item="selectedQuestionItem"
      @close="isQuestionDialogVisible = false"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { scoreService } from '../../../services/scoreService'
import {
  isGaotongGrade,
  getQuestionDeepDiagnostic,
  getGaotongSubjectItems
} from '../../../composables/useGaotongData'
import SubjectItemDialog from '../report/SubjectItemDialog.vue'

const isQuestionDialogVisible = ref(false)
const selectedQuestionItem = ref(null)

const analysisFilters = reactive({
  year: '115',
  grade: '5',
  subject: '國語文'
})

function downloadSpecialReport(name) {
  ElMessage.success(`正在產生並下載【${name}】...`)
}

function openQuestionDialog(d) {
  if (isGaotongGrade(analysisFilters.grade)) {
    selectedQuestionItem.value = getQuestionDeepDiagnostic(
      analysisFilters.subject,
      d.qNum,
      '501'
    )
  } else {
    selectedQuestionItem.value = {
      q: d.qNum,
      rate: Number(d.schoolAcc),
      countyRate: Number(d.countyAcc),
      content: analysisFilters.subject !== 'all' ? analysisFilters.subject : '試題內容向度',
      answer: ((d.qNum * 3) % 4) + 1
    }
  }
  isQuestionDialogVisible.value = true
}

const analysisData = ref([])

async function loadData() {
  if (isGaotongGrade(analysisFilters.grade)) {
    analysisData.value = getGaotongSubjectItems(analysisFilters.subject)
  } else {
    const res = await scoreService.getQuestionAnalysisData(30)
    if (res.success && res.data) {
      analysisData.value = res.data
    }
  }
}

watch(
  () => [analysisFilters.grade, analysisFilters.subject],
  () => {
    loadData()
  },
  { immediate: true }
)

const sortKey = ref('qNum')
const sortOrder = ref('asc')

const sortedAnalysisData = computed(() => {
  return [...analysisData.value].sort((a, b) => {
    let valA = a[sortKey.value]
    let valB = b[sortKey.value]

    if (sortKey.value === 'delta') {
      valA = Number(a.schoolAcc) - Number(a.countyAcc)
      valB = Number(b.schoolAcc) - Number(b.countyAcc)
    } else {
      valA = Number(valA)
      valB = Number(valB)
    }

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = key === 'qNum' ? 'asc' : 'desc'
  }
}

const hoveredPoint = ref(null)

const chartWidth = 860
const chartHeight = 290
const chartPadding = { top: 35, right: 35, bottom: 45, left: 55 }

const chartPoints = computed(() => {
  const data = analysisData.value
  const numPoints = data.length
  const xStep = (chartWidth - chartPadding.left - chartPadding.right) / Math.max(1, numPoints - 1)

  const getY = (val) => {
    const height = chartHeight - chartPadding.top - chartPadding.bottom
    return chartHeight - chartPadding.bottom - (Number(val) / 100) * height
  }

  return data.map((d, i) => {
    const x = chartPadding.left + i * xStep
    return {
      x,
      data: d,
      schoolY: getY(d.schoolAcc),
      countyY: getY(d.countyAcc),
      overallY: getY(d.overallAcc),
      isWeak: (Number(d.schoolAcc) - Number(d.countyAcc)) <= -10
    }
  })
})

const tooltipConfig = computed(() => {
  if (!hoveredPoint.value) return null
  const p = hoveredPoint.value
  const isUpperHalf = p.schoolY <= 140

  let horizontalAlign = 'center'
  if (p.x < 150) {
    horizontalAlign = 'left'
  } else if (p.x > chartWidth - 150) {
    horizontalAlign = 'right'
  }

  return {
    isUpperHalf,
    horizontalAlign,
    xPercent: (p.x / chartWidth) * 100,
    yPercent: (p.schoolY / chartHeight) * 100
  }
})

const chartPaths = computed(() => {
  const points = chartPoints.value
  if (points.length === 0) return { school: '', county: '', overall: '' }
  return {
    school: points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.schoolY}`).join(' '),
    county: points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.countyY}`).join(' '),
    overall: points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.overallY}`).join(' ')
  }
})
</script>
