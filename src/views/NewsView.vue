<template>
  <div id="data-list" class="w-full max-w-5xl mx-auto p-2 md:p-6 bg-white/80 backdrop-blur-xs rounded-2xl">
    <!-- Header title -->
    <div class="mb-6 md:mb-8 pb-3 border-b border-slate-100 flex items-center gap-2.5">
      <span class="text-2xl md:text-3xl animate-bounce" style="animation-duration: 3s;">☁️</span>
      <div>
        <h2 class="text-xl md:text-2xl font-black text-slate-800 tracking-wider m-0">
          最新消息
          <span class="text-xs md:text-sm font-medium text-slate-400 ml-1 font-mono">Announcements</span>
        </h2>
        <div class="h-1 w-8 bg-[#52796f] rounded-full mt-1"></div>
      </div>
    </div>

    <!-- Search Form -->
    <div class="mb-6 max-w-md">
      <form @submit.prevent="handleSearch" class="flex items-center gap-2">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            v-model="keyword"
            type="text"
            placeholder="請輸入關鍵字"
            class="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#52796f] focus:bg-white focus:ring-2 focus:ring-[#52796f]/20 transition duration-150"
          />
          <button
            v-if="keyword"
            type="button"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <button
          type="submit"
          class="px-4 py-2 text-sm font-bold text-white bg-[#52796f] hover:bg-[#354f52] rounded-xl shadow-xs transition duration-150 active:scale-95 shrink-0 cursor-pointer"
        >
          搜尋
        </button>
      </form>
    </div>

    <!-- News List -->
    <div class="flex flex-col gap-3 min-h-[380px]" role="rowgroup">
      <template v-if="paginatedNews.length > 0">
        <NewsCard
          v-for="item in paginatedNews"
          :key="item.id"
          :item="item"
          @open-modal="openDownloadModal"
        />
      </template>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-16 text-slate-400 gap-2"
      >
        <span class="text-4xl">📭</span>
        <p class="text-sm">查無符合「{{ keyword }}」的最新消息</p>
        <button
          type="button"
          @click="clearSearch"
          class="text-xs text-[#52796f] underline hover:text-[#354f52] mt-1 cursor-pointer"
        >
          清除搜尋條件
        </button>
      </div>
    </div>

    <!-- Pagination with Element Plus -->
    <div class="flex items-center justify-center gap-1.5 mt-8 pt-6 border-t border-slate-100">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredNews.length"
        layout="prev, pager, next"
        background
        :hide-on-single-page="false"
      />
    </div>

    <!-- Element Plus Download Dialog -->
    <DownloadDialog
      v-model="modalVisible"
      :data="currentModalData"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { newsList } from '../data/newsData'
import NewsCard from '../components/news/NewsCard.vue'
import DownloadDialog from '../components/news/DownloadDialog.vue'

const keyword = ref('')
const activeKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(7)

const modalVisible = ref(false)
const currentModalData = ref(null)

function handleSearch() {
  activeKeyword.value = keyword.value.trim()
  currentPage.value = 1
}

function clearSearch() {
  keyword.value = ''
  activeKeyword.value = ''
  currentPage.value = 1
}

function openDownloadModal(data) {
  currentModalData.value = data
  modalVisible.value = true
}

// Filtered list based on search keyword
const filteredNews = computed(() => {
  if (!activeKeyword.value) return newsList
  const kw = activeKeyword.value.toLowerCase()
  return newsList.filter(
    (item) =>
      item.title.toLowerCase().includes(kw) ||
      item.type.toLowerCase().includes(kw) ||
      item.date.includes(kw)
  )
})

// Current page sliced items
const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredNews.value.slice(start, start + pageSize.value)
})
</script>
