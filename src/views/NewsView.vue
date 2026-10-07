<template>
  <div id="data-list" class="w-full max-w-5xl mx-auto p-2 md:p-6 bg-white/80 backdrop-blur-xs rounded-2xl">
    <!-- Header title -->
    <div class="mb-6 md:mb-8 pb-3 border-b border-slate-100 flex items-center gap-3">
      <!-- Replaced ☁️ with modern notification badge SVG -->
      <div class="w-10 h-10 rounded-xl bg-[#52796f]/10 text-[#52796f] flex items-center justify-center shrink-0 shadow-xs">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
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
          <!-- Replaced 🔍 with clean SVG search icon -->
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>

          <input
            v-model="keyword"
            type="text"
            placeholder="請輸入關鍵字"
            class="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#52796f] focus:bg-white focus:ring-2 focus:ring-[#52796f]/20 transition duration-150"
          />

          <!-- Clear Button with SVG -->
          <button
            v-if="keyword"
            type="button"
            @click="clearSearch"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/50 cursor-pointer transition"
            aria-label="清除關鍵字"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
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

      <!-- Empty State with modern SVG -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-16 text-slate-400 gap-2"
      >
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p class="text-sm font-medium text-slate-500 m-0">查無符合「{{ keyword }}」的最新消息</p>
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
import { ref, computed, onMounted } from 'vue'
import { newsService } from '../services/newsService'
import { usePagination } from '../composables/usePagination'
import NewsCard from '../components/news/NewsCard.vue'
import DownloadDialog from '../components/news/DownloadDialog.vue'

const newsItems = ref([])
const keyword = ref('')
const activeKeyword = ref('')

const modalVisible = ref(false)
const currentModalData = ref(null)

// 載入資料
async function loadNews() {
  const res = await newsService.getNewsList()
  if (res.success) {
    newsItems.value = res.data
  }
}

onMounted(() => {
  loadNews()
})

// Filtered list based on search keyword
const filteredNews = computed(() => {
  if (!activeKeyword.value) return newsItems.value
  const kw = activeKeyword.value.toLowerCase()
  return newsItems.value.filter(
    (item) =>
      item.title.toLowerCase().includes(kw) ||
      item.type.toLowerCase().includes(kw) ||
      item.date.includes(kw)
  )
})

// 使用共用 usePagination Composable
const {
  currentPage,
  pageSize,
  paginatedItems: paginatedNews,
  resetPage
} = usePagination(filteredNews, { initialPageSize: 7 })

function handleSearch() {
  activeKeyword.value = keyword.value.trim()
  resetPage()
}

function clearSearch() {
  keyword.value = ''
  activeKeyword.value = ''
  resetPage()
}

function openDownloadModal(data) {
  currentModalData.value = data
  modalVisible.value = true
}
</script>
