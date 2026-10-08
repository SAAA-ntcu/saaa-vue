<template>
  <el-drawer
    :model-value="Boolean(action)"
    @update:model-value="val => { if (!val) $emit('close') }"
    size="min(92vw, 560px)"
    direction="rtl"
    :with-header="false"
    append-to-body
    class="action-plan-drawer"
  >
    <div v-if="action" class="h-full flex flex-col bg-white text-slate-800">
      <!-- Drawer Header -->
      <div class="shrink-0 px-6 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between z-10 shadow-2xs">
        <div>
          <span class="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 mb-1">
            {{ action.badge }}
          </span>
          <h3 class="text-base sm:text-lg font-black text-slate-900 m-0 leading-snug">
            {{ action.title }}
          </h3>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          aria-label="關閉"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Drawer Body -->
      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs select-text">
        <!-- 延伸檢視連結 -->
        <div v-if="action.classIds?.length" class="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            延伸直達班級
          </span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="cId in action.classIds"
              :key="cId"
              type="button"
              @click="$emit('select-class', cId)"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-[#52796f] hover:text-[#52796f] text-slate-700 font-bold rounded-lg transition shadow-2xs cursor-pointer"
            >
              <span>進入 {{ cId }} 班級名冊</span>
              <span>➔</span>
            </button>
          </div>
        </div>

        <!-- 數據盲點與情境 -->
        <section class="border border-slate-200/80 rounded-xl p-4 bg-white space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 m-0 flex items-center gap-1.5">
            <span class="w-1.5 h-3 bg-rose-500 rounded-full"></span>
            數據盲點與現象
          </h4>
          <p class="text-slate-700 text-sm leading-relaxed m-0">
            {{ action.problem }}
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-[11px]">
            <div>
              <span class="text-slate-400 block mb-0.5">協同場域與對象</span>
              <strong class="text-slate-800">{{ action.who }}</strong>
            </div>
            <div>
              <span class="text-slate-400 block mb-0.5">建議檢核節點</span>
              <strong class="text-slate-800">{{ action.when }}</strong>
            </div>
          </div>
        </section>

        <!-- 具體支持路徑 -->
        <section class="border border-slate-200/80 rounded-xl p-4 bg-white space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 m-0 flex items-center gap-1.5">
            <span class="w-1.5 h-3 bg-[#52796f] rounded-full"></span>
            教學支持路徑與行動建議
          </h4>
          <div class="space-y-3">
            <div
              v-for="(item, idx) in action.actions"
              :key="item.title"
              class="p-3 bg-slate-50/70 border border-slate-100 rounded-lg space-y-1"
            >
              <div class="font-bold text-slate-800 text-xs flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-[#52796f]/15 text-[#52796f] text-[10px] font-black flex items-center justify-center">
                  {{ idx + 1 }}
                </span>
                {{ item.title }}
              </div>
              <p class="text-slate-600 text-[11px] leading-relaxed m-0 pl-7">
                {{ item.description }}
              </p>
            </div>
          </div>
        </section>

        <!-- 成效檢核 KPI -->
        <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
          <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
            <span>🎯</span>
            <span>成效檢核指標 (KPI)</span>
          </div>
          <p class="text-emerald-800 text-xs leading-relaxed m-0">
            {{ action.kpi }}
          </p>
        </div>
      </div>

      <!-- Drawer Footer -->
      <div class="shrink-0 px-6 py-3 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          完成閱讀
        </button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
defineProps({
  action: { type: Object, default: null }
})
defineEmits(['close', 'select-class'])
</script>

<style scoped>
:deep(.action-plan-drawer) {
  border-top-left-radius: 1.25rem !important;
  border-bottom-left-radius: 1.25rem !important;
  overflow: hidden !important;
  box-shadow: -8px 0 32px rgba(15, 23, 42, 0.15) !important;
}

:deep(.action-plan-drawer .el-drawer__body) {
  padding: 0 !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}
</style>
