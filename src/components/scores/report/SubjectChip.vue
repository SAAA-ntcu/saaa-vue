<template>
  <span
    class="inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-black text-white shrink-0"
    :style="{ background: subject.chipColor }"
    :title="subject.name"
  >{{ subject.short }}</span>
</template>

<script setup>
defineProps({
  subject: { type: Object, required: true }
})
</script>
