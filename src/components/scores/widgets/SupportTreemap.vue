<template>
  <div class="w-full relative select-none">
    <div
      ref="chartElement"
      class="w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden cursor-pointer"
      role="img"
      aria-label="各班待加強人數分布樹狀圖"
    ></div>
    <div class="mt-2 flex items-center justify-between text-[11px] text-slate-400">
      <span>💡 面積大小代表該班待加強人數；點擊任一班級區塊可直接穿透查看該班</span>
      <span class="font-mono">單位：人</span>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { buildGaotongTreemapData } from '../../../composables/useGaotongData'

const props = defineProps({
  subjectKey: { type: String, default: 'math' }
})

const emit = defineEmits(['select-class'])

const chartElement = ref(null)
let chartInstance = null
let resizeObserver = null

function formatDelta(val) {
  return `${val > 0 ? '+' : val === 0 ? '±' : ''}${Number(val).toFixed(1)} pp`
}

function renderChart() {
  if (!chartElement.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartElement.value)
    chartInstance.on('click', (params) => {
      if (params.data?.classId) {
        emit('select-class', params.data.classId)
      }
    })
  }

  const treeData = buildGaotongTreemapData(props.subjectKey)

  chartInstance.setOption({
    animationDuration: 480,
    animationDurationUpdate: 320,
    tooltip: {
      confine: true,
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#1e293b', fontSize: 12 },
      formatter: (params) => {
        const item = params.data
        if (!item?.classId) {
          return `<strong>${item?.name || ''}</strong><br/>全學年待加強：${item?.value || 0} 人`
        }
        return `
          <div class="font-sans space-y-1">
            <div class="font-bold text-slate-800 text-sm border-b border-slate-100 pb-1">
              ${item.classId} 班 · ${item.name}
            </div>
            <div class="text-xs text-slate-600 flex justify-between gap-4">
              <span>待加強人數：</span>
              <strong class="font-mono text-rose-600">${item.supportCount} / ${item.tested} 人 (${item.supportRate}%)</strong>
            </div>
            <div class="text-xs text-slate-500 flex justify-between gap-4">
              <span>與學年同儕差距：</span>
              <strong class="font-mono text-slate-700">${formatDelta(item.delta)}</strong>
            </div>
            <div class="text-[10px] text-emerald-700 font-bold mt-1">
              點擊直達該班 ➔
            </div>
          </div>
        `
      }
    },
    series: [
      {
        type: 'treemap',
        data: treeData,
        roam: false,
        nodeClick: false,
        leafDepth: 2,
        squareRatio: 1.15,
        breadcrumb: { show: false },
        visibleMin: 1,
        upperLabel: {
          show: true,
          height: 26,
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 800,
          backgroundColor: '#334155'
        },
        label: {
          show: true,
          formatter: (params) => {
            const d = params.data
            if (!d?.classId) return params.name
            return `${d.classId} 班\n${d.supportCount} 人`
          },
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 800,
          lineHeight: 16
        },
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 2,
          gapWidth: 2
        },
        levels: [
          {
            itemStyle: { borderColor: '#334155', borderWidth: 2, gapWidth: 2 }
          },
          {
            itemStyle: { borderColor: '#ffffff', borderWidth: 2, gapWidth: 2 },
            label: { show: true }
          }
        ]
      }
    ]
  }, true)
}

onMounted(async () => {
  await nextTick()
  renderChart()
  if (typeof ResizeObserver !== 'undefined' && chartElement.value) {
    resizeObserver = new ResizeObserver(() => chartInstance?.resize())
    resizeObserver.observe(chartElement.value)
  }
})

watch(() => props.subjectKey, () => {
  renderChart()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chartInstance?.dispose()
  chartInstance = null
})
</script>
