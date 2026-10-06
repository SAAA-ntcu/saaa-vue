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
    <!-- VIEW 1: 教師帳號管理 (Screenshots 2, 3, 4) -->
    <!-- ========================================== -->
    <div v-if="mainTab === 'teachers'" class="border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs bg-white">
      <!-- Outer Card Title Header -->
      <div class="bg-slate-50/70 border-b border-slate-200/80 py-3 text-center">
        <h3 class="text-sm md:text-base font-bold text-slate-800 m-0 tracking-wider">
          教師帳號管理
        </h3>
      </div>

      <!-- Card Inner Body -->
      <div class="p-4 sm:p-6">
        <!-- Sub-Tabs Row (Screenshots 2, 3, 4) -->
        <div class="flex items-center justify-between flex-wrap gap-2.5 pb-4 border-b border-slate-100 mb-5">
          <div class="flex items-center flex-wrap gap-2">
            <!-- 115 年度 Select -->
            <div class="relative">
              <select
                v-model="selectedYear"
                class="h-9 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg outline-none hover:border-[#52796f] cursor-pointer pr-7"
              >
                <option value="115">115 年度</option>
                <option value="114">114 年度</option>
                <option value="113">113 年度</option>
              </select>
            </div>

            <!-- 校內帳號總表 Button -->
            <button
              type="button"
              @click="teacherSubTab = 'list'"
              class="h-9 px-4 text-xs font-bold rounded-lg transition border cursor-pointer"
              :class="teacherSubTab === 'list'
                ? 'bg-[#2f3e46] text-white border-[#2f3e46] shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
            >
              校內帳號總表
            </button>

            <!-- 新增帳號 Button -->
            <button
              type="button"
              @click="teacherSubTab = 'create'"
              class="h-9 px-4 text-xs font-bold rounded-lg transition border cursor-pointer"
              :class="teacherSubTab === 'create'
                ? 'bg-[#2f3e46] text-white border-[#2f3e46] shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
            >
              新增帳號
            </button>

            <!-- 批次新增帳號 Button -->
            <button
              type="button"
              @click="teacherSubTab = 'batch'"
              class="h-9 px-4 text-xs font-bold rounded-lg transition border cursor-pointer"
              :class="teacherSubTab === 'batch'
                ? 'bg-[#2f3e46] text-white border-[#2f3e46] shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
            >
              批次新增帳號
            </button>
          </div>

          <!-- 右側：教師帳號總表匯出 (Screenshot 4) -->
          <button
            v-if="teacherSubTab === 'list'"
            type="button"
            @click="exportTeacherList"
            class="h-9 px-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            教師帳號總表匯出
          </button>
        </div>

        <!-- ============================================== -->
        <!-- SUB-TAB 1: 校內帳號總表 (Screenshot 4)         -->
        <!-- ============================================== -->
        <div v-if="teacherSubTab === 'list'">
          <!-- Count and Search Bar -->
          <div class="flex items-center justify-between flex-wrap gap-3 mb-3 text-xs">
            <div class="text-slate-600 font-medium">
              教師帳號匯出區預覽數量： <span class="font-bold text-[#52796f]">{{ selectedCount }}</span>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-slate-600 font-semibold select-none">搜尋：</label>
              <input
                v-model="searchKeyword"
                type="text"
                class="w-48 sm:w-56 h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-md outline-none focus:border-[#52796f] focus:ring-1 focus:ring-[#52796f]"
              />
            </div>
          </div>

          <!-- Data Table with Horizontal Scroll -->
          <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th class="py-3 px-3 text-center w-12">
                      <input
                        type="checkbox"
                        v-model="selectAll"
                        @change="handleSelectAll"
                        class="cursor-pointer rounded border-slate-300"
                        title="全選"
                      />
                      <span class="ml-1 text-[11px] font-normal">全選</span>
                    </th>
                    <th class="py-3 px-3 text-center w-10">No.</th>
                    <th class="py-3 px-3">組別</th>
                    <th class="py-3 px-3">管理專有名稱</th>
                    <th class="py-3 px-3">教師姓名</th>
                    <th class="py-3 px-3">班級 (非學年)</th>
                    <th class="py-3 px-3">授課年級</th>
                    <th class="py-3 px-3">授課班級</th>
                    <th class="py-3 px-3">電子郵件信箱</th>
                    <th class="py-3 px-3 text-center">有效到期期限</th>
                    <th class="py-3 px-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr
                    v-for="(t, index) in filteredTeacherAccounts"
                    :key="t.id"
                    class="hover:bg-slate-50/80 transition"
                    :class="{ 'bg-slate-50/50': t.selected }"
                  >
                    <td class="py-2.5 px-3 text-center">
                      <input
                        type="checkbox"
                        v-model="t.selected"
                        class="cursor-pointer rounded border-slate-300"
                      />
                    </td>
                    <td class="py-2.5 px-3 text-center font-mono text-slate-500">{{ index + 1 }}</td>
                    <td class="py-2.5 px-3">
                      <!-- Yellow badge matching screenshot 4 -->
                      <span class="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        {{ t.group }}
                      </span>
                    </td>
                    <td class="py-2.5 px-3 font-mono text-slate-600">{{ t.adminCode }}</td>
                    <td class="py-2.5 px-3 font-bold text-slate-800">{{ t.teacherName }}</td>
                    <td class="py-2.5 px-3 text-slate-500">{{ t.classNonGrade || '-' }}</td>
                    <td class="py-2.5 px-3 text-slate-500">{{ t.teachGrade || '-' }}</td>
                    <td class="py-2.5 px-3 text-slate-500">{{ t.teachClass || '-' }}</td>
                    <td class="py-2.5 px-3 font-mono text-slate-600">{{ t.email || '-' }}</td>
                    <td class="py-2.5 px-3 text-center font-mono text-slate-500">{{ t.expiryDate }}</td>
                    <td class="py-2.5 px-3 text-center">
                      <div class="inline-flex items-center gap-2">
                        <button
                          type="button"
                          @click="editTeacher(t)"
                          class="text-[#52796f] hover:underline font-bold cursor-pointer"
                        >
                          編輯
                        </button>
                        <span class="text-slate-300">|</span>
                        <button
                          type="button"
                          @click="resetTeacherPw(t.teacherName)"
                          class="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer flex items-center gap-0.5"
                          title="重設密碼為 saaa.ntcu"
                        >
                          <span>重設密碼</span>
                          <span class="text-[10px] text-slate-400">?</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- SUB-TAB 2: 新增帳號 (Screenshot 3)             -->
        <!-- ============================================== -->
        <div v-else-if="teacherSubTab === 'create'" class="max-w-2xl mx-auto py-2">
          <div class="border border-slate-200/90 rounded-2xl p-5 sm:p-7 bg-white shadow-2xs">
            <h4 class="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">新增帳號</h4>

            <form @submit.prevent="handleCreateTeacher" class="space-y-4 text-xs">
              <!-- 權限管理 * -->
              <div>
                <label class="block font-semibold text-slate-700 mb-1.5">
                  權限管理 <span class="text-rose-500">*</span>
                </label>
                <div class="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      v-model="createForm.permission"
                      value="班級導師"
                      class="text-[#52796f] focus:ring-[#52796f]"
                    />
                    <span>班級導師 (由班級導師使用)</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      v-model="createForm.permission"
                      value="科任教師"
                      class="text-[#52796f] focus:ring-[#52796f]"
                    />
                    <span>科任教師 (由科任教師使用)</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      v-model="createForm.permission"
                      value="授課教師"
                      class="text-[#52796f] focus:ring-[#52796f]"
                    />
                    <span>授課教師 (由班級導師兼具科任教師使用)</span>
                  </label>
                </div>
              </div>

              <!-- 教師姓名 & 使用者名稱 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">
                    教師姓名 <span class="text-rose-500">*</span>
                  </label>
                  <input
                    v-model="createForm.teacherName"
                    type="text"
                    required
                    class="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] focus:ring-1 focus:ring-[#52796f]"
                  />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">
                    使用者名稱 <span class="text-rose-500">*</span>
                  </label>
                  <input
                    v-model="createForm.username"
                    type="text"
                    required
                    class="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] focus:ring-1 focus:ring-[#52796f]"
                  />
                </div>
              </div>

              <!-- 電子郵件信箱 -->
              <div>
                <label class="block font-semibold text-slate-700 mb-1">
                  電子郵件信箱 <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="createForm.email"
                  type="email"
                  required
                  class="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] focus:ring-1 focus:ring-[#52796f]"
                />
              </div>

              <!-- 帳號有效起日 & 迄日 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">
                    帳號有效起日 <span class="text-rose-500">*</span>
                  </label>
                  <input
                    v-model="createForm.startDate"
                    type="date"
                    required
                    class="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] focus:ring-1 focus:ring-[#52796f] cursor-pointer"
                  />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">
                    帳號有效迄日 <span class="text-rose-500">*</span>
                  </label>
                  <input
                    v-model="createForm.endDate"
                    type="date"
                    required
                    class="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] focus:ring-1 focus:ring-[#52796f] cursor-pointer"
                  />
                </div>
              </div>

              <!-- Submit button -->
              <div class="pt-3 text-right">
                <button
                  type="submit"
                  class="px-5 py-2.5 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer active:scale-95"
                >
                  新增帳號
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- SUB-TAB 3: 批次新增帳號 (Screenshot 2)         -->
        <!-- ============================================== -->
        <div v-else-if="teacherSubTab === 'batch'" class="max-w-2xl mx-auto py-2">
          <div class="border border-slate-200/90 rounded-2xl p-5 sm:p-7 bg-white shadow-2xs space-y-4">
            <div>
              <h4 class="text-sm font-bold text-slate-800 m-0">批次匯入帳號</h4>
              <p class="text-xs text-slate-500 mt-1 mb-0">請上傳 Excel 檔案（*.xls 或 *.xlsx）</p>
            </div>

            <!-- Download Template Amber Banner (Screenshot 2) -->
            <div
              @click="downloadTemplate"
              class="w-full p-3 bg-amber-50/70 border border-amber-300/80 rounded-xl text-center text-xs font-bold text-[#52796f] hover:text-[#354f52] hover:bg-amber-100/70 transition cursor-pointer flex items-center justify-center gap-2 select-none"
            >
              <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>下載空白範例檔案</span>
            </div>

            <!-- File Select Input & Upload Button -->
            <div class="flex items-center gap-2">
              <label class="flex-1 flex items-center border border-slate-300 rounded-lg overflow-hidden h-10 bg-white cursor-pointer hover:border-slate-400">
                <span class="px-3.5 bg-slate-100 border-r border-slate-300 text-xs font-bold text-slate-700 h-full flex items-center shrink-0">
                  選擇檔案
                </span>
                <span class="px-3 text-xs text-slate-500 truncate">
                  {{ selectedFileName || '未選擇任何檔案' }}
                </span>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  @change="handleFileChange"
                  class="hidden"
                />
              </label>

              <button
                type="button"
                @click="uploadBatch"
                class="h-10 px-6 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer active:scale-95 shrink-0"
              >
                上傳
              </button>
            </div>

            <!-- Scrollable Instructions Box (Screenshot 2) -->
            <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/60 max-h-56 overflow-y-auto text-xs text-slate-600 space-y-2 leading-relaxed">
              <p class="font-bold text-slate-800 m-0">
                註：新增帳號後，系統會自動發送密碼通知信 (<span class="text-rose-600">請務必填寫有效的電子信箱</span>)。
              </p>
              <p class="font-bold text-slate-700 m-0 pt-1">
                ※ 批次匯入注意事項及填寫範例：
              </p>
              <div class="space-y-1.5 pl-1 text-[11px] text-slate-600">
                <p class="m-0">
                  <span class="font-bold text-slate-800">1. 班級導師：</span>僅有班級身分，未教授其它班級之教師。<br />
                  <span class="text-slate-500">範例：三年 1 班 (勿填三年甲 / 忠班) 導師，年級輸入 3，班級輸入 1；四年 2 / 乙 / 孝班導師，年級輸入 4，班級輸入 2。</span>
                </p>
                <p class="m-0">
                  <span class="font-bold text-slate-800">2. 科任教師：</span>未擔任班導，僅教授特定學科之教師。<br />
                  <span class="text-slate-500">範例：國語文科任教師同時教授三年 2 班、四年 1 班，預設「授課教師設定」填寫科目與年級。</span>
                </p>
                <p class="m-0">
                  <span class="font-bold text-slate-800">3. 授課教師：</span>兼任導師身分，亦教授其它班級特定學科之教師。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 2: 缺考名單下載 (上一版表格版)        -->
    <!-- ========================================== -->
    <div v-else-if="mainTab === 'absentee'" class="border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs bg-white">
      <!-- Card Header -->
      <div class="bg-slate-50/70 border-b border-slate-200/80 py-3 text-center">
        <h3 class="text-sm md:text-base font-bold text-slate-800 m-0 tracking-wider">
          缺考名單下載
        </h3>
      </div>

      <div class="p-4 sm:p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-3 pb-2">
          <div class="text-xs text-slate-500 font-medium">
            115學年度施測缺考學生名冊，可匯出提供下載存檔使用。
          </div>
          <button
            type="button"
            @click="exportAbsentee"
            class="px-4 py-2 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            匯出缺考學生清冊 (Excel)
          </button>
        </div>

        <!-- Absentee Table -->
        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
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

