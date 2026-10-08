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
                <option value="all">全部年度</option>
                <option value="115">115 年度 (最新)</option>
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
                    {{ st.year || '115' }}
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { absenteeService } from '../../services/absenteeService'
import { usePagination } from '../../composables/usePagination'
import { globalSelectedYear } from '../../composables/useAssessmentYear'

// 2. 缺考名單下載 (年級、班級、科目篩選與分頁)
// ==========================================
const absenteeFilters = reactive({
  year: globalSelectedYear?.value || '115',
  grade: 'all',
  classroom: 'all',
  subject: 'all',
  keyword: ''
})

const allAbsenteeList = ref([])

async function loadAbsenteeList() {
  const res = await absenteeService.getAbsenteeList()
  if (res.success) {
    allAbsenteeList.value = res.data
  }
}

onMounted(() => {
  loadAbsenteeList()
})

const totalAbsenteeSubjectCount = computed(() => {
  return allAbsenteeList.value.reduce((sum, item) => sum + (item.subjects?.length || 0), 0)
})

const filteredAbsenteeList = computed(() => {
  return allAbsenteeList.value.filter(item => {
    // Year filter
    if (absenteeFilters.year !== 'all') {
      if (item.year && item.year !== absenteeFilters.year) {
        return false
      }
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

// 使用共用 usePagination Composable
const {
  currentPage: absenteeCurrentPage,
  pageSize: absenteePageSize,
  paginatedItems: paginatedAbsenteeList,
  resetPage: resetAbsenteePage
} = usePagination(filteredAbsenteeList, { initialPageSize: 8 })

function handleFilterChange() {
  resetAbsenteePage()
}

function resetAbsenteeFilters() {
  absenteeFilters.year = '115'
  absenteeFilters.grade = 'all'
  absenteeFilters.classroom = 'all'
  absenteeFilters.subject = 'all'
  absenteeFilters.keyword = ''
  resetAbsenteePage()
  ElMessage.info('已重設篩選條件')
}

function exportAbsentee() {
  const count = filteredAbsenteeList.value.length
  const subCount = filteredAbsenteeList.value.reduce((s, it) => s + (it.subjects?.length || 0), 0)
  ElMessage.success(`已開始匯出符合條件之【${count} 位缺考學生名冊（共 ${subCount} 科次）】EXCEL 檔案`)
}
</script>
