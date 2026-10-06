<template>
  <div class="flex items-center space-x-1.5 overflow-x-visible pb-1 whitespace-nowrap" ref="rootRef">
    <!-- Recent Years Pills -->
    <button
      v-for="(year, index) in recentYears"
      :key="year"
      type="button"
      @click="selectYear(year)"
      class="px-3 py-1.5 border rounded-lg transition transform active:scale-95 duration-150 font-medium text-xs md:text-sm cursor-pointer whitespace-nowrap flex items-center gap-1 shadow-2xs"
      :class="modelValue === year
        ? 'bg-[#52796f] text-white border-[#52796f] shadow-xs'
        : 'border-slate-300 text-slate-600 bg-white hover:border-[#52796f] hover:text-[#52796f]'"
      :title="`切換至 ${year} 年度`"
    >
      <span>{{ year }}年</span>
      <span
        v-if="index === 0"
        class="text-[10px] px-1 py-0.2 rounded font-normal transition-colors"
        :class="modelValue === year ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'"
      >
        最新
      </span>
    </button>

    <!-- Historical Years Dropdown -->
    <div v-if="historicalYears.length > 0" class="relative">
      <button
        type="button"
        @click.stop="toggleDropdown"
        class="px-3 py-1.5 border rounded-lg transition transform active:scale-95 duration-150 font-medium text-xs md:text-sm cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-2xs select-none"
        :class="isHistoricalActive
          ? 'bg-[#52796f] text-white border-[#52796f] shadow-xs'
          : 'border-slate-300 text-slate-600 bg-white hover:border-[#52796f] hover:text-[#52796f]'"
        :title="isHistoricalActive ? `當前檢視歷史年度：${modelValue}年` : '點擊展開更多歷史年度'"
      >
        <span>{{ dropdownLabel }}</span>
        <svg
          class="w-3.5 h-3.5 transition-transform duration-200"
          :class="isDropdownOpen ? 'rotate-180' : ''"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown Popup -->
      <transition name="dropdown-pop">
        <div
          v-if="isDropdownOpen"
          class="absolute left-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 overflow-hidden text-left"
        >
          <div class="px-3.5 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-100 flex items-center justify-between">
            <span>歷史年度</span>
            <span class="text-[10px] font-mono text-slate-400">{{ historicalYears.length }} 個年度</span>
          </div>
          <div class="max-h-56 overflow-y-auto py-1">
            <button
              v-for="year in historicalYears"
              :key="year"
              type="button"
              @click="selectYear(year)"
              class="w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#52796f]/10 transition-colors cursor-pointer"
              :class="modelValue === year
                ? 'text-[#52796f] font-bold bg-[#52796f]/10'
                : 'text-slate-700'"
            >
              <span>{{ year }} 年度</span>
              <span v-if="modelValue === year" class="text-xs text-[#52796f] font-bold">✓</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  years: {
    type: Array,
    default: () => ['115', '114', '113', '112', '111', '110', '109', '108']
  },
  recentCount: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const rootRef = ref(null)
const isDropdownOpen = ref(false)

// Sort descending from newest to oldest (115 -> 108)
const sortedYears = computed(() => {
  return [...props.years].sort((a, b) => Number(b) - Number(a))
})

const recentYears = computed(() => {
  return sortedYears.value.slice(0, props.recentCount)
})

const historicalYears = computed(() => {
  return sortedYears.value.slice(props.recentCount)
})

const isHistoricalActive = computed(() => {
  return historicalYears.value.includes(props.modelValue)
})

const dropdownLabel = computed(() => {
  if (isHistoricalActive.value) {
    return `${props.modelValue}年 (歷史)`
  }
  return '歷史年度'
})

function selectYear(year) {
  isDropdownOpen.value = false
  if (props.modelValue !== year) {
    emit('update:modelValue', year)
    emit('change', year)
  }
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function handleDocumentClick(e) {
  if (rootRef.value && !rootRef.value.contains(e.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.dropdown-pop-enter-active,
.dropdown-pop-leave-active {
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top left;
}
.dropdown-pop-enter-from,
.dropdown-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.96);
}
</style>
