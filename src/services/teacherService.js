import { apiClient } from './apiClient'
import { getInitialTeachers } from '../data/teacherData'

// 記憶體中模擬的教師資料庫
let teacherDatabase = getInitialTeachers()

/**
 * teacherService
 * 教師帳號管理服務模組
 */
export const teacherService = {
  /**
   * 取得教師清單，支援多條件篩選
   */
  async getTeachers(filters = {}) {
    return apiClient.request(() => {
      let result = [...teacherDatabase]

      if (filters.year) {
        result = result.filter(t => t.year === String(filters.year))
      }

      if (filters.role && filters.role !== 'all') {
        result = result.filter(t => t.role === filters.role)
      }

      if (filters.status && filters.status !== 'all') {
        const wantActive = filters.status === 'active'
        result = result.filter(t => t.isActive === wantActive)
      }

      if (filters.grade && filters.grade !== 'all') {
        result = result.filter(t => String(t.grade) === String(filters.grade))
      }

      if (filters.keyword && filters.keyword.trim()) {
        const kw = filters.keyword.trim().toLowerCase()
        result = result.filter(t =>
          (t.username && t.username.toLowerCase().includes(kw)) ||
          (t.name && t.name.toLowerCase().includes(kw)) ||
          (t.email && t.email.toLowerCase().includes(kw))
        )
      }

      return result
    })
  },

  /**
   * 新增教師
   */
  async createTeacher(payload) {
    return apiClient.request(() => {
      const newTeacher = {
        id: Date.now(),
        selected: false,
        year: payload.year || '115',
        username: payload.username,
        name: payload.name,
        adminCode: payload.username,
        role: payload.role,
        grade: payload.grade || '',
        assignedClass: payload.assignedClass || '',
        email: payload.email,
        isActive: payload.isActive !== undefined ? payload.isActive : true
      }
      teacherDatabase.unshift(newTeacher)
      return newTeacher
    })
  },

  /**
   * 更新教師
   */
  async updateTeacher(id, payload) {
    return apiClient.request(() => {
      const index = teacherDatabase.findIndex(t => t.id === id)
      if (index === -1) throw new Error(`找不到 ID 為 ${id} 的教師`)
      
      teacherDatabase[index] = {
        ...teacherDatabase[index],
        ...payload
      }
      return teacherDatabase[index]
    })
  },

  /**
   * 批次更新帳號啟用/停用狀態
   */
  async batchUpdateStatus(ids = [], isActive = true) {
    return apiClient.request(() => {
      const idSet = new Set(ids)
      teacherDatabase = teacherDatabase.map(t => {
        if (idSet.has(t.id)) {
          return { ...t, isActive }
        }
        return t
      })
      return { updatedCount: ids.length, isActive }
    })
  },

  /**
   * 批次重設密碼
   */
  async batchResetPassword(ids = []) {
    return apiClient.request(() => {
      return { resetCount: ids.length }
    })
  },

  /**
   * 批次匯入教師
   */
  async batchImport(fileName) {
    return apiClient.request(() => {
      return { importedFileName: fileName, count: 5 }
    }, { delay: 50 })
  }
}
