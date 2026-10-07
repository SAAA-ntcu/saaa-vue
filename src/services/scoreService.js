import { apiClient } from './apiClient'
import {
  reportYears,
  reportTypes,
  paperGrades,
  isReportTypeAvailable,
  getReportDownloadUrl
} from '../data/reportsMatrixData'
import {
  annualReportYears,
  annualReportSubjects,
  annualGradesHeader,
  isAnnualReportAvailable,
  getAnnualReportDownloadUrl
} from '../data/annualReportData'
import {
  defaultScoreSummaryList,
  generateQuestionAnalysisData
} from '../data/scoreData'

let scoreSummaries = [...defaultScoreSummaryList]

/**
 * scoreService
 * 成績專區服務模組
 */
export const scoreService = {
  // ----------------------------------------------------
  // 1. 各級報表下載相關設定與方法
  // ----------------------------------------------------
  async getReportYears() {
    return apiClient.request(() => [...reportYears])
  },

  async getReportTypes() {
    return apiClient.request(() => [...reportTypes])
  },

  async getPaperGrades() {
    return apiClient.request(() => [...paperGrades])
  },

  isReportTypeAvailable(paperKey, reportKey) {
    return isReportTypeAvailable(paperKey, reportKey)
  },

  getReportDownloadUrl(year, paperLabel, reportName) {
    return getReportDownloadUrl(year, paperLabel, reportName)
  },

  // ----------------------------------------------------
  // 2. 年度成果報告相關設定與方法
  // ----------------------------------------------------
  async getAnnualReportYears() {
    return apiClient.request(() => [...annualReportYears])
  },

  async getAnnualReportSubjects() {
    return apiClient.request(() => [...annualReportSubjects])
  },

  async getAnnualGradesHeader() {
    return apiClient.request(() => [...annualGradesHeader])
  },

  isAnnualReportAvailable(year, gradeKey, subject) {
    return isAnnualReportAvailable(year, gradeKey, subject)
  },

  getAnnualReportDownloadUrl(year, gradeLabel, subject) {
    return getAnnualReportDownloadUrl(year, gradeLabel, subject)
  },

  // ----------------------------------------------------
  // 3. 成績清冊與試題分析資料
  // ----------------------------------------------------
  async getScoreSummaries(filters = {}) {
    return apiClient.request(() => {
      let result = [...scoreSummaries]
      if (filters.year) {
        result = result.filter(item => item.year === String(filters.year))
      }
      return result
    })
  },

  async getQuestionAnalysisData(count = 30) {
    return apiClient.request(() => generateQuestionAnalysisData(count))
  }
}
