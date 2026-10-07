import { apiClient } from './apiClient'
import {
  assessmentYears,
  assessmentSubjects,
  gradesHeader,
  getAssessmentDownloadUrl
} from '../data/assessmentData'

/**
 * assessmentService
 * 評量架構服務模組
 */
export const assessmentService = {
  /**
   * 取得可用施測年度清單
   */
  async getYears() {
    return apiClient.request(() => [...assessmentYears])
  },

  /**
   * 取得評量架構科目設定
   */
  async getSubjects() {
    return apiClient.request(() => [...assessmentSubjects])
  },

  /**
   * 取得年級表頭設定
   */
  async getGradesHeader() {
    return apiClient.request(() => [...gradesHeader])
  },

  /**
   * 取得特定項目的下載網址
   */
  getDownloadUrl(year, gradeName, subject) {
    return getAssessmentDownloadUrl(year, gradeName, subject)
  }
}
