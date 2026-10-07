import { ref, computed, isRef } from 'vue'

/**
 * useTableSelection
 * 通用表格勾選與批次操作 Composable
 * 
 * @param {import('vue').Ref<any[]> | any[]} itemsSource - 原始陣列或 Ref<Array>
 * @param {Object} options
 * @param {string} [options.keyField='id'] - 唯一識別鍵值欄位 (例如 'id' 或 'key')
 * @returns {Object} 選取狀態與控制方法
 */
export function useTableSelection(itemsSource, options = {}) {
  const { keyField = 'id' } = options

  // 儲存已勾選 key 的 Set
  const selectedKeySet = ref(new Set())

  const items = computed(() => {
    return isRef(itemsSource) ? itemsSource.value : itemsSource
  })

  // 取得 item 的 key
  function getKey(item) {
    if (item && typeof item === 'object') {
      return item[keyField] !== undefined ? item[keyField] : item
    }
    return item
  }

  // 判斷特定項目是否被選取
  function isSelected(itemOrKey) {
    const key = typeof itemOrKey === 'object' && itemOrKey !== null ? getKey(itemOrKey) : itemOrKey
    return selectedKeySet.value.has(key)
  }

  // 切換單一項目的選取狀態
  function toggleSelect(itemOrKey) {
    const key = typeof itemOrKey === 'object' && itemOrKey !== null ? getKey(itemOrKey) : itemOrKey
    const nextSet = new Set(selectedKeySet.value)
    if (nextSet.has(key)) {
      nextSet.delete(key)
    } else {
      nextSet.add(key)
    }
    selectedKeySet.value = nextSet
  }

  // 單選
  function select(itemOrKey) {
    const key = typeof itemOrKey === 'object' && itemOrKey !== null ? getKey(itemOrKey) : itemOrKey
    if (!selectedKeySet.value.has(key)) {
      const nextSet = new Set(selectedKeySet.value)
      nextSet.add(key)
      selectedKeySet.value = nextSet
    }
  }

  // 取消單選
  function deselect(itemOrKey) {
    const key = typeof itemOrKey === 'object' && itemOrKey !== null ? getKey(itemOrKey) : itemOrKey
    if (selectedKeySet.value.has(key)) {
      const nextSet = new Set(selectedKeySet.value)
      nextSet.delete(key)
      selectedKeySet.value = nextSet
    }
  }

  // 全選目前可見/符合條件的所有 items
  function selectAll() {
    if (!Array.isArray(items.value)) return
    const nextSet = new Set(selectedKeySet.value)
    items.value.forEach(item => {
      nextSet.add(getKey(item))
    })
    selectedKeySet.value = nextSet
  }

  // 清除所有選取
  function clearSelection() {
    selectedKeySet.value = new Set()
  }

  // 已選取數量
  const selectedCount = computed(() => {
    return selectedKeySet.value.size
  })

  // 已選取的物件清單
  const selectedItems = computed(() => {
    if (!Array.isArray(items.value)) return []
    return items.value.filter(item => selectedKeySet.value.has(getKey(item)))
  })

  // 是否全選 (針對當前 items)
  const isAllSelected = computed({
    get() {
      if (!Array.isArray(items.value) || items.value.length === 0) return false
      return items.value.every(item => selectedKeySet.value.has(getKey(item)))
    },
    set(val) {
      if (val) {
        selectAll()
      } else {
        if (!Array.isArray(items.value)) return
        // 取消當前 items 的勾選 (若其他非當前頁的保留，或直接清空)
        const nextSet = new Set(selectedKeySet.value)
        items.value.forEach(item => nextSet.delete(getKey(item)))
        selectedKeySet.value = nextSet
      }
    }
  })

  // 半選狀態 (用於全選 Checkbox indeterminate)
  const isIndeterminate = computed(() => {
    if (!Array.isArray(items.value) || items.value.length === 0) return false
    const someSelected = items.value.some(item => selectedKeySet.value.has(getKey(item)))
    return someSelected && !isAllSelected.value
  })

  return {
    selectedKeySet,
    selectedItems,
    selectedCount,
    isAllSelected,
    isIndeterminate,
    isSelected,
    toggleSelect,
    select,
    deselect,
    selectAll,
    clearSelection
  }
}
