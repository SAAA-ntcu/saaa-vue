<template>
  <!-- Case 1: External Link (Announcement) -->
  <a
    v-if="item.link && item.isExternal"
    :href="item.link"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:border-[#52796f]/40 hover:bg-[#52796f]/5 transition-all transform active:scale-[0.99] duration-150 shadow-xs w-full text-left no-underline"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <span
        class="px-3 py-1 text-xs font-bold border border-[#52796f] text-[#52796f] bg-white rounded-full group-hover:bg-[#52796f] group-hover:text-white transition whitespace-nowrap shrink-0"
      >
        {{ item.type }}
      </span>
      <p class="text-sm md:text-base font-semibold text-slate-700 group-hover:text-[#52796f] transition break-words flex-1 min-w-0 m-0">
        {{ item.title }}
      </p>
    </div>
    <span class="text-xs md:text-sm text-slate-400 font-mono text-left md:text-right md:min-w-[100px] shrink-0">
      {{ item.date }}
    </span>
  </a>

  <!-- Case 2: Internal Download Link (File) -->
  <a
    v-else-if="item.downloadUrl"
    :href="item.downloadUrl"
    target="_blank"
    class="group flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:border-[#c47c5d]/40 hover:bg-[#c47c5d]/5 transition-all transform active:scale-[0.99] duration-150 shadow-xs w-full text-left no-underline"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <span
        class="px-3 py-1 text-xs font-bold border border-[#c47c5d] text-[#c47c5d] bg-white rounded-full group-hover:bg-[#c47c5d] group-hover:text-white transition whitespace-nowrap shrink-0"
      >
        {{ item.type }}
      </span>
      <p class="text-sm md:text-base font-semibold text-slate-700 group-hover:text-[#c47c5d] transition break-words flex-1 min-w-0 m-0">
        {{ item.title }}
      </p>
    </div>
    <span class="text-xs md:text-sm text-slate-400 font-mono text-left md:text-right md:min-w-[100px] shrink-0">
      {{ item.date }}
    </span>
  </a>

  <!-- Case 3: Modal Dialog Trigger (File with Dialog) -->
  <button
    v-else-if="item.hasModal"
    type="button"
    @click="$emit('open-modal', item.modalData)"
    class="group flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-white border border-slate-100 hover:border-[#c47c5d]/40 hover:bg-[#c47c5d]/5 rounded-xl transition-all transform active:scale-[0.99] duration-150 shadow-xs w-full text-left cursor-pointer"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <span
        class="px-3 py-1 text-xs font-bold border border-[#c47c5d] text-[#c47c5d] bg-white group-hover:bg-[#c47c5d] group-hover:text-white rounded-full whitespace-nowrap shrink-0 transition"
      >
        {{ item.type }}
      </span>
      <p class="text-sm md:text-base font-semibold text-slate-700 group-hover:text-[#c47c5d] break-words flex-1 min-w-0 m-0 transition">
        {{ item.title }}
      </p>
    </div>
    <span class="text-xs md:text-sm text-slate-400 font-mono text-left md:text-right md:min-w-[100px] shrink-0">
      {{ item.date }}
    </span>
  </button>

  <!-- Case 4: General Announcement Card -->
  <div
    v-else
    class="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-xs w-full text-left"
  >
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <span
        class="px-3 py-1 text-xs font-bold border border-[#52796f] text-[#52796f] bg-white rounded-full whitespace-nowrap shrink-0"
      >
        {{ item.type }}
      </span>
      <p class="text-sm md:text-base font-semibold text-slate-700 break-words flex-1 min-w-0 m-0">
        {{ item.title }}
      </p>
    </div>
    <span class="text-xs md:text-sm text-slate-400 font-mono text-left md:text-right md:min-w-[100px] shrink-0">
      {{ item.date }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['open-modal'])
</script>
