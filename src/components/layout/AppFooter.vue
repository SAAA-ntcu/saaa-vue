<template>
  <footer class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-4 border-[#52796f] shadow-[0_-4px_20px_rgba(47,62,70,0.06)] py-2.5 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-1.5 text-center">
      <!-- Contact Details & Service Info (Centered) -->
      <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-600 text-[11px] sm:text-xs">
        <!-- Phone -->
        <span class="inline-flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-[#52796f] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <span class="text-slate-500">電話：</span>
          <span class="font-mono text-slate-700 font-medium">(04) 2218-8100 · (04) 2218-8177</span>
        </span>

        <span class="text-slate-300 hidden sm:inline">|</span>

        <!-- Email -->
        <span class="inline-flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-[#52796f] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span class="text-slate-500">信箱：</span>
          <a
            href="mailto:saaa.ntcu@mail.ntcu.edu.tw"
            class="text-[#52796f] hover:text-[#354f52] hover:underline font-mono font-medium no-underline"
          >
            saaa.ntcu@mail.ntcu.edu.tw
          </a>
        </span>

        <span class="text-slate-300 hidden md:inline">|</span>

        <!-- Service Hours -->
        <span class="inline-flex items-center gap-1.5 text-slate-500 hidden md:inline-flex">
          <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>服務時間：週一至週五 08:30-12:00 / 13:30-17:30</span>
        </span>

        <span class="text-slate-300 hidden lg:inline">|</span>

        <!-- Address -->
        <span class="inline-flex items-center gap-1.5 text-slate-500 hidden lg:inline-flex">
          <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>403臺中市西區民生路140號 教育樓 5F</span>
        </span>
      </div>

      <!-- Copyright (Centered) -->
      <div class="text-slate-500 text-[11px] font-medium tracking-wide">
        &copy; 國立臺中教育大學 ｜ 測驗統計與適性學習研究中心
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>
