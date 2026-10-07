<template>
<!-- VIEW 2: 缺考名單下載 (年級/班級篩選表格版)   -->
    <!-- ========================================== -->
    <div class="border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs bg-white">
      <!-- Card Header -->
      <div class="bg-slate-50/70 border-b border-slate-200/80 py-3 text-center">
        <h3 class="text-sm md:text-base font-bold text-slate-800 m-0 tracking-wider">
          缺考名單下載
        </h3>
      </div>

      <div class="p-4 sm:p-6 space-y-4">
        <!-- Top Action Bar -->
        <div class="flex items-center justify-between flex-wrap gap-3 pb-1">
          <div class="text-xs text-slate-500 font-medium">
            115 年度施測缺考學生名冊，可依照年級、班級篩選並匯出清冊存檔。
          </div>
          <button
            type="button"
            @click="exportAbsentee"
            class="px-4 py-2 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            匯出缺考學生清冊 (Excel)
          </button>
        </div>

        <!-- Filter Controls (年度、年級、班級、科目、關鍵字) -->
        <div class="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <!-- 年度篩選 -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">年度</label>
              <select
                v-model="absenteeFilters.year"
                @change="handleFilterChange"
                class="w-full h-9 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] cursor-pointer"
              >
                <option value="115">115 年度</option>
                <option value="114">114 年度</option>
                <option value="113">113 年度</option>
              </select>
            </div>

            <!-- 年級篩選 -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">施測年級</label>
              <select
                v-model="absenteeFilters.grade"
                @change="handleFilterChange"
                class="w-full h-9 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] cursor-pointer"
              >
                <option value="all">全部年級</option>
                <option value="3">三年級</option>
                <option value="4">四年級</option>
                <option value="5">五年級</option>
                <option value="6">六年級</option>
              </select>
            </div>

            <!-- 班級篩選 -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">班級</label>
              <select
                v-model="absenteeFilters.classroom"
                @change="handleFilterChange"
                class="w-full h-9 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] cursor-pointer"
              >
                <option value="all">全部班級</option>
                <option value="1">1 班</option>
                <option value="2">2 班</option>
                <option value="3">3 班</option>
                <option value="4">4 班</option>
              </select>
            </div>

            <!-- 科目篩選 -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">缺考科目</label>
              <select
                v-model="absenteeFilters.subject"
                @change="handleFilterChange"
                class="w-full h-9 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] cursor-pointer"
              >
                <option value="all">全部科目</option>
                <option value="國語文">國語文</option>
                <option value="數學">數學</option>
                <option value="英語文">英語文</option>
              </select>
            </div>

            <!-- 關鍵字搜尋 & 重設 -->
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">學生搜尋</label>
              <div class="flex items-center gap-1.5">
                <input
                  v-model="absenteeFilters.keyword"
                  @input="handleFilterChange"
                  type="text"
                  placeholder="姓名或座號"
                  class="w-full h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f]"
                />
                <button
                  type="button"
                  @click="resetAbsenteeFilters"
                  class="h-9 px-3 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition"
                  title="清除所有條件"
                >
                  重設
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Absentee Table -->
        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th class="py-3 px-3 text-center w-16">年度</th>
                  <th class="py-3 px-4">年級班級</th>
                  <th class="py-3 px-4 text-center">座號</th>
                  <th class="py-3 px-4">學生姓名</th>
                  <th class="py-3 px-4">缺考科目</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                <tr
                  v-for="st in paginatedAbsenteeList"
                  :key="st.id"
                  class="hover:bg-slate-50/70 transition"
                >
                  <td class="py-3 px-3 text-center font-mono font-bold text-slate-700">
                    {{ st.year || absenteeFilters.year }}
                  </td>
                  <td class="py-3 px-4 font-bold text-slate-800">{{ st.class }}</td>
                  <td class="py-3 px-4 text-center font-mono text-slate-500">{{ st.seatNo }}</td>
                  <td class="py-3 px-4 font-bold text-slate-800">{{ st.name }}</td>
                  <td class="py-3 px-4">
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span
                        v-for="sub in st.subjects"
                        :key="sub"
                        class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold shrink-0"
                        :class="sub === '國語文' ? 'bg-amber-50 text-amber-700 border border-amber-200' : sub === '數學' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-rose-50 text-rose-700 border border-rose-200'"
                      >
                        {{ sub }}
                      </span>
                    </div>
                  </td>
                </tr>

                <!-- Empty state if no matched items -->
                <tr v-if="filteredAbsenteeList.length === 0">
                  <td colspan="5" class="py-12 text-center text-slate-400">
                    <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <span>查無符合篩選條件的缺考學生</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bottom Pagination & Counts -->
        <div class="flex items-center justify-between flex-wrap gap-3 pt-2">
          <div class="text-xs text-slate-500 font-medium">
            全校缺考學生共 <span class="font-bold text-slate-800">{{ allAbsenteeList.length }}</span> 人（共 <span class="font-bold text-slate-800">{{ totalAbsenteeSubjectCount }}</span> 科次），符合篩選條件：<span class="font-bold text-[#52796f]">{{ filteredAbsenteeList.length }}</span> 人
          </div>
          <el-pagination
            v-if="filteredAbsenteeList.length > absenteePageSize"
            v-model:current-page="absenteeCurrentPage"
            :page-size="absenteePageSize"
            :total="filteredAbsenteeList.length"
            layout="prev, pager, next"
            background
            size="small"
          />
        </div>
      </div>
    </div>

    
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 2. 缺考名單下載 (年級、班級、科目篩選與分頁)
// ==========================================
const absenteeFilters = reactive({
  year: '115',
  grade: 'all',
  classroom: 'all',
  subject: 'all',
  keyword: ''
})

