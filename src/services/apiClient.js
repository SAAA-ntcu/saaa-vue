/**
 * apiClient
 * 統一 API 通訊客戶端 / Mock 適配器
 * 
 * 核心職責：
 * 1. 提供統一的非同步資料請求介面 (Promise-based)
 * 2. 封裝標準回傳格式：{ success: boolean, data: T, code: number, message?: string }
 * 3. 具備模擬伺服器延遲 (Simulated Latency) 與異常錯誤處理機制
 * 4. 未來串接真實後端 (例如 Axios 或 Fetch) 時，只需在此檔案切換實作，業務層 (Services) 與視圖層 (Views) 無需修改
 */

const DEFAULT_SIMULATE_DELAY = 10 // 毫秒，維持流暢體驗，同時保留 async 規範

export const apiClient = {
  /**
   * 執行 API 請求 (模擬或真實)
   * @param {Function} dataFetcher - 回傳資料的函式
   * @param {Object} options
   * @param {number} [options.delay=10] - 模擬延遲毫秒數
   * @param {string} [options.errorMessage='請求失敗'] - 失敗時的預設訊息
   * @returns {Promise<{ success: boolean, data: any, code: number, message: string }>}
   */
  async request(dataFetcher, options = {}) {
    const delay = options.delay ?? DEFAULT_SIMULATE_DELAY
    const errorMessage = options.errorMessage || '系統處理異常，請稍後再試'

    try {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
      const rawData = await (typeof dataFetcher === 'function' ? dataFetcher() : dataFetcher)
      
      return {
        success: true,
        code: 200,
        data: rawData,
        message: 'success'
      }
    } catch (error) {
      console.error('[API Error]:', error)
      return {
        success: false,
        code: error.code || 500,
        data: null,
        message: error.message || errorMessage
      }
    }
  },

  /**
   * 成功回應工廠函式
   */
  wrapSuccess(data, message = '操作成功') {
    return {
      success: true,
      code: 200,
      data,
      message
    }
  },

  /**
   * 失敗回應工廠函式
   */
  wrapError(message = '操作失敗', code = 400) {
    return {
      success: false,
      code,
      data: null,
      message
    }
  }
}
