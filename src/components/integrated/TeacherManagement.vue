<template>
  <div>
<!-- VIEW 1: 教師帳號管理 (新舊融合旗艦版)       -->
    <!-- ========================================== -->
    <div class="space-y-4">
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between flex-wrap gap-3 pb-1">
        <div class="text-xs text-slate-500 font-medium">
          {{ teacherFilters.year }} 年度教師登入權限、身分群組與授課配置，支援即時篩選、彈窗新增與批次匯出。
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            @click="openCreateTeacherModal"
            class="px-3.5 py-2 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            新增教師
          </button>
          <button
            type="button"
            @click="openBatchImportModal"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            批次匯入 (Excel)
          </button>
          <button
            type="button"
            @click="exportTeacherList"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            匯出總表 (Excel)
          </button>
        </div>
      </div>

      <!-- Filter Bar (與缺考名單一致的現代卡片式篩選) -->
      <div class="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <!-- 年度 -->
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">年度</label>
            <select
              v-model="teacherFilters.year"
              @change="handleTeacherFilterChange"
              class="w-full h-9 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] cursor-pointer"
            >
              <option value="115">115 年度</option>
              <option value="114">114 年度</option>
              <option value="113">113 年度</option>
            </select>
          </div>

          <!-- 組別身分 -->
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">組別身分</label>
            <select
              v-model="teacherFilters.role"
              @change="handleTeacherFilterChange"
              class="w-full h-9 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] cursor-pointer"
            >
              <option value="all">全部身分</option>
              <option value="校長">校長</option>
              <option value="學年主任">學年主任</option>
              <option value="班級導師">班級導師</option>
              <option value="科任教師">科任教師</option>
              <option value="授課教師">授課教師</option>
            </select>
          </div>

          <!-- 帳號狀態 -->
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">帳號狀態</label>
            <select
              v-model="teacherFilters.status"
              @change="handleTeacherFilterChange"
              class="w-full h-9 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] cursor-pointer"
            >
              <option value="all">全部狀態</option>
              <option value="active">啟用中</option>
              <option value="inactive">已停用</option>
            </select>
          </div>

          <!-- 授課年級 -->
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">授課年級</label>
            <select
              v-model="teacherFilters.grade"
              @change="handleTeacherFilterChange"
              class="w-full h-9 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] cursor-pointer"
            >
              <option value="all">全部年級</option>
              <option value="1">1 年級</option>
              <option value="2">2 年級</option>
              <option value="3">3 年級</option>
              <option value="4">4 年級</option>
              <option value="5">5 年級</option>
              <option value="6">6 年級</option>
            </select>
          </div>

          <!-- 關鍵字搜尋 & 重設 -->
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">快速搜尋</label>
            <div class="flex items-center gap-1.5">
              <input
                v-model="teacherFilters.keyword"
                @input="handleTeacherFilterChange"
                type="text"
                placeholder="搜尋：使用者名稱、姓名或信箱"
                class="w-full h-9 px-2.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f]"
              />
              <button
                type="button"
                @click="resetTeacherFilters"
                class="h-9 px-3 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition"
                title="清除所有條件"
              >
                重設
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Batch Selection Floating Toolbar -->
      <div
        v-if="selectedTeacherCount > 0"
        class="flex items-center justify-between p-2.5 sm:p-3 bg-[#edf2ee] border border-[#52796f]/30 rounded-xl text-xs text-[#2f3e46] transition-all flex-wrap gap-2"
      >
        <div class="flex items-center gap-2 font-medium">
          <span class="w-2 h-2 rounded-full bg-[#52796f]"></span>
          <span>已勾選 <strong class="text-[#354f52] font-bold">{{ selectedTeacherCount }}</strong> 位教師帳號</span>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            @click="exportSelectedTeachers"
            class="px-3 py-1.5 bg-[#52796f] hover:bg-[#354f52] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            匯出所選教師 (Excel)
          </button>
          <button
            type="button"
            @click="batchEnableTeachers"
            class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            批次啟用
          </button>
          <button
            type="button"
            @click="batchDisableTeachers"
            class="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            批次停用
          </button>
          <button
            type="button"
            @click="batchResetTeacherPw"
            class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95"
          >
            批次重設密碼
          </button>
          <button
            type="button"
            @click="cancelSelectAll"
            class="px-2 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
          >
            取消選取
          </button>
        </div>
      </div>

      <!-- Integrated Teacher Table -->
      <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th class="py-3 px-3 text-center w-12">
                  <input
                    type="checkbox"
                    v-model="isAllTeachersSelected"
                    class="cursor-pointer rounded border-slate-300"
                    title="全選/取消全選"
                  />
                </th>
                <th class="py-3 px-2 text-center w-10">No.</th>
                <th class="py-3 px-3 text-center w-16">年度</th>
                <th class="py-3 px-4">使用者名稱</th>
                <th class="py-3 px-4">教師姓名</th>
                <th class="py-3 px-4">組別身分</th>
                <th class="py-3 px-4">任教年級 / 班級</th>
                <th class="py-3 px-4">電子郵件信箱</th>
                <th class="py-3 px-4 text-center">帳號狀態</th>
                <th class="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              <tr
                v-for="(t, index) in paginatedTeacherList"
                :key="t.id"
                class="hover:bg-slate-50/70 transition"
                :class="{
                  'bg-emerald-50/20': t.selected,
                  'bg-slate-50/60 text-slate-500': !t.isActive && !t.selected
                }"
              >
                <!-- Checkbox -->
                <td class="py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    v-model="t.selected"
                    class="cursor-pointer rounded border-slate-300"
                  />
                </td>
                
                <!-- No. -->
                <td class="py-3 px-2 text-center font-mono text-slate-400">
                  {{ (teacherCurrentPage - 1) * teacherPageSize + index + 1 }}
                </td>

                <!-- 年度 -->
                <td class="py-3 px-3 text-center font-mono font-bold text-slate-700">
                  {{ t.year || teacherFilters.year }}
                </td>

                <!-- 使用者名稱 -->
                <td class="py-3 px-4 font-mono font-bold" :class="t.isActive ? 'text-[#52796f]' : 'text-slate-500'">
                  <div class="flex items-center gap-1.5">
                    <span>{{ t.username || t.adminCode }}</span>
                    <span
                      v-if="!t.isActive"
                      class="px-1.5 py-0.2 rounded text-[10px] font-sans font-bold bg-slate-200 text-slate-600"
                      title="帳號目前為停用狀態"
                    >
                      停用
                    </span>
                  </div>
                </td>

                <!-- 教師姓名 -->
                <td class="py-3 px-4 font-bold" :class="t.isActive ? 'text-slate-800' : 'text-slate-500'">
                  {{ t.name }}
                </td>

                <!-- 組別身分 -->
                <td class="py-3 px-4">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span
                      class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold"
                      :class="getRoleBadgeClass(t.role)"
                    >
                      {{ t.role }}
                    </span>
                    <span
                      v-if="t.role === '校長' || t.role === '學年主任'"
                      class="text-[10px] text-slate-400 font-medium"
                      title="系統預設管理帳號"
                    >
                      (系統預設)
                    </span>
                  </div>
                </td>

                <!-- 任教年級 / 班級 (校長與學年主任依規範留空) -->
                <td class="py-3 px-4">
                  <div class="font-medium" :class="t.isActive ? 'text-slate-700' : 'text-slate-400'">
                    {{ (t.role === '校長' || t.role === '學年主任') ? '' : (t.assignedClass || '') }}
                  </div>
                </td>

                <!-- 電子郵件信箱 -->
                <td class="py-3 px-4 font-mono text-slate-600 text-[11px]">
                  <a :href="`mailto:${t.email}`" class="text-slate-600 hover:text-[#52796f] hover:underline no-underline">
                    {{ t.email }}
                  </a>
                </td>

                <!-- 帳號狀態 (Switch 啟用/停用) -->
                <td class="py-3 px-4 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <el-switch
                      v-model="t.isActive"
                      size="small"
                      active-color="#52796f"
                      inactive-color="#cbd5e1"
                      @change="(val) => handleToggleTeacherStatus(t, val)"
                    />
                    <span
                      class="inline-flex items-center gap-1 font-semibold text-[11px] select-none"
                      :class="t.isActive ? 'text-emerald-700' : 'text-red-600'"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="t.isActive ? 'bg-emerald-500' : 'bg-red-500'"></span>
                      {{ t.isActive ? '啟用中' : '已停用' }}
                    </span>
                  </div>
                </td>

                <!-- 操作 -->
                <td class="py-3 px-4 text-center">
                  <div class="inline-flex items-center gap-2">
                    <button
                      type="button"
                      @click="openEditTeacherModal(t)"
                      class="text-[#52796f] hover:text-[#354f52] font-semibold hover:underline cursor-pointer"
                    >
                      編輯
                    </button>
                    <span class="text-slate-300">|</span>
                    <button
                      type="button"
                      @click="resetTeacherPw(t.name)"
                      class="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                    >
                      重設密碼
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty state -->
              <tr v-if="filteredTeacherList.length === 0">
                <td colspan="10" class="py-12 text-center text-slate-400">
                  <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <span>查無符合篩選條件的教師帳號</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bottom Pagination & Counts -->
      <div class="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div class="text-xs text-slate-500 font-medium">
          全校教師共 <span class="font-bold text-slate-800">{{ allTeacherList.length }}</span> 位
          （啟用中：<span class="font-bold text-emerald-600">{{ activeTeacherCount }}</span> 位，已停用：<span class="font-bold text-red-600">{{ inactiveTeacherCount }}</span> 位）
          ，符合篩選條件：<span class="font-bold text-[#52796f]">{{ filteredTeacherList.length }}</span> 位
        </div>
        <el-pagination
          v-if="filteredTeacherList.length > teacherPageSize"
          v-model:current-page="teacherCurrentPage"
          :page-size="teacherPageSize"
          :total="filteredTeacherList.length"
          layout="prev, pager, next"
          background
          size="small"
        />
      </div>
    </div>

    