const absenteeCurrentPage = ref(1)
const absenteePageSize = ref(8)

const allAbsenteeList = ref([
  // 三年級
  { id: 1, year: '115', grade: '3', classroom: '1', class: '三年1班', seatNo: '04', name: '王○晴', subjects: ['國語文', '數學'] },
  { id: 2, year: '115', grade: '3', classroom: '1', class: '三年1班', seatNo: '12', name: '李○哲', subjects: ['數學'] },
  { id: 3, year: '115', grade: '3', classroom: '2', class: '三年2班', seatNo: '09', name: '張○恩', subjects: ['英語文'] },
  { id: 4, year: '115', grade: '3', classroom: '3', class: '三年3班', seatNo: '18', name: '林○辰', subjects: ['國語文'] },
  
  // 四年級
  { id: 5, year: '115', grade: '4', classroom: '1', class: '四年1班', seatNo: '02', name: '黃○宏', subjects: ['國語文', '數學', '英語文'] }, // 全科缺考
  { id: 6, year: '115', grade: '4', classroom: '1', class: '四年1班', seatNo: '15', name: '許○婷', subjects: ['英語文'] },
  { id: 7, year: '115', grade: '4', classroom: '2', class: '四年2班', seatNo: '11', name: '蔡○安', subjects: ['數學', '英語文'] },
  { id: 8, year: '115', grade: '4', classroom: '3', class: '四年3班', seatNo: '23', name: '劉○廷', subjects: ['英語文'] },
  { id: 9, year: '115', grade: '4', classroom: '4', class: '四年4班', seatNo: '06', name: '范○宇', subjects: ['國語文'] },

  // 五年級
  { id: 10, year: '115', grade: '5', classroom: '1', class: '五年1班', seatNo: '07', name: '林○宇', subjects: ['數學', '英語文'] },
  { id: 11, year: '115', grade: '5', classroom: '1', class: '五年1班', seatNo: '21', name: '鄭○凱', subjects: ['國語文'] },
  { id: 12, year: '115', grade: '5', classroom: '2', class: '五年2班', seatNo: '15', name: '張○萱', subjects: ['英語文'] },
  { id: 13, year: '115', grade: '5', classroom: '2', class: '五年2班', seatNo: '26', name: '吳○嘉', subjects: ['數學'] },
  { id: 14, year: '115', grade: '5', classroom: '3', class: '五年3班', seatNo: '08', name: '趙○芬', subjects: ['國語文', '數學'] },

  // 六年級
  { id: 15, year: '115', grade: '6', classroom: '1', class: '六年1班', seatNo: '05', name: '周○廷', subjects: ['國語文', '數學', '英語文'] }, // 全科缺考
  { id: 16, year: '115', grade: '6', classroom: '1', class: '六年1班', seatNo: '22', name: '陳○翔', subjects: ['國語文'] },
  { id: 17, year: '115', grade: '6', classroom: '2', class: '六年2班', seatNo: '14', name: '謝○睿', subjects: ['英語文'] },
  { id: 18, year: '115', grade: '6', classroom: '3', class: '六年3班', seatNo: '19', name: '楊○萱', subjects: ['國語文'] },
  { id: 19, year: '115', grade: '6', classroom: '3', class: '六年3班', seatNo: '27', name: '郭○豪', subjects: ['數學'] }
])

const totalAbsenteeSubjectCount = computed(() => {
  return allAbsenteeList.value.reduce((sum, item) => sum + (item.subjects?.length || 0), 0)
})

const filteredAbsenteeList = computed(() => {
  return allAbsenteeList.value.filter(item => {
    // Year filter
    if (absenteeFilters.year && item.year && item.year !== absenteeFilters.year) {
      return false
    }
    // Grade filter
    if (absenteeFilters.grade !== 'all' && item.grade !== absenteeFilters.grade) {
      return false
    }
    // Classroom filter
    if (absenteeFilters.classroom !== 'all' && item.classroom !== absenteeFilters.classroom) {
      return false
    }
    // Subject filter
    if (absenteeFilters.subject !== 'all' && !item.subjects.includes(absenteeFilters.subject)) {
      return false
    }
    // Keyword search (name or seat number or class)
    if (absenteeFilters.keyword.trim()) {
      const kw = absenteeFilters.keyword.trim().toLowerCase()
      const matchName = item.name.toLowerCase().includes(kw)
      const matchSeat = item.seatNo.includes(kw)
      const matchClass = item.class.toLowerCase().includes(kw)
      if (!matchName && !matchSeat && !matchClass) {
        return false
      }
    }
    return true
  })
})

const paginatedAbsenteeList = computed(() => {
  const start = (absenteeCurrentPage.value - 1) * absenteePageSize.value
  return filteredAbsenteeList.value.slice(start, start + absenteePageSize.value)
})

function handleFilterChange() {
  absenteeCurrentPage.value = 1
}

function resetAbsenteeFilters() {
  absenteeFilters.year = '115'
  absenteeFilters.grade = 'all'
  absenteeFilters.classroom = 'all'
  absenteeFilters.subject = 'all'
  absenteeFilters.keyword = ''
  absenteeCurrentPage.value = 1
  ElMessage.info('已重設篩選條件')
}

function exportAbsentee() {
  const count = filteredAbsenteeList.value.length
  const subCount = filteredAbsenteeList.value.reduce((s, it) => s + (it.subjects?.length || 0), 0)
  ElMessage.success(`已開始匯出符合條件之【${count} 位缺考學生名冊（共 ${subCount} 科次）】EXCEL 檔案`)
}

</script>
