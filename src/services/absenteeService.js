import { apiClient } from './apiClient'
import { defaultAbsenteeList } from '../data/absenteeData'

let absenteeDatabase = [...defaultAbsenteeList]

/**
 * absenteeService
 * 缺考名單服務模組
 */
export const absenteeService = {
  /**
   * 取得缺考名單，支援多條件篩選
   */
  async getAbsenteeList(filters = {}) {
    return apiClient.request(() => {
      let result = [...absenteeDatabase]

      if (filters.year && filters.year !== 'all') {
        result = result.filter(item => item.year === String(filters.year))
      }

      if (filters.grade && filters.grade !== 'all') {
        result = result.filter(item => String(item.grade) === String(filters.grade))
      }

      if (filters.classroom && filters.classroom !== 'all') {
        result = result.filter(item => String(item.classroom) === String(filters.classroom))
      }

      if (filters.subject && filters.subject !== 'all') {
        result = result.filter(item => item.subjects && item.subjects.includes(filters.subject))
      }

      if (filters.keyword && filters.keyword.trim()) {
        const kw = filters.keyword.trim().toLowerCase()
        result = result.filter(item =>
          item.name.toLowerCase().includes(kw) ||
          item.seatNo.includes(kw) ||
          item.class.toLowerCase().includes(kw)
        )
      }

      return result
    })
  },

  /**
   * 取得缺考名單全域統計資訊
   */
  async getAbsenteeStats() {
    return apiClient.request(() => {
      const totalStudents = absenteeDatabase.length
      const totalSubjects = absenteeDatabase.reduce((sum, item) => sum + (item.subjects?.length || 0), 0)
      return { totalStudents, totalSubjects }
    })
  }
}