<!-- MODAL 1: 新增 / 編輯教師帳號 (新版雙頁籤極致 UX) -->
    <!-- ============================================== -->
    <el-dialog
      v-model="createDialogVisible"
      :title="isEditMode ? (teacherForm.role === '校長' || teacherForm.role === '學年主任' ? `編輯${teacherForm.role}帳號資訊 (系統預設)` : '編輯教師帳號與任課設定') : '新增校內教師帳號'"
      width="780px"
      append-to-body
      destroy-on-close
      class="rounded-2xl overflow-hidden"
    >
      <div class="space-y-4 text-xs">
        <!-- 頂部導覽列與子頁籤切換 (整合 Screenshot 2 & 3 麵包屑精神) -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-200 flex-wrap gap-2">
          <!-- 麵包屑導覽 -->
          <div class="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">校內名冊</span>
            <span>&gt;</span>
            <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold font-mono">115 年度</span>
            <span>&gt;</span>
            <span class="font-bold text-slate-800 truncate max-w-[140px]">{{ teacherForm.name || '新教師帳號' }}</span>
          </div>

          <!-- 子頁籤按鈕 (基本帳號資料 vs 班級任課設定) -->
          <div v-if="teacherForm.role !== '校長' && teacherForm.role !== '學年主任'" class="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
            <button
              type="button"
              @click="modalSubTab = 'basic'"
              class="px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer"
              :class="modalSubTab === 'basic' ? 'bg-white text-[#52796f] shadow-xs' : 'text-slate-600 hover:text-slate-800'"
            >
              📋 基本帳號資料
            </button>
            <button
              type="button"
              @click="modalSubTab = 'classes'"
              class="px-3 py-1 rounded-lg font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              :class="modalSubTab === 'classes' ? 'bg-white text-[#52796f] shadow-xs' : 'text-slate-600 hover:text-slate-800'"
            >
              <span>🏫 班級任課設定</span>
              <span
                v-if="teacherForm.role !== '班級導師'"
                class="px-1.5 py-0.2 rounded-full text-[10px] font-mono"
                :class="totalSelectedClassesCount > 0 ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-200 text-slate-600'"
              >
                {{ totalSelectedClassesCount }} 班
              </span>
            </button>
          </div>
        </div>

        <form @submit.prevent="saveTeacher" class="space-y-4">
          <!-- ============================================== -->
          <!-- SUB-TAB 1: 基本資料 (Screenshot 3 現代化升級)    -->
          <!-- ============================================== -->
          <div v-show="modalSubTab === 'basic'" class="space-y-4">
            <!-- 權限管理身分 -->
            <div>
              <label class="block font-bold text-slate-700 mb-1.5">
                權限身分 <span class="text-rose-500">*</span>
              </label>

              <!-- 系統預設帳號 (校長/學年主任) -->
              <div v-if="isEditMode && (teacherForm.role === '校長' || teacherForm.role === '學年主任')" class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold" :class="getRoleBadgeClass(teacherForm.role)">
                    {{ teacherForm.role }}
                  </span>
                  <span class="text-[11px] font-bold text-[#52796f]">【系統預設帳號】</span>
                </div>
                <p class="text-[11px] text-slate-500 m-0 leading-normal">
                  此帳號為系統依學校編制預設之管理帳號，無法變更身分權限，任教年級與班級依規範自動留空。
                </p>
              </div>

              <!-- 一般教師身分單選 (導師/科任/授課) -->
              <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <label
                  class="p-2.5 border rounded-xl cursor-pointer transition flex flex-col justify-between"
                  :class="teacherForm.role === '班級導師' ? 'border-[#52796f] bg-emerald-50/30 ring-1 ring-[#52796f]' : 'border-slate-200 bg-white hover:border-slate-300'"
                >
                  <div class="flex items-center gap-2 font-bold text-slate-800 mb-1">
                    <input type="radio" v-model="teacherForm.role" value="班級導師" class="text-[#52796f]" />
                    <span>班級導師</span>
                  </div>
                  <p class="text-[11px] text-slate-500 m-0 leading-tight">擔任單一班級導師，管轄本班所有測驗。</p>
                </label>

                <label
                  class="p-2.5 border rounded-xl cursor-pointer transition flex flex-col justify-between"
                  :class="teacherForm.role === '科任教師' ? 'border-[#52796f] bg-emerald-50/30 ring-1 ring-[#52796f]' : 'border-slate-200 bg-white hover:border-slate-300'"
                >
                  <div class="flex items-center gap-2 font-bold text-slate-800 mb-1">
                    <input type="radio" v-model="teacherForm.role" value="科任教師" class="text-[#52796f]" />
                    <span>科任教師</span>
                  </div>
                  <p class="text-[11px] text-slate-500 m-0 leading-tight">未擔任導師，專任跨班特定學科（如數學科任）。</p>
                </label>

                <label
                  class="p-2.5 border rounded-xl cursor-pointer transition flex flex-col justify-between"
                  :class="teacherForm.role === '授課教師' ? 'border-[#52796f] bg-emerald-50/30 ring-1 ring-[#52796f]' : 'border-slate-200 bg-white hover:border-slate-300'"
                >
                  <div class="flex items-center gap-2 font-bold text-slate-800 mb-1">
                    <input type="radio" v-model="teacherForm.role" value="授課教師" class="text-[#52796f]" />
                    <span>授課教師</span>
                  </div>
                  <p class="text-[11px] text-slate-500 m-0 leading-tight">兼任班級導師，同時教授其他班級特定學科。</p>
                </label>
              </div>
            </div>

            <!-- 教師姓名 & 使用者名稱 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">
                  教師姓名 <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="teacherForm.name"
                  type="text"
                  required
                  placeholder="例：陳志豪"
                  class="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f]"
                />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">
                  使用者名稱 (登入管理專用碼) <span class="text-rose-500">*</span>
                </label>
                <input
                  v-model="teacherForm.username"
                  type="text"
                  required
                  placeholder="例：TAdmin_301001"
                  class="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] font-mono"
                />
              </div>
            </div>

            <!-- 電子郵件信箱 -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">
                電子郵件信箱 <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="teacherForm.email"
                type="email"
                required
                placeholder="例：teacher@school.edu.tw"
                class="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f]"
              />
              <p class="text-[11px] text-slate-400 mt-1 m-0">新增或重設後，系統會自動發送通知信至此信箱。</p>
            </div>


            <!-- 帳號啟用狀態 -->
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <label class="block font-bold text-slate-700 mb-0.5">帳號啟用狀態</label>
                <p class="text-[11px] text-slate-400 m-0">停用後教師帳號將暫時無法登入系統使用各專區功能</p>
              </div>
              <div class="flex items-center gap-2">
                <el-switch
                  v-model="teacherForm.isActive"
                  active-color="#52796f"
                  inactive-color="#cbd5e1"
                />
                <span
                  class="text-xs font-bold whitespace-nowrap select-none"
                  :class="teacherForm.isActive ? 'text-emerald-700' : 'text-red-600'"
                >
                  {{ teacherForm.isActive ? '● 啟用中' : '● 已停用' }}
                </span>
              </div>
            </div>

            <!-- 導師班級設定 (針對班級導師、授課教師) -->
            <div v-if="teacherForm.role === '班級導師' || teacherForm.role === '授課教師'" class="p-3 bg-sky-50/60 border border-sky-200 rounded-xl space-y-2">
              <label class="block font-bold text-sky-900">
                🏫 班級導師所屬班級設定
              </label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] text-slate-600 mb-1 font-semibold">擔任年級</label>
                  <select
                    v-model="teacherForm.homeroomGrade"
                    class="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f]"
                  >
                    <option value="1">1 年級</option>
                    <option value="2">2 年級</option>
                    <option value="3">3 年級</option>
                    <option value="4">4 年級</option>
                    <option value="5">5 年級</option>
                    <option value="6">6 年級</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] text-slate-600 mb-1 font-semibold">擔任班級別</label>
                  <select
                    v-model="teacherForm.homeroomClass"
                    class="w-full h-9 px-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f]"
                  >
                    <option value="1">1 班</option>
                    <option value="2">2 班</option>
                    <option value="3">3 班</option>
                    <option value="4">4 班</option>
                    <option value="5">5 班</option>
                    <option value="6">6 班</option>
                    <option value="7">7 班</option>
                    <option value="8">8 班</option>
                  </select>
                </div>
              </div>
              <p class="text-[11px] text-sky-700 m-0">
                目前配置為：<strong>{{ teacherForm.homeroomGrade }} 年 {{ teacherForm.homeroomClass }} 班</strong> 導師（免設科任跨班矩陣）。
              </p>
            </div>

            <!-- 科任 / 授課教師快捷引導卡片 -->
            <div v-if="teacherForm.role === '科任教師' || teacherForm.role === '授課教師'" class="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2.5">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <label class="block font-bold text-[#354f52]">
                  📚 任課科目與班級配置
                </label>
                <button
                  type="button"
                  @click="modalSubTab = 'classes'"
                  class="px-3 py-1 bg-[#52796f] hover:bg-[#354f52] text-white text-[11px] font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  前往詳細班級矩陣設定 (已選 {{ totalSelectedClassesCount }} 班) &rarr;
                </button>
              </div>
              <div class="flex items-center gap-4 text-xs font-medium text-slate-700 flex-wrap">
                <span>任課科目：</span>
                <label v-for="sub in availableSubjects" :key="sub" class="inline-flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    :value="sub"
                    v-model="teacherForm.selectedSubjects"
                    class="rounded text-[#52796f]"
                  />
                  <span>{{ sub }}</span>
                </label>
              </div>
              <div class="text-[11px] text-slate-500 flex items-center gap-3 flex-wrap">
                <span>目前配置摘要：</span>
                <span v-for="sub in availableSubjects" :key="sub" class="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                  {{ sub }}: <strong>{{ (teacherForm.classMatrix[sub] || []).length }}</strong> 班
                </span>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- SUB-TAB 2: 任課班級設定 (Screenshot 2 現代化升級) -->
          <!-- ============================================== -->
          <div v-show="modalSubTab === 'classes'" class="space-y-3.5">
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 class="font-bold text-slate-800 text-xs m-0">班級任課設定 (請依科目勾選教師可管轄之班級)</h4>
                <p class="text-[11px] text-slate-500 m-0 mt-0.5">點選班級膠囊即可加入或移除，支援年級一鍵全選及跨科配置複製。</p>
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  @click="copySubjectClasses(activeClassSubject, activeClassSubject === '國語文' ? '數學' : '國語文')"
                  class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                  title="將目前科目選中的班級複製到其他科目"
                >
                  複製此配置至其他科目
                </button>
              </div>
            </div>

            <!-- 科目切換膠囊 (國語文 / 數學 / 英語文) -->
            <div class="flex items-center gap-2 pb-1 border-b border-slate-200">
              <button
                v-for="sub in availableSubjects"
                :key="sub"
                type="button"
                @click="activeClassSubject = sub"
                class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                :class="activeClassSubject === sub ? 'bg-[#52796f] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'"
              >
                <span>{{ sub }}</span>
                <span
                  class="px-1.5 py-0.2 rounded-full text-[10px] font-mono"
                  :class="activeClassSubject === sub ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'"
                >
                  {{ (teacherForm.classMatrix[sub] || []).length }} 班
                </span>
              </button>
            </div>

            <!-- 班級矩陣選擇區 (現代化膠囊按鈕代替密密麻麻小 Checkbox) -->
            <div class="border border-slate-200 rounded-xl p-3 bg-white space-y-2.5 max-h-64 overflow-y-auto">
              <div
                v-for="gItem in gradeClassStructure"
                :key="gItem.grade"
                class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50/80 transition border border-slate-100"
              >
                <!-- 年級標籤與全選切換 -->
                <div class="w-24 shrink-0 flex items-center gap-1.5">
                  <span class="font-bold text-slate-700 text-xs">{{ gItem.label }}</span>
                  <button
                    type="button"
                    @click="toggleGradeAll(activeClassSubject, gItem)"
                    class="px-1.5 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer"
                    :class="isGradeAllSelected(activeClassSubject, gItem) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                  >
                    {{ isGradeAllSelected(activeClassSubject, gItem) ? '已全選' : '全選' }}
                  </button>
                </div>

                <!-- 班級按鈕膠囊 (Pills) -->
                <div class="flex items-center gap-1.5 flex-wrap flex-1">
                  <button
                    v-for="cCode in gItem.classes"
                    :key="cCode"
                    type="button"
                    @click="toggleClassSelection(activeClassSubject, cCode)"
                    class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer select-none"
                    :class="isClassSelected(activeClassSubject, cCode)
                      ? 'bg-[#52796f] text-white shadow-2xs scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/70'"
                  >
                    {{ cCode }}
                    <span v-if="isClassSelected(activeClassSubject, cCode)" class="ml-0.5 text-[10px]">✓</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 即時任課配置摘要看板 (Live Allocation Summary) -->
            <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-slate-700">目前【{{ activeClassSubject }}】配置：</span>
                <span v-if="(teacherForm.classMatrix[activeClassSubject] || []).length === 0" class="text-slate-400">尚未勾選班級</span>
                <div v-else class="flex items-center gap-1 flex-wrap">
                  <span
                    v-for="c in teacherForm.classMatrix[activeClassSubject]"
                    :key="c"
                    class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold"
                  >
                    {{ c }}
                  </span>
                </div>
              </div>
              <div class="font-bold text-slate-700 shrink-0">
                跨科總計：<strong class="text-[#52796f] font-mono text-sm">{{ totalSelectedClassesCount }}</strong> 班次
              </div>
            </div>
          </div>

          <!-- 底部控制按鈕 (單一統一儲存，防止分開存檔漏失) -->
          <div class="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
            <div>
              <button
                v-if="modalSubTab === 'classes'"
                type="button"
                @click="modalSubTab = 'basic'"
                class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                &larr; 返回基本資料
              </button>
              <button
                v-else-if="teacherForm.role === '科任教師' || teacherForm.role === '授課教師'"
                type="button"
                @click="modalSubTab = 'classes'"
                class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#52796f] text-xs font-bold rounded-lg transition cursor-pointer"
              >
                前往班級任課設定 &rarr;
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="createDialogVisible = false"
                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-5 py-2 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ isEditMode ? '儲存變更' : '確認新增' }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </el-dialog>

    <!-- ============================================== -->
    <!-- MODAL 2: 批次新增帳號 (保留舊版範例與規範)       -->
    <!-- ============================================== -->
    <el-dialog
      v-model="batchDialogVisible"
      title="批次匯入教師帳號"
      width="580px"
      append-to-body
      destroy-on-close
      class="rounded-2xl overflow-hidden"
    >
      <div class="space-y-4 text-xs">
        <p class="text-xs text-slate-600 m-0">
          請先下載標準格式範例檔案，編輯完成後上傳 Excel 檔案（*.xls 或 *.xlsx）。
        </p>

        <!-- Download Template Amber Banner (Screenshot 2) -->
        <div
          @click="downloadTemplate"
          class="w-full p-3 bg-amber-50/80 border border-amber-300 rounded-xl text-center text-xs font-bold text-[#52796f] hover:text-[#354f52] hover:bg-amber-100/70 transition cursor-pointer flex items-center justify-center gap-2 select-none shadow-2xs"
        >
          <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>下載空白教師匯入範例檔案 (teacher_import_template.xlsx)</span>
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
            class="h-10 px-5 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer active:scale-95 shrink-0"
          >
            上傳匯入
          </button>
        </div>

        <!-- Instructions Box (Screenshot 2 authentic guide) -->
        <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/70 max-h-48 overflow-y-auto text-xs text-slate-600 space-y-2 leading-relaxed">
          <p class="font-bold text-slate-800 m-0">
            註：新增帳號後，系統會自動發送密碼通知信 (<span class="text-rose-600">請務必填寫有效的電子信箱</span>)。
          </p>
          <p class="font-bold text-slate-700 m-0 pt-0.5">
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
    </el-dialog>

  
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuth } from '../../composables/useAuth'
import { teacherService } from '../../services/teacherService'
import { usePagination } from '../../composables/usePagination'

