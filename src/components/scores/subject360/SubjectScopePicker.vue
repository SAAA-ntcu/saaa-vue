<script setup>
import { ref } from 'vue';

const props = defineProps({
  classIds: { type: Array, required: true },
  selectedClasses: { type: Array, required: true },
  scopeLabel: { type: String, required: true },
  selectAllLabel: { type: String, default: '全校' }
});

const emit = defineEmits(['toggle-class', 'select-all']);
const open = ref(false);
</script>

<template>
  <div class="relative z-10 mb-3">
    <button
      class="flex items-center justify-between w-full max-w-sm px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-xs text-left hover:border-slate-300 transition-colors"
      type="button"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="flex flex-col">
        <small class="text-[11px] font-bold text-slate-400">分析範圍篩選</small>
        <strong class="text-sm font-bold text-slate-800">{{ scopeLabel }}</strong>
      </span>
      <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
        {{ open ? '收合 ▲' : '選擇 ▼' }}
      </span>
    </button>

    <div
      v-if="open"
      class="absolute top-full left-0 mt-2 grid grid-cols-3 gap-2 w-full max-w-md p-3.5 bg-white border border-slate-200 rounded-xl shadow-lg z-20"
    >
      <div class="col-span-full flex items-center justify-between pb-2 border-b border-slate-100">
        <strong class="text-xs font-bold text-slate-700">選擇分析班級</strong>
        <button
          type="button"
          class="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
          @click="emit('select-all')"
        >
          {{ selectAllLabel }} {{ classIds.length }} 班
        </button>
      </div>

      <label
        v-for="classId in classIds"
        :key="classId"
        class="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs font-bold text-slate-700"
      >
        <input
          type="checkbox"
          :checked="selectedClasses.includes(classId)"
          class="rounded text-emerald-600 focus:ring-emerald-500"
          @change="emit('toggle-class', classId)"
        />
        <span>{{ classId }} 班</span>
      </label>

      <div class="col-span-full pt-1 text-[11px] text-slate-400">
        目前選取 {{ selectedClasses.length }} / {{ classIds.length }} 班
      </div>
    </div>
  </div>
</template>
