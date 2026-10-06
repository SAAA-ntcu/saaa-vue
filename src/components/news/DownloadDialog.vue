<template>
  <el-dialog
    v-model="visible"
    :title="data?.title || '試題資訊下載'"
    width="800px"
    class="saaa-dialog"
    destroy-on-close
    center
    align-center
  >
    <div class="p-2 sm:p-4">
      <div class="grid grid-cols-2 bg-[#52796f] text-white text-center font-bold text-base md:text-lg py-3 rounded-t-xl tracking-wider shadow-xs">
        <div class="border-r border-white/20 py-1">國小</div>
        <div class="py-1">國中</div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 border-x border-b border-slate-200 rounded-b-xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50/50">
        <!-- Elementary Files -->
        <div class="p-4 sm:p-6 flex flex-col gap-3 items-center justify-center text-center">
          <template v-if="data?.primaryFiles && data.primaryFiles.length > 0">
            <a
              v-for="(file, idx) in data.primaryFiles"
              :key="idx"
              :href="file.url"
              target="_blank"
              class="flex items-start gap-2 text-sm sm:text-base font-semibold text-slate-700 hover:text-[#52796f] hover:underline tracking-tight break-all p-2 rounded-lg transition hover:bg-[#52796f]/10 w-full no-underline"
            >
              <span class="text-base shrink-0">👋</span>
              <span class="text-left flex-1 leading-relaxed">{{ file.name }}</span>
            </a>
          </template>
          <span v-else class="text-xs text-slate-400">暫無檔案</span>
        </div>

        <!-- Junior High Files -->
        <div class="p-4 sm:p-6 flex flex-col gap-3 items-center justify-center text-center">
          <template v-if="data?.juniorFiles && data.juniorFiles.length > 0">
            <a
              v-for="(file, idx) in data.juniorFiles"
              :key="idx"
              :href="file.url"
              target="_blank"
              class="flex items-start gap-2 text-sm sm:text-base font-semibold text-slate-700 hover:text-[#52796f] hover:underline tracking-tight break-all p-2 rounded-lg transition hover:bg-[#52796f]/10 w-full no-underline"
            >
              <span class="text-base shrink-0">👋</span>
              <span class="text-left flex-1 leading-relaxed">{{ file.name }}</span>
            </a>
          </template>
          <span v-else class="text-xs text-slate-400">暫無檔案</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="text-center pb-2">
        <button
          type="button"
          @click="visible = false"
          class="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition cursor-pointer"
        >
          關閉
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>