const { state } = useAuth()

// 1. 教師帳號管理 (新舊融合旗艦版)
// ==========================================
const teacherFilters = reactive({
  year: '115',
  role: 'all',
  grade: 'all',
  status: 'all', // 'all' | 'active' | 'inactive'
  keyword: ''
})

const allTeacherList = ref([])

async function loadTeacherList() {
  const res = await teacherService.getTeachers()
  if (res.success) {
    allTeacherList.value = res.data.map(t => ({
      ...t,
      selected: false
    }))
  }
}

onMounted(() => {
  loadTeacherList()
})

// 角色徽章顏色輔助樣式
function getRoleBadgeClass(role) {
  if (role === '校長') return 'bg-slate-100 text-slate-700 border border-slate-300'
  if (role === '學年主任') return 'bg-amber-50 text-amber-800 border border-amber-200'
  if (role === '班級導師') return 'bg-sky-50 text-sky-800 border border-sky-200'
  if (role === '科任教師') return 'bg-emerald-50 text-emerald-800 border border-emerald-200'
  if (role === '授課教師') return 'bg-indigo-50 text-indigo-800 border border-indigo-200'
  return 'bg-slate-100 text-slate-700 border border-slate-200'
}

// 篩選後名單
const filteredTeacherList = computed(() => {
  return allTeacherList.value.filter(t => {
    // 年度篩選
    if (teacherFilters.year && t.year && t.year !== teacherFilters.year) {
      return false
    }
    // 身分群組篩選
    if (teacherFilters.role !== 'all' && t.role !== teacherFilters.role) {
      return false
    }
    // 帳號狀態篩選
    if (teacherFilters.status !== 'all') {
      const wantActive = teacherFilters.status === 'active'
      if (t.isActive !== wantActive) return false
    }
    // 授課年級篩選
    if (teacherFilters.grade !== 'all') {
      if (!t.grade || String(t.grade) !== String(teacherFilters.grade)) {
        return false
      }
    }
    // 關鍵字搜尋 (使用者名稱、教師姓名、信箱)
    if (teacherFilters.keyword.trim()) {
      const kw = teacherFilters.keyword.trim().toLowerCase()
      const matchUsername = (t.username || t.adminCode || '').toLowerCase().includes(kw)
      const matchName = (t.name || '').toLowerCase().includes(kw)
      const matchEmail = (t.email || '').toLowerCase().includes(kw)
      if (!matchUsername && !matchName && !matchEmail) {
        return false
      }
    }
    return true
  })
})

