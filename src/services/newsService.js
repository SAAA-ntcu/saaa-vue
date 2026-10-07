import { apiClient } from './apiClient'
import { newsList } from '../data/newsData'

/**
 * newsService
 * 最新消息服務模組
 */
export const newsService = {
  /**
   * 取得最新消息清單
   */
  async getNewsList() {
    return apiClient.request(() => [...newsList])
  },

  /**
   * 關鍵字搜尋最新消息
   */
  async searchNews(keyword = '') {
    return apiClient.request(() => {
      const kw = keyword.trim().toLowerCase()
      if (!kw) return [...newsList]
      return newsList.filter(
        (item) =>
          item.title.toLowerCase().includes(kw) ||
          item.type.toLowerCase().includes(kw) ||
          item.date.includes(kw)
      )
    })
  },

  /**
   * 依 ID 取得特定消息詳情
   */
  async getNewsById(id) {
    return apiClient.request(() => {
      const news = newsList.find((n) => n.id === id)
      if (!news) throw new Error('找不到該最新消息')
      return news
    })
  }
}