// Teacher Sub-Tab: 'list' (校內帳號總表), 'create' (新增帳號), 'batch' (批次新增帳號)
const teacherSubTab = ref(route.query.sub || 'list')

// Watch query changes from Header dropdown clicks
watch(() => route.query.tab, (newTab) => {
  if (newTab === 'absentee') {
    mainTab.value = 'absentee'
  } else if (newTab === 'teachers') {
    mainTab.value = 'teachers'
  }
})

watch(() => route.query.sub, (newSub) => {
  if (['list', 'create', 'batch'].includes(newSub)) {
    teacherSubTab.value = newSub
  }
})

function switchMainTab(tab) {
  mainTab.value = tab
  router.replace({ query: { ...route.query, tab } })
}

// Year selector
const selectedYear = ref('115')

// ==========================================
// 1. 校內帳號總表 (Screenshot 4)
// ==========================================
const searchKeyword = ref('')
const selectAll = ref(false)

const teacherAccounts = ref([
  {
    id: 1,
    selected: false,
    group: '教師',
    adminCode: 'PAdmin_054628',
    teacherName: `${state.school}_校長`,
    classNonGrade: '',
    teachGrade: '',
    teachClass: '',
    email: 'principal@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 2,
    selected: false,
    group: '1年級學年主任',
    adminCode: 'DAdmin_044628',
    teacherName: `${state.school}_年主任_1`,
    classNonGrade: '',
    teachGrade: '1',
    teachClass: '全年級',
    email: 'grade1@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 3,
    selected: false,
    group: '2年級學年主任',
    adminCode: 'DAdmin_054628',
    teacherName: `${state.school}_年主任_2`,
    classNonGrade: '',
    teachGrade: '2',
    teachClass: '全年級',
    email: 'grade2@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 4,
    selected: false,
    group: '3年級學年主任',
    adminCode: 'DAdmin_044628',
    teacherName: `${state.school}_年主任_3`,
    classNonGrade: '',
    teachGrade: '3',
    teachClass: '全年級',
    email: 'grade3@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 5,
    selected: false,
    group: '4年級學年主任',
    adminCode: 'DAdmin_054628',
    teacherName: `${state.school}_年主任_4`,
    classNonGrade: '',
    teachGrade: '4',
    teachClass: '全年級',
    email: 'grade4@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 6,
    selected: false,
    group: '5年級學年主任',
    adminCode: 'DAdmin_054628',
    teacherName: `${state.school}_年主任_5`,
    classNonGrade: '',
    teachGrade: '5',
    teachClass: '全年級',
    email: 'grade5@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 7,
    selected: false,
    group: '6年級學年主任',
    adminCode: 'DAdmin_044628',
    teacherName: `${state.school}_年主任_6`,
    classNonGrade: '',
    teachGrade: '6',
    teachClass: '全年級',
    email: 'grade6@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  }
])

const filteredTeacherAccounts = computed(() => {
  if (!searchKeyword.value.trim()) return teacherAccounts.value
  const kw = searchKeyword.value.trim().toLowerCase()
  return teacherAccounts.value.filter(t =>
    t.group.toLowerCase().includes(kw) ||
    t.adminCode.toLowerCase().includes(kw) ||
    t.teacherName.toLowerCase().includes(kw) ||
    t.email.toLowerCase().includes(kw)
  )
})

const selectedCount = computed(() => {
  return teacherAccounts.value.filter(t => t.selected).length
})

function handleSelectAll() {
  teacherAccounts.value.forEach(t => {
    t.selected = selectAll.value
  })
}

function editTeacher(t) {
  ElMessage.info(`正在編輯【${t.teacherName}】帳號資訊`)
}

function resetTeacherPw(name) {
  ElMessage.success(`已重設【${name}】教師密碼為預設值：saaa.ntcu`)
}

function exportTeacherList() {
  ElMessage.success('已開始匯出全校教師帳號總表 EXCEL')
}

// ==========================================
// 2. 新增帳號 (Screenshot 3)
// ==========================================
const createForm = reactive({
  permission: '班級導師',
  teacherName: '',
  username: '',
  email: '',
  startDate: '2026-10-06',
  endDate: '2027-10-06'
})

function handleCreateTeacher() {
  if (!createForm.teacherName || !createForm.username || !createForm.email) {
    ElMessage.warning('請完整填寫必填欄位')
    return
  }

  teacherAccounts.value.push({
    id: Date.now(),
    selected: false,
    group: createForm.permission,
    adminCode: `TAdmin_${Math.floor(100000 + Math.random() * 900000)}`,
    teacherName: createForm.teacherName,
    classNonGrade: '',
    teachGrade: '',
    teachClass: '',
    email: createForm.email,
    expiryDate: createForm.endDate.replace(/-/g, '/')
  })

  ElMessage.success(`成功建立教師帳號：${createForm.teacherName}（${createForm.username}）`)
  teacherSubTab.value = 'list'
}

// ==========================================
// 3. 批次新增帳號 (Screenshot 2)
// ==========================================
const selectedFileName = ref('')

function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (file) {
    selectedFileName.value = file.name
  }
}

function downloadTemplate() {
  ElMessage.success('已開始下載空白教師匯入範例檔案 (teacher_import_template.xlsx)')
}

function uploadBatch() {
  if (!selectedFileName.value) {
    ElMessage.warning('請先選擇要上傳的 Excel 檔案！')
    return
  }
  ElMessage.success(`檔案【${selectedFileName.value}】批次解析完成，已建立帳號並發送密碼通知信！`)
  selectedFileName.value = ''
  teacherSubTab.value = 'list'
}

// ==========================================
// 4. 缺考名單下載 (上一版表格版)
// ==========================================
const absenteeList = ref([
  { id: 1, class: '五年1班', seatNo: '07', name: '林○宇', subject: '數學' },
  { id: 2, class: '五年2班', seatNo: '15', name: '張○萱', subject: '英語文' },
  { id: 3, class: '六年1班', seatNo: '22', name: '陳○翔', subject: '國語文' }
])

function exportAbsentee() {
  ElMessage.success('已開始匯出全校缺考學生清冊 (Excel)')
}
</script>