// 分頁 Composable
const {
  currentPage: teacherCurrentPage,
  pageSize: teacherPageSize,
  paginatedItems: paginatedTeacherList,
  resetPage: resetTeacherPage
} = usePagination(filteredTeacherList, { initialPageSize: 8 })

function handleTeacherFilterChange() {
  resetTeacherPage()
}

function resetTeacherFilters() {
  teacherFilters.year = '115'
  teacherFilters.role = 'all'
  teacherFilters.grade = 'all'
  teacherFilters.status = 'all'
  teacherFilters.keyword = ''
  resetTeacherPage()
  ElMessage.info('已重設教師篩選條件')
}

// 勾選批次控制
const selectedTeacherCount = computed(() => {
  return allTeacherList.value.filter(t => t.selected).length
})

const activeTeacherCount = computed(() => {
  return allTeacherList.value.filter(t => t.isActive).length
})

const inactiveTeacherCount = computed(() => {
  return allTeacherList.value.filter(t => !t.isActive).length
})

// 個別切換教師帳號啟用/停用
async function handleToggleTeacherStatus(t, val) {
  await teacherService.updateTeacher(t.id, { isActive: val })
  if (val) {
    ElMessage.success(`已啟用教師【${t.name}】之帳號權限`)
  } else {
    ElMessage.warning(`已停用教師【${t.name}】之帳號（該教師將暫時無法登入）`)
  }
}

