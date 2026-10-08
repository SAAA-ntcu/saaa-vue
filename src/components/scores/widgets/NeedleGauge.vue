<template>
  <div
    ref="chartElement"
    class="w-full relative select-none"
    :style="{ height: `${height}px` }"
    role="img"
    :aria-label="`${label} ${formatValue(value)}`"
  ></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  label: { type: String, default: '' },
  color: { type: String, default: '#52796f' },
  min: { type: Number, default: -10 },
  max: { type: Number, default: 10 },
  mode: { type: String, default: 'delta' },
  height: { type: Number, default: 180 },
  compact: { type: Boolean, default: false }
})

const chartElement = ref(null)
let chartInstance = null
let resizeObserver = null

function formatValue(val) {
  if (props.mode === 'percent') return `${Number(val).toFixed(1)}%`
  return `${val > 0 ? '+' : val === 0 ? '±' : ''}${Number(val).toFixed(1)} pp`
}

function renderChart() {
  if (!chartElement.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartElement.value)
  }

  const isDelta = props.mode === 'delta'
  const split = isDelta ? (0 - props.min) / (props.max - props.min) : 0.5
  const axisColors = isDelta
    ? [[Math.max(0.01, split), '#f1f5f9'], [1, '#e2e8f0']]
    : [[0.5, '#f1f5f9'], [1, '#e2e8f0']]

  chartInstance.setOption({
    animationDuration: 700,
    animationDurationUpdate: 500,
    series: [
      {
        type: 'gauge',
        min: props.min,
        max: props.max,
        splitNumber: isDelta ? 4 : 5,
        center: ['50%', '55%'],
        radius: props.compact ? '82%' : '90%',
        axisLine: {
          lineStyle: {
            width: props.compact ? 8 : 10,
            color: axisColors
          }
        },
        axisTick: {
          show: true,
          splitNumber: 2,
          length: 4,
          lineStyle: { width: 1, color: '#94a3b8' }
        },
        splitLine: {
          show: true,
          length: 7,
          lineStyle: { width: 1.5, color: '#64748b' }
        },
        axisLabel: {
          distance: props.compact ? 6 : 9,
          color: '#64748b',
          fontSize: props.compact ? 8 : 9,
          formatter: (val) => {
            if (isDelta) {
              if (val === 0) return '0'
              if (val === props.min || val === props.max) return `${val > 0 ? '+' : ''}${val}`
              return ''
            }
            return val === 0 || val === 50 || val === 100 ? `${val}` : ''
          }
        },
        pointer: {
          length: props.compact ? '60%' : '66%',
          width: props.compact ? 3 : 4,
          itemStyle: { color: props.color }
        },
        anchor: {
          show: true,
          showAbove: true,
          size: props.compact ? 6 : 8,
          itemStyle: {
            borderWidth: 2,
            borderColor: props.color,
            color: '#ffffff'
          }
        },
        detail: {
          valueAnimation: true,
          formatter: (val) => formatValue(val),
          offsetCenter: [0, props.compact ? '68%' : '66%'],
          fontSize: props.compact ? 14 : 18,
          fontWeight: '900',
          fontFamily: 'monospace',
          color: props.color
        },
        title: {
          offsetCenter: [0, props.compact ? '90%' : '90%'],
          fontSize: props.compact ? 9 : 11,
          fontWeight: '700',
          color: '#475569'
        },
        data: [{ value: props.value, name: props.label }]
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

watch(() => [props.value, props.label, props.color, props.min, props.max, props.mode, props.compact], () => {
  renderChart()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chartInstance?.dispose()
  chartInstance = null
})
</script>
