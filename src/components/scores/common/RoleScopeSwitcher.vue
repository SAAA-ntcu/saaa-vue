<script setup>
import { useAccessProfile } from '../../../composables/useAccessProfile';

const { ACCESS_PROFILES, activeProfileId, currentProfile, setProfile } = useAccessProfile();
</script>

<template>
  <div class="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-2xs">
    <div class="flex items-center gap-1.5 text-slate-500">
      <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span class="text-xs font-bold text-slate-600 hidden sm:inline">視角切換：</span>
    </div>

    <select
      :value="activeProfileId"
      class="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 outline-none transition-colors cursor-pointer"
      @change="setProfile($event.target.value)"
    >
      <option v-for="p in ACCESS_PROFILES" :key="p.id" :value="p.id">
        {{ p.label }}
      </option>
    </select>

    <span class="hidden md:inline-block text-[11px] font-medium text-slate-400 border-l border-slate-200 pl-2">
      {{ currentProfile.scopeLabel }}
    </span>
  </div>
</template>