// 批次啟用
async function batchEnableTeachers() {
  const selected = allTeacherList.value.filter(t => t.selected)
  if (selected.length === 0) return
  const ids = selected.map(t => t.id)
  await teacherService.batchUpdateStatus(ids, true)
  selected.forEach(t => { t.isActive = true })
  ElMessage.success(`已批次啟用所選 ${selected.length} 位教師之帳號權限`)
}

// 批次停用
async function batchDisableTeachers() {
  const selected = allTeacherList.value.filter(t => t.selected)
  if (selected.length === 0) return
  const ids = selected.map(t => t.id)
  await teacherService.batchUpdateStatus(ids, false)
  selected.forEach(t => { t.isActive = false })
  ElMessage.warning(`已批次停用所選 ${selected.length} 位教師帳號（將暫時無法登入）`)
}

const isAllTeachersSelected = computed({
  get() {
    return filteredTeacherList.value.length > 0 && filteredTeacherList.value.every(t => t.selected)
  },
  set(val) {
    filteredTeacherList.value.forEach(t => {
      t.selected = val
    })
  }
})

function cancelSelectAll() {
  allTeacherList.value.forEach(t => {
    t.selected = false
  })
}

function exportTeacherList() {
  ElMessage.success(`已開始匯出【${allTeacherList.value.length} 位校內教師總表】EXCEL 檔案`)
}

