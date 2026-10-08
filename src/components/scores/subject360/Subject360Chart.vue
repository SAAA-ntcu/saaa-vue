<script setup>
import * as echarts from 'echarts';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  option: { type: Object, required: true },
  height: { type: Number, default: 300 },
  ariaLabel: { type: String, default: '科目資料圖表' }
});

const emit = defineEmits(['chart-click']);
const chartElement = ref(null);
let chartInstance = null;
let resizeObserver = null;

function renderChart() {
  if (!chartElement.value) return;
  if (!chartInstance) {
    chartInstance = echarts.init(chartElement.value);
    chartInstance.on('click', (params) => emit('chart-click', params));
  }
  chartInstance.setOption(props.option, true);
}

onMounted(async () => {
  await nextTick();
  renderChart();
  resizeObserver = new ResizeObserver(() => chartInstance?.resize());
  if (chartElement.value) {
    resizeObserver.observe(chartElement.value);
  }
});

watch(() => props.option, renderChart, { deep: true });

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chartInstance?.dispose();
  chartInstance = null;
});
</script>

<template>
  <div
    ref="chartElement"
    class="w-full relative"
    :style="{ height: `${height}px` }"
    role="img"
    :aria-label="ariaLabel"
  />
</template>
