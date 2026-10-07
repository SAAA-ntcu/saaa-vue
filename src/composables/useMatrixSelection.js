import { reactive, computed } from 'vue'

/**
 * useMatrixSelection
 * 矩陣式/二維表格勾選 Composable
 * 
 * 適用於：評量架構下載矩陣、試題公告下載矩陣、成績專區報表下載矩陣
 * 支援單格、整列 (Row)、整欄 (Column)、全選 (All) 的獨立與批次勾選
 * 
 * @param {Object} options
 * @param {Function} [options.keyGenerator] - 自訂 key 產生器 (rowKey, colKey) => string
 * @param {Function} [options.itemFactory] - 產生儲存資料物件的工廠函式 (rowKey, colKey) => any
 * @returns {Object} 矩陣勾選狀態與操作方法
 */
export function useMatrixSelection(options = {}) {
  const {
    keyGenerator = (rowKey, colKey) => `${rowKey}_${colKey}`,
    itemFactory = (rowKey, colKey) => ({ rowKey, colKey })
  } = options

  // 內部使用 Map 儲存選取的項目物件，方便取得完整物件清單
  const selectedMap = reactive(new Map())

  function isSelected(rowKey, colKey) {
    const key = keyGenerator(rowKey, colKey)
    return selectedMap.has(key)
  }

  function toggleItem(rowKey, colKey, itemData = null) {
    const key = keyGenerator(rowKey, colKey)
    if (selectedMap.has(key)) {
      selectedMap.delete(key)
    } else {
      const item = itemData || itemFactory(rowKey, colKey)
      selectedMap.set(key, item)
    }
  }

  function selectItem(rowKey, colKey, itemData = null) {
    const key = keyGenerator(rowKey, colKey)
    if (!selectedMap.has(key)) {
      const item = itemData || itemFactory(rowKey, colKey)
      selectedMap.set(key, item)
    }
  }

  function deselectItem(rowKey, colKey) {
    const key = keyGenerator(rowKey, colKey)
    selectedMap.delete(key)
  }

  // 列 (Row) 全選判斷與切換
  function isRowAllSelected(rowKey, colKeys = []) {
    if (!colKeys || colKeys.length === 0) return false
    return colKeys.every(colKey => selectedMap.has(keyGenerator(rowKey, colKey)))
  }

  function toggleRow(rowKey, colKeys = [], getRowItem = null) {
    const allSelected = isRowAllSelected(rowKey, colKeys)
    colKeys.forEach(colKey => {
      const key = keyGenerator(rowKey, colKey)
      if (allSelected) {
        selectedMap.delete(key)
      } else {
        const item = getRowItem ? getRowItem(rowKey, colKey) : itemFactory(rowKey, colKey)
        selectedMap.set(key, item)
      }
    })
  }

  // 欄 (Column) 全選判斷與切換
  function isColAllSelected(colKey, rowKeys = []) {
    if (!rowKeys || rowKeys.length === 0) return false
    return rowKeys.every(rowKey => selectedMap.has(keyGenerator(rowKey, colKey)))
  }

  function toggleCol(colKey, rowKeys = [], getColItem = null) {
    const allSelected = isColAllSelected(colKey, rowKeys)
    rowKeys.forEach(rowKey => {
      const key = keyGenerator(rowKey, colKey)
      if (allSelected) {
        selectedMap.delete(key)
      } else {
        const item = getColItem ? getColItem(rowKey, colKey) : itemFactory(rowKey, colKey)
        selectedMap.set(key, item)
      }
    })
  }

  // 全選整個矩陣
  function selectAll(rowKeys = [], colKeys = [], getItem = null) {
    rowKeys.forEach(rowKey => {
      colKeys.forEach(colKey => {
        const key = keyGenerator(rowKey, colKey)
        const item = getItem ? getItem(rowKey, colKey) : itemFactory(rowKey, colKey)
        selectedMap.set(key, item)
      })
    })
  }

  // 清除所有選取
  function clearSelection() {
    selectedMap.clear()
  }

  const selectedCount = computed(() => selectedMap.size)
  const selectedItems = computed(() => Array.from(selectedMap.values()))

  return {
    selectedMap,
    selectedCount,
    selectedItems,
    isSelected,
    toggleItem,
    selectItem,
    deselectItem,
    isRowAllSelected,
    toggleRow,
    isColAllSelected,
    toggleCol,
    selectAll,
    clearSelection
  }
}
