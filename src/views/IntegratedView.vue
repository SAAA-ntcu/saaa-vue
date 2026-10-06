<template>
  <div class="w-full max-w-6xl mx-auto p-2 sm:p-4 md:p-6 bg-white/80 backdrop-blur-xs rounded-2xl">
    
    <!-- Top Main Tab Switcher (教師帳號管理 / 缺考名單下載) -->
    <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-wrap gap-3">
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="switchMainTab('teachers')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          :class="mainTab === 'teachers'
            ? 'bg-[#52796f] text-white shadow-xs'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          教師帳號管理
        </button>

        <button
          type="button"
          @click="switchMainTab('absentee')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          :class="mainTab === 'absentee'
            ? 'bg-[#52796f] text-white shadow-xs'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          缺考名單下載
        </button>
      </div>

      <!-- Unit Tag -->
      <div class="text-xs text-slate-400 font-medium">
        目前單位：<span class="text-slate-700 font-bold">{{ state.username }}</span>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 1: 教師帳號管理 (上一版表格模式)       -->
    <!-- ========================================== -->
    <div v-if="mainTab === 'teachers'" class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3 pb-2">
        <div class="text-xs text-slate-500 font-medium">
          管理本校教師登入權限、重設密碼與施測班級對應。
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="showToast('新增教師帳號')"
            class="px-3.5 py-1.5 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新增教師
          </button>
          <button
            type="button"
            @click="showToast('批次匯入教師帳號')"
            class="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <svg class="w-3.5 h-3.5 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            批次匯入 (Excel)
          </button>
        </div>
      </div>

      <!-- Teacher Accounts Table -->
      <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs bg-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th class="py-3 px-4">帳號名稱</th>
                <th class="py-3 px-4">教師姓名</th>
                <th class="py-3 px-4">職稱身分</th>
                <th class="py-3 px-4">任教年級/班級</th>
                <th class="py-3 px-4 text-center">狀態</th>
                <th class="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              <tr v-for="teacher in teacherList" :key="teacher.id" class="hover:bg-slate-50/60 transition">
                <td class="py-3 px-4 font-mono text-slate-600">{{ teacher.account }}</td>
                <td class="py-3 px-4 font-bold text-slate-800">{{ teacher.name }}</td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                    :class="teacher.role === '導師' ? 'bg-sky-50 text-sky-700 border border-sky-200' : teacher.role === '學年主任' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
                  >
                    {{ teacher.role }}
                  </span>
                </td>
                <td class="py-3 px-4">{{ teacher.assignedClass }}</td>
                <td class="py-3 px-4 text-center">
                  <span class="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    啟用中
                  </span>
                </td>
                <td class="py-3 px-4 text-center">
                  <button @click="resetTeacherPw(teacher.name)" class="text-[#52796f] hover:text-[#354f52] font-semibold hover:underline cursor-pointer">
                    重設密碼
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 2: 缺考名單下載 (年級/班級篩選表格版)   -->
    <!-- ========================================== -->
    <div v-else-if="mainTab === 'absentee'" class="border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs bg-white">
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
            115 學年度施測缺考學生名冊，可依照年級、班級篩選並匯出清冊存檔。
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

        <!-- Filter Controls (年級、班級、科目、關鍵字) -->
        <div class="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                  <td colspan="4" class="py-12 text-center text-slate-400">
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

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { state } = useAuth()

// Main tab: 'teachers' or 'absentee'
const mainTab = ref(route.query.tab === 'absentee' ? 'absentee' : 'teachers')

// Watch query changes from Header dropdown clicks
watch(() => route.query.tab, (newTab) => {
  if (newTab === 'absentee') {
    mainTab.value = 'absentee'
  } else if (newTab === 'teachers') {
    mainTab.value = 'teachers'
  }
})

function switchMainTab(tab) {
  mainTab.value = tab
  router.replace({ query: { ...route.query, tab } })
}

