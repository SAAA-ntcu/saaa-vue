<template>
  <div class="w-full max-w-5xl mx-auto p-2 md:p-6 bg-white/80 backdrop-blur-xs rounded-2xl">
    <!-- Header title -->
    <div class="mb-4 md:mb-6 pb-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#52796f]/10 text-[#52796f] flex items-center justify-center shrink-0 shadow-xs">
          <!-- Integrated / Collection SVG -->
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl md:text-2xl font-black text-slate-800 tracking-wider m-0">
            綜合專區
            <span class="text-xs md:text-sm font-medium text-slate-400 ml-1 font-mono">Integrated Center</span>
          </h2>
          <div class="h-1 w-8 bg-[#52796f] rounded-full mt-1"></div>
        </div>
      </div>

      <!-- Year badge -->
      <div class="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
        當前檢測週期：115 學年度
      </div>
    </div>

    <!-- Navigation Tabs matching Dropdown Fields -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-100 scrollbar-none">
      <button
        v-for="t in integratedTabs"
        :key="t.key"
        type="button"
        @click="switchTab(t.key)"
        class="px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5"
        :class="activeTab === t.key
          ? 'bg-[#52796f] text-white shadow-xs'
          : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'"
      >
        <span>{{ t.title }}</span>
      </button>
    </div>

    <!-- TAB 1: 教師帳號管理 -->
    <div v-if="activeTab === 'teachers'" class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3 pb-2">
        <div class="text-xs text-slate-500 font-medium">
          管理本校教師登入權限、重設密碼與施測班級對應。
        </div>
        <div class="flex items-center gap-2">
          <button @click="showToast('新增教師帳號')" class="px-3.5 py-1.5 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新增教師
          </button>
          <button @click="showToast('批次匯入教師帳號')" class="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1 cursor-pointer">
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
                  <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
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

    <!-- TAB 2: 缺考名單下載 -->
    <div v-else-if="activeTab === 'absentee'" class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-3 pb-2">
        <div class="text-xs text-slate-500 font-medium">
          115學年度施測缺考學生名冊，可匯出提供下載存檔使用。
        </div>
        <button @click="exportAbsentee" class="px-4 py-2 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          匯出缺考學生清冊 (Excel)
        </button>
      </div>

      <!-- Absentee Table -->
      <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs bg-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th class="py-3 px-4">年級班級</th>
                <th class="py-3 px-4">座號</th>
                <th class="py-3 px-4">學生姓名</th>
                <th class="py-3 px-4">缺考科目</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              <tr v-for="st in absenteeList" :key="st.id" class="hover:bg-slate-50/60 transition">
                <td class="py-3 px-4 font-bold text-slate-800">{{ st.class }}</td>
                <td class="py-3 px-4 font-mono text-slate-500">{{ st.seatNo }}</td>
                <td class="py-3 px-4 font-bold text-slate-800">{{ st.name }}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    {{ st.subject }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const integratedTabs = [
  { key: 'teachers', title: '教師帳號管理' },
  { key: 'absentee', title: '缺考名單下載' }
]

const activeTab = ref(route.query.tab || 'teachers')

watch(() => route.query.tab, (newTab) => {
  if (newTab && integratedTabs.some(t => t.key === newTab)) {
    activeTab.value = newTab
  }
})

function switchTab(key) {
  activeTab.value = key
  router.replace({ query: { ...route.query, tab: key } })
}

const teacherList = ref([
  { id: 1, account: 't_wang01', name: '王大明', role: '導師', assignedClass: '五年1班' },
  { id: 2, account: 't_lee02', name: '李淑芬', role: '導師', assignedClass: '五年2班' },
  { id: 3, account: 't_chen03', name: '陳建志', role: '學年主任', assignedClass: '五年級全學年' },
  { id: 4, account: 't_lin04', name: '林雅婷', role: '科任教師', assignedClass: '五年級 (數學)' },
  { id: 5, account: 't_chang05', name: '張文雄', role: '科任教師', assignedClass: '六年級 (英語文)' }
])

const absenteeList = ref([
  { id: 1, class: '五年1班', seatNo: '07', name: '林○宇', subject: '數學' },
  { id: 2, class: '五年2班', seatNo: '15', name: '張○萱', subject: '英語文' },
  { id: 3, class: '六年1班', seatNo: '22', name: '陳○翔', subject: '國語文' }
])

function showToast(feature) {
  ElMessage.info(`已前往【${feature}】`)
}

function resetTeacherPw(name) {
  ElMessage.success(`已重設【${name}】教師密碼為預設值：saaa.ntcu`)
}

function exportAbsentee() {
  ElMessage.success('已匯出全校缺考名單 EXCEL 報表')
}
</script>