function exportSelectedTeachers() {
  const selected = allTeacherList.value.filter(t => t.selected)
  ElMessage.success(`已開始匯出所選 ${selected.length} 位教師名冊 EXCEL 檔案`)
}

async function batchResetTeacherPw() {
  const selected = allTeacherList.value.filter(t => t.selected)
  const ids = selected.map(t => t.id)
  await teacherService.batchResetPassword(ids)
  ElMessage.success(`已重設所選 ${selected.length} 位教師密碼，並發送臨時密碼通知信！`)
}

// ==========================================
// 彈窗 1：新增 / 編輯教師帳號
// ==========================================
const createDialogVisible = ref(false)
const isEditMode = ref(false)
const currentEditingId = ref(null)

const modalActiveTab = ref('basic')

const teacherForm = reactive({
  role: '校長',
  directorGrade: '1',
  homeroomGrade: '3',
  homeroomClass: '1',
  name: '',
  username: '',
  email: '',
  isActive: true,
  teachingGrades: ['3', '4'],
  selectedSubjects: ['自然科學'],
  subjectMatrix: {
    '1': [],
    '2': [],
    '3': ['自然科學'],
    '4': ['自然科學'],
    '5': [],
    '6': []
  }
})

const totalSelectedClassesCount = computed(() => {
  let count = 0
  Object.keys(teacherForm.subjectMatrix).forEach(g => {
    count += teacherForm.subjectMatrix[g].length
  })
  return count
})

