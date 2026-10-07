import { ref, computed, isRef } from 'vue'

/**
 * usePagination
 * 通用分頁邏輯 Composable
 * 
 * @param {import('vue').Ref<any[]> | any[]} itemsSource - 原始陣列或 Ref<Array>
 * @param {Object} options
 * @param {number} [options.initialPage=1] - 初始頁碼
 * @param {number} [options.initialPageSize=10] - 初始每頁筆數
 * @returns {Object} 分頁狀態與操作方法
 */
export function usePagination(itemsSource, options = {}) {
  const { initialPage = 1, initialPageSize = 10 } = options

  const currentPage = ref(initialPage)
  const pageSize = ref(initialPageSize)

  const items = computed(() => {
    return isRef(itemsSource) ? itemsSource.value : itemsSource
  })

  const total = computed(() => {
    return Array.isArray(items.value) ? items.value.length : 0
  })

  const totalPages = computed(() => {
    if (total.value === 0) return 1
    return Math.ceil(total.value / pageSize.value)
  })

  const paginatedItems = computed(() => {
    if (!Array.isArray(items.value)) return []
    const start = (currentPage.value - 1) * pageSize.value
    return items.value.slice(start, start + pageSize.value)
  })

  function setPage(page) {
    const validPage = Math.max(1, Math.min(page, totalPages.value || 1))
    currentPage.value = validPage
  }

  function setPageSize(size) {
    pageSize.value = Number(size) || initialPageSize
    setPage(1)
  }

  function resetPage() {
    currentPage.value = 1
  }

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  // 取得給表格序號用的流水號 (1-based)
  function getRowIndex(indexOnCurrentPage) {
    return (currentPage.value - 1) * pageSize.value + indexOnCurrentPage + 1
  }

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    paginatedItems,
    setPage,
    setPageSize,
    resetPage,
    nextPage,
    prevPage,
    getRowIndex
  }
}