// ==========================================
// 1. 教師帳號管理 (上一版)
// ==========================================
const teacherList = ref([
  { id: 1, account: 't_wang01', name: '王大明', role: '導師', assignedClass: '三年1班' },
  { id: 2, account: 't_lee02', name: '李淑芬', role: '導師', assignedClass: '四年1班' },
  { id: 3, account: 't_chen03', name: '陳建志', role: '學年主任', assignedClass: '五年級全學年' },
  { id: 4, account: 't_lin04', name: '林雅婷', role: '科任教師', assignedClass: '五年級 (數學)' },
  { id: 5, account: 't_chang05', name: '張文雄', role: '科任教師', assignedClass: '六年級 (英語文)' },
  { id: 6, account: 't_huang06', name: '黃美玲', role: '導師', assignedClass: '六年1班' },
  { id: 7, account: 't_wu07', name: '吳志強', role: '學年主任', assignedClass: '六年級全學年' }
])

function showToast(feature) {
  ElMessage.info(`已前往【${feature}】`)
}

function resetTeacherPw(name) {
  ElMessage.success(`已重設【${name}】教師密碼為預設值：saaa.ntcu`)
}

// ==========================================
// 2. 缺考名單下載 (年級、班級、科目篩選與分頁)
// ==========================================
const absenteeFilters = reactive({
  grade: 'all',
  classroom: 'all',
  subject: 'all',
  keyword: ''
})

const absenteeCurrentPage = ref(1)
const absenteePageSize = ref(8)

const allAbsenteeList = ref([
  // 三年級
  { id: 1, grade: '3', classroom: '1', class: '三年1班', seatNo: '04', name: '王○晴', subjects: ['國語文', '數學'] },
  { id: 2, grade: '3', classroom: '1', class: '三年1班', seatNo: '12', name: '李○哲', subjects: ['數學'] },
  { id: 3, grade: '3', classroom: '2', class: '三年2班', seatNo: '09', name: '張○恩', subjects: ['英語文'] },
  { id: 4, grade: '3', classroom: '3', class: '三年3班', seatNo: '18', name: '林○辰', subjects: ['國語文'] },
  
  // 四年級
  { id: 5, grade: '4', classroom: '1', class: '四年1班', seatNo: '02', name: '黃○宏', subjects: ['國語文', '數學', '英語文'] }, // 全科缺考
  { id: 6, grade: '4', classroom: '1', class: '四年1班', seatNo: '15', name: '許○婷', subjects: ['英語文'] },
  { id: 7, grade: '4', classroom: '2', class: '四年2班', seatNo: '11', name: '蔡○安', subjects: ['數學', '英語文'] },
  { id: 8, grade: '4', classroom: '3', class: '四年3班', seatNo: '23', name: '劉○廷', subjects: ['英語文'] },
  { id: 9, grade: '4', classroom: '4', class: '四年4班', seatNo: '06', name: '范○宇', subjects: ['國語文'] },

  // 五年級
  { id: 10, grade: '5', classroom: '1', class: '五年1班', seatNo: '07', name: '林○宇', subjects: ['數學', '英語文'] },
  { id: 11, grade: '5', classroom: '1', class: '五年1班', seatNo: '21', name: '鄭○凱', subjects: ['國語文'] },
  { id: 12, grade: '5', classroom: '2', class: '五年2班', seatNo: '15', name: '張○萱', subjects: ['英語文'] },
  { id: 13, grade: '5', classroom: '2', class: '五年2班', seatNo: '26', name: '吳○嘉', subjects: ['數學'] },
  { id: 14, grade: '5', classroom: '3', class: '五年3班', seatNo: '08', name: '趙○芬', subjects: ['國語文', '數學'] },

  // 六年級
  { id: 15, grade: '6', classroom: '1', class: '六年1班', seatNo: '05', name: '周○廷', subjects: ['國語文', '數學', '英語文'] }, // 全科缺考
  { id: 16, grade: '6', classroom: '1', class: '六年1班', seatNo: '22', name: '陳○翔', subjects: ['國語文'] },
  { id: 17, grade: '6', classroom: '2', class: '六年2班', seatNo: '14', name: '謝○睿', subjects: ['英語文'] },
  { id: 18, grade: '6', classroom: '3', class: '六年3班', seatNo: '19', name: '楊○萱', subjects: ['國語文'] },
  { id: 19, grade: '6', classroom: '3', class: '六年3班', seatNo: '27', name: '郭○豪', subjects: ['數學'] }
])

const totalAbsenteeSubjectCount = computed(() => {
  return allAbsenteeList.value.reduce((sum, item) => sum + (item.subjects?.length || 0), 0)
})

const filteredAbsenteeList = computed(() => {
  return allAbsenteeList.value.filter(item => {
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