function switchModalTab(tab) {
  modalActiveTab.value = tab
}

function openCreateTeacherModal() {
  isEditMode.value = false
  currentEditingId.value = null
  modalActiveTab.value = 'basic'
  
  teacherForm.role = '班級導師'
  teacherForm.directorGrade = '3'
  teacherForm.homeroomGrade = '3'
  teacherForm.homeroomClass = '1'
  teacherForm.name = ''
  teacherForm.username = 'TAdmin_' + Math.floor(100000 + Math.random() * 900000)
  teacherForm.email = ''
  teacherForm.isActive = true
  teacherForm.teachingGrades = ['3']
  teacherForm.selectedSubjects = ['國語文']
  teacherForm.subjectMatrix = { '1': [], '2': [], '3': ['1班'], '4': [], '5': [], '6': [] }
  
  createDialogVisible.value = true
}

function openEditTeacherModal(t) {
  isEditMode.value = true
  currentEditingId.value = t.id
  modalActiveTab.value = 'basic'

  teacherForm.role = t.role || '校長'
  teacherForm.name = t.name || ''
  teacherForm.username = t.username || t.adminCode || ''
  teacherForm.email = t.email || ''
  teacherForm.isActive = t.isActive !== false

  if (t.role === '學年主任') {
    teacherForm.directorGrade = t.grade || '1'
  } else if (t.role === '班級導師') {
    teacherForm.homeroomGrade = t.grade || '3'
    teacherForm.homeroomClass = t.assignedClass ? t.assignedClass.replace(/[^0-9]/g, '') : '1'
  }

  createDialogVisible.value = true
}

function handleRoleChange() {
  if (teacherForm.role === '校長') {
    teacherForm.username = 'PAdmin_054628'
  } else if (teacherForm.role === '學年主任') {
    teacherForm.username = `DAdmin_${String(teacherForm.directorGrade).padStart(2, '0')}4628`
  } else if (teacherForm.role === '班級導師') {
    teacherForm.username = `TAdmin_${teacherForm.homeroomGrade}0${teacherForm.homeroomClass}001`
  } else if (teacherForm.role === '科任教師') {
    teacherForm.username = `SAdmin_${teacherForm.teachingGrades[0] || '3'}00001`
  }
}

