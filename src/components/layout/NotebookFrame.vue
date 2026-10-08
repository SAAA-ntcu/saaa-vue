<template>
  <main class="flex-1 flex flex-col">
    <div class="w-full flex flex-col justify-center py-6 md:py-12 relative overflow-hidden select-none">
      <div class="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto">
        <!-- Main Notebook Binder Shell (Morandi Sage/Slate Gradient) -->
        <div class="relative rounded-[2.5rem] p-4 md:p-6 shadow-2xl shadow-slate-900/15 border-y-4 border-x-[12px] border-white/30 overflow-visible bg-gradient-to-br from-[#729289] to-[#5f7e76]">
          
          <!-- Binder Spine Loops (Left Side Rings: Graphite Slate & Terracotta) -->
          <div class="hidden md:flex absolute left-0 top-10 bottom-12 w-40 flex-col justify-start items-start gap-4 z-30 pointer-events-none transform -translate-x-[34px] overflow-hidden h-[calc(100%-5.5rem)] pb-2">
            <div
              v-for="index in 30"
              :key="index"
              class="notebook-spine relative w-32 h-7 shrink-0 flex items-center"
            >
              <div class="absolute right-1 w-10 h-7 rounded-full z-10 shadow-inner bg-[#3f4e55]"></div>
              <div class="absolute left-0 w-[115px] h-3 rounded-full z-20 shadow-[0_2px_4px_rgba(0,0,0,0.35)] bg-[#c47c5d]"></div>
            </div>
          </div>

          <!-- Top Ribbon Bookmarks (Oat Mustard & Vintage Slate) -->
          <div
            class="absolute right-20 -top-4 w-12 h-14 bg-[#d4a373] z-10 hover:-translate-y-1.5 transition-transform duration-200 shadow-sm cursor-pointer"
            style="clip-path: polygon(50% 25%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)"
            title="書籤"
          ></div>
          <div
            class="absolute right-[66px] -top-4 w-12 h-14 bg-[#2f3e46] z-10 hover:-translate-y-1.5 transition-transform duration-200 shadow-sm cursor-pointer"
            style="clip-path: polygon(50% 25%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)"
            title="書籤"
          ></div>

          <!-- Right Index Tabs (Dusty Rose, Warm Apricot, Muted Sage) -->
          <div class="absolute -right-6 top-40 flex flex-col space-y-7 z-0">
            <div
              class="w-[72px] h-14 bg-[#c87d8a] transition-all duration-200 hover:translate-x-2.5 shadow-xs cursor-pointer"
              style="clip-path: polygon(0% 0%, 75% 0%, 50% 50%, 75% 100%, 0% 100%)"
            ></div>
            <div
              class="w-[56px] h-14 bg-[#e9c46a] transition-all duration-200 hover:translate-x-2.5 shadow-xs cursor-pointer"
            ></div>
            <div
              class="w-[72px] h-14 bg-[#7ea172] rounded-r-full transition-all duration-200 hover:translate-x-2.5 shadow-xs cursor-pointer"
            ></div>
          </div>

          <!-- Inner Notebook White Page (Content Area) -->
          <div class="bg-[#fcfdfd] rounded-[2rem] px-4 pt-8 pb-20 sm:px-8 md:pl-20 md:pr-10 shadow-inner min-h-[650px] flex flex-col justify-start relative z-10 border border-slate-100">
            <slot />
          </div>

          <!-- Bottom Left Boy Illustration -->
          <div v-if="!isLoginPage" class="hidden md:block absolute -bottom-14 z-30 pointer-events-none transform hover:scale-105 transition duration-300 w-36 lg:w-40 2xl:w-48 -left-7 lg:-left-10 2xl:-left-12">
            <img src="/images/read_boy.png" alt="認真讀書中" class="reader-boy w-full h-auto drop-shadow-md" loading="lazy" decoding="async" fetchpriority="low" />
          </div>

          <!-- Bottom Right Girl Illustration -->
          <div v-if="!isLoginPage" class="hidden md:block absolute -bottom-14 z-30 pointer-events-none transform hover:scale-105 transition duration-300 w-36 lg:w-40 2xl:w-48 -right-16 lg:-right-20 2xl:-right-12">
            <img src="/images/read_girl.png" alt="好好學習" class="reader-girl w-full h-auto drop-shadow-md" loading="lazy" decoding="async" fetchpriority="low" />
          </div>

        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/logins')
</script>
