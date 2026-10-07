import { apiClient } from './apiClient'
import {
  examYears,
  examSubjects,
  examGradesHeader,
  getExamDownloadUrl
} from '../data/examData'

/**
 * examService
 * 試題公告服務模組
 */
export const examService = {
  /**
   * 取得可用公告年度清單
   */
  async getYears() {
    return apiClient.request(() => [...examYears])
  },

  /**
   * 取得最新公告年度
   */
  async getLatestYear() {
    return apiClient.request(() => {
      const sorted = [...examYears].sort((a, b) => Number(b) - Number(a))
      return sorted[0] || '115'
    })
  },

  /**
   * 取得試題公告科目設定
   */
  async getSubjects() {
    return apiClient.request(() => [...examSubjects])
  },

  /**
   * 取得年級表頭設定
   */
  async getGradesHeader() {
    return apiClient.request(() => [...examGradesHeader])
  },

  /**
   * 取得特定試題下載網址
   */
  getDownloadUrl(year, gradeName, subject) {
    return getExamDownloadUrl(year, gradeName, subject)
  }
}