function toggleTeachingGrade(g) {
  const idx = teacherForm.teachingGrades.indexOf(g)
  if (idx > -1) {
    if (teacherForm.teachingGrades.length > 1) {
      teacherForm.teachingGrades.splice(idx, 1)
      teacherForm.subjectMatrix[g] = []
    }
  } else {
    teacherForm.teachingGrades.push(g)
  }
}

function isMatrixClassChecked(grade, cls) {
  return (teacherForm.subjectMatrix[grade] || []).includes(cls)
}

function toggleMatrixClass(grade, cls) {
  if (!teacherForm.subjectMatrix[grade]) {
    teacherForm.subjectMatrix[grade] = []
  }
  const idx = teacherForm.subjectMatrix[grade].indexOf(cls)
  if (idx > -1) {
    teacherForm.subjectMatrix[grade].splice(idx, 1)
  } else {
    teacherForm.subjectMatrix[grade].push(cls)
  }
}

function selectAllClassesForGrade(grade) {
  teacherForm.subjectMatrix[grade] = ['1班', '2班', '3班', '4班', '5班']
}

function clearAllClassesForGrade(grade) {
  teacherForm.subjectMatrix[grade] = []
}

function toggleHomeroomSubject(sub) {
  const idx = teacherForm.selectedSubjects.indexOf(sub)
  if (idx > -1) {
    if (teacherForm.selectedSubjects.length > 1) {
      teacherForm.selectedSubjects.splice(idx, 1)
    }
  } else {
    teacherForm.selectedSubjects.push(sub)
  }
}

async function saveTeacher() {
  if (!teacherForm.name.trim()) {
    ElMessage.warning('請填寫教師姓名！')
    return
  }
  if (!teacherForm.username.trim()) {
    ElMessage.warning('請填寫登入使用者名稱！')
    return
  }

  let finalGrade = ''
  let finalAssignedClass = ''

  if (teacherForm.role === '校長') {
    finalGrade = ''
    finalAssignedClass = ''
  } else if (teacherForm.role === '學年主任') {
    finalGrade = teacherForm.directorGrade
    finalAssignedClass = ''
  } else if (teacherForm.role === '班級導師') {
    finalGrade = teacherForm.homeroomGrade
    const numChar = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }[finalGrade] || finalGrade
    finalAssignedClass = `${numChar}年 ${teacherForm.homeroomClass} 班`
  } else if (teacherForm.role === '科任教師') {
    finalGrade = teacherForm.teachingGrades[0] || '3'
    const subs = teacherForm.selectedSubjects
    const numChar = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }[finalGrade] || finalGrade
    finalAssignedClass = subs.length > 0 ? `${numChar}年級 (${subs.join(', ')})` : `${numChar}年級 (科任教師)`
  } else if (teacherForm.role === '授課教師') {
    const numChar = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }[teacherForm.homeroomGrade] || teacherForm.homeroomGrade
    const subCount = totalSelectedClassesCount.value
    finalGrade = teacherForm.homeroomGrade
    finalAssignedClass = `${numChar}年 ${teacherForm.homeroomClass} 班兼${teacherForm.selectedSubjects.join('、')}科任(${subCount}班)`
  }

  const payload = {
    name: teacherForm.name,
    username: teacherForm.username,
    adminCode: teacherForm.username,
    role: teacherForm.role,
    grade: finalGrade,
    assignedClass: finalAssignedClass,
    email: teacherForm.email,
    isActive: teacherForm.isActive
  }

  if (isEditMode.value && currentEditingId.value) {
    await teacherService.updateTeacher(currentEditingId.value, payload)
    const item = allTeacherList.value.find(t => t.id === currentEditingId.value)
    if (item) {
      Object.assign(item, payload)
    }
    ElMessage.success(`已更新【${payload.name}】教師帳號與任課設定！`)
  } else {
    const res = await teacherService.createTeacher({
      ...payload,
      year: teacherFilters.year || '115'
    })
    allTeacherList.value.unshift({
      ...res.data,
      selected: false
    })
    ElMessage.success(`成功建立教師帳號：${payload.name}，並已發送通知信！`)
  }

  createDialogVisible.value = false
}

// ==========================================
// 彈窗 2：批次匯入教師帳號
// ==========================================
const batchDialogVisible = ref(false)
const selectedFileName = ref('')

function openBatchImportModal() {
  selectedFileName.value = ''
  batchDialogVisible.value = true
}

function downloadTemplate() {
  ElMessage.success('已開始下載空白教師匯入範例檔案 (teacher_import_template.xlsx)')
}

function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (file) {
    selectedFileName.value = file.name
  }
}

async function uploadBatch() {
  if (!selectedFileName.value) {
    ElMessage.warning('請先選擇要上傳的 Excel 檔案！')
    return
  }
  await teacherService.batchImport(selectedFileName.value)
  ElMessage.success(`檔案【${selectedFileName.value}】批次解析完成，已成功匯入教師帳號並寄送通知信！`)
  selectedFileName.value = ''
  batchDialogVisible.value = false
  await loadTeacherList()
}
</script>
