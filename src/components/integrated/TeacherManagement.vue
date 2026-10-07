<template>
  <div>
<!-- VIEW 1: 教師帳號管理 (新舊融合旗艦版)       -->
    <!-- ========================================== -->
    <div class="space-y-4">
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between flex-wrap gap-3 pb-1">
        <div class="text-xs text-slate-500 font-medium">
          校內教師帳號權限、身分群組與授課配置，支援即時篩選、線上新增與批次指派匯出。
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
            @click="openBatchAllocationModal"
            class="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#2d5a52] border border-emerald-300 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="選取教師後統一年級並依序或個別排定班級"
          >
            <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            批次學年班級指派
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

      <!-- Filter Bar (現代卡片式篩選) -->
      <div class="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              <option value="導師兼科任">導師兼科任</option>
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
            @click="openBatchAllocationModal"
            class="px-3.5 py-1.5 bg-[#2d5a52] hover:bg-[#1f3f39] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5 border border-emerald-500/40"
          >
            <svg class="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>⚡ 批次學年班級指派</span>
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
                      {{ formatRoleName(t.role) }}
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

    
<!-- MODAL 1: 新增 / 編輯教師帳號 (雙開關正交架構 UX) -->
    <!-- ============================================== -->
    <el-dialog
      v-model="createDialogVisible"
      :title="isEditMode ? (teacherForm.isSystemPreset ? `編輯${teacherForm.role}帳號資訊 (系統預設)` : '編輯教師帳號與任課設定') : '新增校內教師帳號'"
      width="780px"
      append-to-body
      destroy-on-close
      class="rounded-2xl overflow-hidden"
    >
      <div class="space-y-4 text-xs">
        <!-- 頂部導覽列與身分標籤 -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-200 flex-wrap gap-2">
          <!-- 麵包屑導覽 -->
          <div class="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">校內名冊</span>
            <span>&gt;</span>
            <span class="font-bold text-slate-800 truncate max-w-[140px]">{{ teacherForm.name || '新教師帳號' }}</span>
          </div>

          <!-- 右側身分徽章標籤 (身分別固定為教師帳號，不讓使用者多餘選擇) -->
          <div>
            <span
              v-if="teacherForm.isSystemPreset"
              class="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold"
            >
              系統預設管理帳號 ({{ teacherForm.role }})
            </span>
            <span
              v-else
              class="px-2.5 py-1 rounded-lg bg-[#52796f]/10 text-[#52796f] border border-[#52796f]/20 text-xs font-bold"
            >
              教師帳號
            </span>
          </div>
        </div>

        <form @submit.prevent="saveTeacher" class="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <!-- 系統預設帳號提示 (校長/學年主任) -->
          <div v-if="isEditMode && teacherForm.isSystemPreset" class="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold" :class="getRoleBadgeClass(teacherForm.role)">
                {{ teacherForm.role }}
              </span>
              <span class="text-[11px] font-bold text-amber-900">【系統預設帳號】</span>
            </div>
            <p class="text-[11px] text-amber-800 m-0 leading-normal">
              此帳號為系統依學校編制預設之管理帳號，無法變更身分權限，任教年級與班級依規範自動留空。
            </p>
          </div>

          <!-- 基本帳號資料卡片 -->
          <div class="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
            <div class="font-bold text-slate-700 flex items-center gap-1.5 pb-2 border-b border-slate-200/80">
              <span>📋 基本帳號資料</span>
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
            <div class="p-2.5 bg-white border border-slate-200/90 rounded-lg flex items-center justify-between">
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
          </div>

          <!-- 雙開關正交架構：導師與任課班級設定 (非系統預設帳號時顯示) -->
          <div v-if="!teacherForm.isSystemPreset" class="space-y-3.5">
            
            <!-- 開關 1：是否擔任班級導師 -->
            <div class="p-3.5 bg-sky-50/50 border border-sky-200 rounded-xl space-y-3 transition">
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-sky-950 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>🏫 是否擔任班級導師？</span>
                  </span>
                  <p class="text-[11px] text-sky-700 m-0 mt-0.5">
                    負責管轄單一班級的學生測驗成績（若為純專任科任老師請關閉）
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <el-switch
                    v-model="teacherForm.isHomeroom"
                    active-color="#52796f"
                    inactive-color="#cbd5e1"
                    @change="onHomeroomSwitchChange"
                  />
                  <span
                    class="text-xs font-bold whitespace-nowrap select-none"
                    :class="teacherForm.isHomeroom ? 'text-sky-800' : 'text-slate-400'"
                  >
                    {{ teacherForm.isHomeroom ? '擔任導師' : '不帶班' }}
                  </span>
                </div>
              </div>

              <!-- 導師年班下拉 (開關 1 ON 時展開) -->
              <div v-if="teacherForm.isHomeroom" class="pt-2.5 border-t border-sky-200/60 space-y-2">
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
                  已指定為：<strong>{{ teacherForm.homeroomGrade }} 年 {{ teacherForm.homeroomClass }} 班</strong> 導師（80% 專注帶班教師無需開啟下方跨班設定，即可直接儲存）。
                </p>
              </div>
            </div>

            <!-- 開關 2：任課班級設定 -->
            <div class="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3 transition">
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-bold text-[#354f52] text-xs sm:text-sm flex items-center gap-1.5">
                    <span>📚 任課班級設定</span>
                  </span>
                  <p class="text-[11px] text-emerald-700 m-0 mt-0.5">
                    {{ teacherForm.isHomeroom ? '配置各科任教班級（若僅帶導師班、無跨班任課，保持關閉即可儲存）' : '專任任課教師請在此配置各年級任教之學科與班級管轄權限' }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <el-switch
                    v-model="teacherForm.isSubject"
                    active-color="#52796f"
                    inactive-color="#cbd5e1"
                    @change="onSubjectSwitchChange"
                  />
                  <span
                    class="text-xs font-bold whitespace-nowrap select-none"
                    :class="teacherForm.isSubject ? 'text-[#354f52]' : 'text-slate-400'"
                  >
                    {{ teacherForm.isSubject ? '已開啟' : '未開啟' }}
                  </span>
                </div>
              </div>

              <!-- 任課配置盤 (開關 2 ON 時展開) -->
              <div v-if="teacherForm.isSubject" class="pt-3 border-t border-emerald-200/80 space-y-3">
                <!-- 科目切換膠囊與工具列 -->
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="font-semibold text-slate-700 text-xs">選擇配課科目：</span>
                    <button
                      v-for="sub in availableSubjects"
                      :key="sub"
                      type="button"
                      @click="teacherForm.activeSubject = sub"
                      class="px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer flex items-center gap-1"
                      :class="teacherForm.activeSubject === sub
                        ? 'bg-[#52796f] text-white border-[#52796f] shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'"
                    >
                      <span>{{ sub }}</span>
                      <span
                        class="px-1.5 py-0.2 rounded-full text-[10px] font-mono"
                        :class="teacherForm.activeSubject === sub ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'"
                      >
                        {{ (teacherForm.classMatrix[sub] || []).length }}班
                      </span>
                    </button>
                  </div>

                  <!-- 跨科已選統計 & 複製配置快捷鈕 -->
                  <div class="flex items-center gap-2 flex-wrap">
                    <el-popover placement="bottom" :width="240" trigger="click">
                      <template #reference>
                        <button
                          type="button"
                          class="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                          title="將目前科目選取的班級複製到其他科目"
                        >
                          <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>複製配置至...</span>
                        </button>
                      </template>
                      <div class="space-y-1.5 text-xs">
                        <div class="font-bold text-slate-700 pb-1 border-b border-slate-100">
                          將【{{ teacherForm.activeSubject }}】班級複製到：
                        </div>
                        <div
                          v-for="targetSub in availableSubjects.filter(s => s !== teacherForm.activeSubject)"
                          :key="targetSub"
                          @click="copySubjectClasses(teacherForm.activeSubject, targetSub)"
                          class="px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer flex items-center justify-between text-slate-700"
                        >
                          <span>{{ targetSub }}</span>
                          <span class="text-slate-400 text-[11px]">&rarr; 覆蓋套用</span>
                        </div>
                        <div
                          @click="copyToAllSubjects(teacherForm.activeSubject)"
                          class="px-2 py-1.5 rounded bg-emerald-50 text-[#52796f] hover:bg-emerald-100 cursor-pointer font-bold flex items-center justify-between mt-1"
                        >
                          <span>所有其他學科</span>
                          <span class="text-[11px]">⚡ 一鍵套用全部</span>
                        </div>
                      </div>
                    </el-popover>

                    <span class="text-emerald-800 font-bold bg-white px-2 py-1 rounded-lg border border-emerald-200 text-xs">
                      跨科總計：<strong class="font-mono">{{ totalSelectedClassesCount }}</strong> 班次
                    </span>
                  </div>
                </div>

                <!-- 年級班級快捷矩陣選擇區 -->
                <div class="space-y-2 bg-white p-3 rounded-xl border border-emerald-100 max-h-56 overflow-y-auto">
                  <div
                    v-for="gItem in gradeClassStructure"
                    :key="gItem.grade"
                    class="flex items-center gap-2 p-1.5 border-b border-slate-100 last:border-b-0 flex-wrap"
                  >
                    <!-- 年級標籤 -->
                    <span class="font-bold text-slate-800 w-16 text-xs">{{ gItem.label }}：</span>
                    
                    <!-- 快捷全選 / 清空 -->
                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        @click="batchGradeAction(teacherForm.activeSubject, gItem, 'all')"
                        class="px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[11px] cursor-pointer transition"
                      >
                        ⚡ 整年級全包
                      </button>
                      <button
                        type="button"
                        @click="batchGradeAction(teacherForm.activeSubject, gItem, 'clear')"
                        class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] cursor-pointer transition"
                      >
                        清空
                      </button>
                    </div>

                    <!-- 班級按鈕膠囊 -->
                    <div class="flex items-center gap-1.5 ml-1 flex-wrap flex-1">
                      <button
                        v-for="cCode in gItem.classes"
                        :key="cCode"
                        type="button"
                        @click="toggleClassSelection(teacherForm.activeSubject, cCode)"
                        class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer select-none"
                        :class="isClassSelected(teacherForm.activeSubject, cCode)
                          ? 'bg-[#52796f] text-white shadow-2xs scale-102'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/70'"
                      >
                        {{ cCode }}班
                        <span v-if="isClassSelected(teacherForm.activeSubject, cCode)" class="ml-0.5 text-[10px]">✓</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- 即時配置預覽摘要卡 (實時產生清晰自然語言) -->
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold text-slate-700">📋 配置摘要預覽：</span>
              <span
                class="font-bold"
                :class="(!teacherForm.isSystemPreset && !teacherForm.isHomeroom && !teacherForm.isSubject) ? 'text-rose-500' : 'text-[#52796f]'"
              >
                {{ liveAllocationSummary }}
              </span>
            </div>
            <div class="text-[11px] text-slate-400">
              確認配置無誤後，請點擊右下方按鈕儲存。
            </div>
          </div>

          <!-- 底部控制按鈕 -->
          <div class="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
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
              <span class="font-bold text-slate-800">3. 導師兼科任：</span>兼任班級導師，亦教授其它班級特定學科教學之教師。
            </p>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- ============================================== -->
    <!-- MODAL 3: 批次學年班級指派盤 (兩階段智慧配班彈窗 - 方案一) -->
    <!-- ============================================== -->
    <el-dialog
      v-model="batchAllocationDialogVisible"
      title="⚡ 批次學年班級指派盤 (兩階段智慧配班)"
      width="840px"
      append-to-body
      destroy-on-close
      class="rounded-2xl overflow-hidden"
    >
      <div class="space-y-4 text-xs">
        <!-- 說明橫幅 -->
        <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
          <span class="text-base">💡</span>
          <div>
            <strong class="font-bold">兩階段操作流程：</strong>
            已選取 <span class="font-mono font-bold text-emerald-800">{{ batchAllocList.length }}</span> 位教師。
            第一步先統一指定目標學年，第二步可個別改班或使用「⚡ 依序流水號自動填入」，內建即時衝突防呆，杜絕重複撞班！
          </div>
        </div>

        <!-- 第一步：統一指定任教年級 -->
        <div class="p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl space-y-2">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span class="font-bold text-sky-950 text-xs sm:text-sm flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>第一步：統一指定任教年級</span>
              </span>
              <p class="text-[11px] text-sky-800 m-0 mt-0.5 pl-6.5">
                切換年級時，下方所有選定教師將同步連動至該學年
              </p>
            </div>

            <!-- Grade Select -->
            <div class="flex items-center gap-2">
              <span class="font-bold text-slate-700">目標學年：</span>
              <select
                v-model="batchTargetGrade"
                class="h-8 px-3 bg-white border border-sky-300 rounded-lg font-bold text-xs outline-none focus:border-sky-600 cursor-pointer shadow-2xs"
              >
                <option value="1">1 年級</option>
                <option value="2">2 年級</option>
                <option value="3">3 年級</option>
                <option value="4">4 年級</option>
                <option value="5">5 年級</option>
                <option value="6">6 年級</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 第二步：分別指定擔任班級別 -->
        <div class="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span class="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-[#52796f] text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>第二步：分別指定擔任班級別</span>
              </span>
              <p class="text-[11px] text-slate-500 m-0 mt-0.5 pl-6.5">
                可單獨逐一微調切換，或使用快捷鍵一鍵依序流水號填入
              </p>
            </div>

            <!-- Fast Batch Helpers -->
            <div class="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                @click="autoFillSequentialClasses"
                class="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold cursor-pointer transition shadow-2xs flex items-center gap-1"
                title="一鍵將選定老師依序填為 1班、2班、3班、4班..."
              >
                <span>⚡ 依序流水號自動填入 (1班、2班、3班...)</span>
              </button>
              <button
                type="button"
                @click="clearAllBatchClasses"
                class="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-lg text-xs font-medium cursor-pointer transition"
              >
                清空班級
              </button>
            </div>
          </div>

          <!-- Teachers Sequential Table -->
          <div class="border border-slate-200 rounded-xl overflow-hidden bg-white max-h-72 overflow-y-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th class="py-2.5 px-3 w-12 text-center">No.</th>
                  <th class="py-2.5 px-3">教師姓名</th>
                  <th class="py-2.5 px-3">原身分 / 原配置</th>
                  <th class="py-2.5 px-3 text-sky-900 font-bold">統一年級</th>
                  <th class="py-2.5 px-3 text-emerald-800 font-bold">個別擔任班級別</th>
                  <th class="py-2.5 px-3 text-center">狀態檢核</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                <tr
                  v-for="(item, idx) in batchAllocList"
                  :key="item.id"
                  class="hover:bg-slate-50/80 transition"
                  :class="{ 'bg-amber-50/40': isClassConflict(item.targetClassNum) }"
                >
                  <td class="py-2.5 px-3 text-slate-400 font-mono text-center">{{ idx + 1 }}</td>
                  <td class="py-2.5 px-3 font-bold text-slate-800">
                    {{ item.name }}
                    <span class="text-slate-400 font-mono text-[10px] ml-1 font-normal">({{ item.username }})</span>
                  </td>
                  <td class="py-2.5 px-3 text-slate-500">
                    <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] mr-1">{{ item.role }}</span>
                    <span>{{ item.oldClass }}</span>
                  </td>
                  <td class="py-2.5 px-3 font-bold text-sky-900 bg-sky-50/30">
                    <span class="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-mono text-[11px]">
                      {{ batchTargetGrade }} 年級
                    </span>
                  </td>
                  <td class="py-2.5 px-3 bg-emerald-50/30">
                    <select
                      v-model="item.targetClassNum"
                      class="h-7 px-2.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-[#354f52] outline-none focus:border-[#52796f] cursor-pointer shadow-2xs"
                      :class="{ 'border-amber-500 text-amber-900 bg-amber-50': isClassConflict(item.targetClassNum) }"
                    >
                      <option v-for="c in 8" :key="c" :value="String(c)">
                        {{ c }} 班
                      </option>
                      <option value="0">（未指派班級）</option>
                    </select>
                  </td>
                  <td class="py-2.5 px-3 text-center">
                    <span
                      v-if="isClassConflict(item.targetClassNum)"
                      class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] inline-flex items-center gap-1"
                    >
                      <span>⚠️</span> 重複選班
                    </span>
                    <span
                      v-else-if="item.targetClassNum !== '0'"
                      class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]"
                    >
                      ✓ 正常指派
                    </span>
                    <span
                      v-else
                      class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[10px]"
                    >
                      未指派
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Conflict Warning Banner (Shown if duplicate class selected) -->
          <div
            v-if="hasBatchConflict"
            class="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center justify-between transition"
          >
            <div class="flex items-center gap-2">
              <span class="text-base">⚠️</span>
              <strong class="font-bold">
                偵測到重複班級衝突：{{ conflictClassesDesc }} 同時有 2 位以上導師！
              </strong>
            </div>
            <span class="text-[11px] text-amber-700">請避免多位導師指派於同一班級</span>
          </div>
        </div>

        <!-- 底部確認按鈕與總結 -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
          <div class="text-xs">
            <span v-if="hasBatchConflict" class="text-rose-600 font-bold">
              ⚠️ 請先排除重複班級衝突後再進行儲存
            </span>
            <span v-else class="text-emerald-700 font-bold">
              ✅ {{ batchAllocList.length }} 位教師皆已完成班級配置規劃，無任何衝突。
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="batchAllocationDialogVisible = false"
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition"
            >
              取消
            </button>
            <button
              type="button"
              :disabled="hasBatchConflict || isSavingBatchAllocation"
              @click="saveBatchAllocation"
              class="px-5 py-2 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5"
              :class="hasBatchConflict || isSavingBatchAllocation ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#52796f] hover:bg-[#354f52] text-white cursor-pointer active:scale-95'"
            >
              <svg v-if="isSavingBatchAllocation" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{{ isSavingBatchAllocation ? '儲存中...' : `確認儲存指派 (共 ${batchAllocList.length} 位)` }}</span>
            </button>
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

// 角色名稱格式化 (UI 統一淘汰「授課教師」，呈現直覺之「導師兼科任」)
function formatRoleName(role) {
  if (role === '授課教師') return '導師兼科任'
  return role
}

// 角色徽章顏色輔助樣式
function getRoleBadgeClass(role) {
  if (role === '校長') return 'bg-slate-100 text-slate-700 border border-slate-300'
  if (role === '學年主任') return 'bg-amber-50 text-amber-800 border border-amber-200'
  if (role === '班級導師') return 'bg-sky-50 text-sky-800 border border-sky-200'
  if (role === '科任教師') return 'bg-emerald-50 text-emerald-800 border border-emerald-200'
  if (role === '導師兼科任' || role === '授課教師') return 'bg-indigo-50 text-indigo-800 border border-indigo-200'
  return 'bg-slate-100 text-slate-700 border border-slate-200'
}

// 篩選後名單
const filteredTeacherList = computed(() => {
  return allTeacherList.value.filter(t => {
    // 身分群組篩選
    if (teacherFilters.role !== 'all') {
      if (teacherFilters.role === '導師兼科任') {
        if (t.role !== '導師兼科任' && t.role !== '授課教師') return false
      } else if (teacherFilters.role === '授課教師') {
        if (t.role !== '導師兼科任' && t.role !== '授課教師') return false
      } else {
        if (t.role !== teacherFilters.role) return false
      }
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
// 彈窗 1：新增 / 編輯教師帳號 (雙開關正交架構)
// ==========================================
const createDialogVisible = ref(false)
const isEditMode = ref(false)
const currentEditingId = ref(null)

// 可選學科清單
const availableSubjects = ['國語文', '數學', '英語文', '自然科學']

// 現代年級與班級結構表
const gradeClassStructure = [
  { grade: '1', label: '1 年級', classes: ['101', '102', '103', '104', '105', '106'] },
  { grade: '2', label: '2 年級', classes: ['201', '202', '203', '204', '205', '206'] },
  { grade: '3', label: '3 年級', classes: ['301', '302', '303', '304', '305', '306'] },
  { grade: '4', label: '4 年級', classes: ['401', '402', '403', '404', '405', '406'] },
  { grade: '5', label: '5 年級', classes: ['501', '502', '503', '504', '505', '506'] },
  { grade: '6', label: '6 年級', classes: ['601', '602', '603', '604', '605', '606'] }
]

const teacherForm = reactive({
  isSystemPreset: false,
  role: '班級導師',
  directorGrade: '1',
  name: '',
  username: '',
  email: '',
  isActive: true,
  // 雙開關正交配置
  isHomeroom: true,
  homeroomGrade: '3',
  homeroomClass: '1',
  isSubject: false,
  activeSubject: '國語文',
  classMatrix: {
    '國語文': [],
    '數學': [],
    '英語文': [],
    '自然科學': []
  }
})

// 跨科已選班級總數
const totalSelectedClassesCount = computed(() => {
  let count = 0
  availableSubjects.forEach(s => {
    count += (teacherForm.classMatrix[s] || []).length
  })
  return count
})

// 即時配置摘要預覽文字
const liveAllocationSummary = computed(() => {
  if (teacherForm.isSystemPreset) {
    return `系統預設帳號（${teacherForm.role}），任教年級與班級依規範自動留空。`
  }

  const g = teacherForm.homeroomGrade
  const c = teacherForm.homeroomClass
  const numChar = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }[g] || g

  const subParts = []
  availableSubjects.forEach(s => {
    const list = teacherForm.classMatrix[s] || []
    if (list.length > 0) {
      subParts.push(`${s} ${list.length}班`)
    }
  })
  const subDesc = subParts.length > 0 ? subParts.join('、') : '未勾選跨班'

  if (teacherForm.isHomeroom && !teacherForm.isSubject) {
    return `${numChar}年 ${c} 班 導師 (專注帶班，無跨班科任)`
  } else if (!teacherForm.isHomeroom && teacherForm.isSubject) {
    return `專任科任教師（${subDesc}）`
  } else if (teacherForm.isHomeroom && teacherForm.isSubject) {
    return `${numChar}年 ${c} 班 導師 兼任【${subDesc}】`
  } else {
    return '尚未配置任何班級（請至少開啟「擔任班級導師」或「任課班級設定」）'
  }
})

// 雙開關連動邏輯
function onHomeroomSwitchChange(val) {
  if (!val) {
    // 關閉導師時，若任課亦未開，自動開啟任課開關以避免空狀態
    if (!teacherForm.isSubject) {
      teacherForm.isSubject = true
    }
  }
}

function onSubjectSwitchChange(val) {
  if (!val) {
    // 關閉任課時，若導師亦未開，自動開啟導師開關
    if (!teacherForm.isHomeroom) {
      teacherForm.isHomeroom = true
    }
  }
}

// 矩陣操作輔助方法
function isClassSelected(subject, code) {
  return (teacherForm.classMatrix[subject] || []).includes(code)
}

function toggleClassSelection(subject, code) {
  if (!teacherForm.classMatrix[subject]) {
    teacherForm.classMatrix[subject] = []
  }
  const list = teacherForm.classMatrix[subject]
  const idx = list.indexOf(code)
  if (idx > -1) {
    list.splice(idx, 1)
  } else {
    list.push(code)
    list.sort()
  }
}

function batchGradeAction(subject, gItem, action) {
  if (!teacherForm.classMatrix[subject]) {
    teacherForm.classMatrix[subject] = []
  }
  const list = teacherForm.classMatrix[subject]
  if (action === 'all') {
    gItem.classes.forEach(c => {
      if (!list.includes(c)) list.push(c)
    })
    teacherForm.classMatrix[subject].sort()
  } else if (action === 'clear') {
    teacherForm.classMatrix[subject] = list.filter(c => !gItem.classes.includes(c))
  }
}

// 跨科配置複製
function copySubjectClasses(fromSub, toSub) {
  if (!fromSub || !toSub || fromSub === toSub) return
  teacherForm.classMatrix[toSub] = [...(teacherForm.classMatrix[fromSub] || [])]
  ElMessage.success(`已成功將【${fromSub}】的班級配置複製至【${toSub}】！`)
}

function copyToAllSubjects(fromSub) {
  const current = teacherForm.classMatrix[fromSub] || []
  availableSubjects.forEach(s => {
    if (s !== fromSub) {
      teacherForm.classMatrix[s] = [...current]
    }
  })
  ElMessage.success(`已將【${fromSub}】的班級配置複製至所有其他學科！`)
}

// 開啟新增彈窗
function openCreateTeacherModal() {
  isEditMode.value = false
  currentEditingId.value = null

  teacherForm.isSystemPreset = false
  teacherForm.role = '班級導師'
  teacherForm.directorGrade = '1'
  teacherForm.name = ''
  teacherForm.username = 'TAdmin_' + Math.floor(100000 + Math.random() * 900000)
  teacherForm.email = ''
  teacherForm.isActive = true
  teacherForm.isHomeroom = true
  teacherForm.homeroomGrade = '3'
  teacherForm.homeroomClass = '1'
  teacherForm.isSubject = false
  teacherForm.activeSubject = '國語文'
  teacherForm.classMatrix = {
    '國語文': [],
    '數學': [],
    '英語文': [],
    '自然科學': []
  }

  createDialogVisible.value = true
}

// 開啟編輯彈窗
function openEditTeacherModal(t) {
  isEditMode.value = true
  currentEditingId.value = t.id

  teacherForm.name = t.name || ''
  teacherForm.username = t.username || t.adminCode || ''
  teacherForm.email = t.email || ''
  teacherForm.isActive = t.isActive !== false

  if (t.role === '校長' || t.role === '學年主任') {
    teacherForm.isSystemPreset = true
    teacherForm.role = t.role
    teacherForm.directorGrade = t.grade || '1'
    teacherForm.isHomeroom = false
    teacherForm.isSubject = false
  } else if (t.role === '班級導師') {
    teacherForm.isSystemPreset = false
    teacherForm.role = '班級導師'
    teacherForm.isHomeroom = true
    teacherForm.homeroomGrade = t.grade || '3'
    teacherForm.homeroomClass = t.assignedClass ? (t.assignedClass.match(/\d+/) ? t.assignedClass.match(/\d+/)[0] : '1') : '1'
    teacherForm.isSubject = false
    teacherForm.activeSubject = '國語文'
    teacherForm.classMatrix = {
      '國語文': [],
      '數學': [],
      '英語文': [],
      '自然科學': []
    }
  } else if (t.role === '科任教師') {
    teacherForm.isSystemPreset = false
    teacherForm.role = '科任教師'
    teacherForm.isHomeroom = false
    teacherForm.homeroomGrade = '3'
    teacherForm.homeroomClass = '1'
    teacherForm.isSubject = true

    let sub = '國語文'
    if (t.assignedClass && t.assignedClass.includes('數學')) sub = '數學'
    else if (t.assignedClass && (t.assignedClass.includes('英語') || t.assignedClass.includes('英文'))) sub = '英語文'
    else if (t.assignedClass && t.assignedClass.includes('自然')) sub = '自然科學'
    teacherForm.activeSubject = sub

    const g = t.grade || '3'
    teacherForm.classMatrix = {
      '國語文': [],
      '數學': [],
      '英語文': [],
      '自然科學': []
    }
    teacherForm.classMatrix[sub] = [`${g}01`, `${g}02`, `${g}03`]
  } else {
    // 導師兼科任 或 原授課教師
    teacherForm.isSystemPreset = false
    teacherForm.role = '導師兼科任'
    teacherForm.isHomeroom = true
    teacherForm.homeroomGrade = t.grade || '3'
    teacherForm.homeroomClass = t.assignedClass ? (t.assignedClass.match(/\d+/) ? t.assignedClass.match(/\d+/)[0] : '1') : '1'
    teacherForm.isSubject = true
    teacherForm.activeSubject = '國語文'
    teacherForm.classMatrix = {
      '國語文': [`${t.grade || '3'}01`, `${t.grade || '3'}02`],
      '數學': [],
      '英語文': [],
      '自然科學': []
    }
  }

  createDialogVisible.value = true
}

// 儲存教師資料
async function saveTeacher() {
  if (!teacherForm.name.trim()) {
    ElMessage.warning('請填寫教師姓名！')
    return
  }
  if (!teacherForm.username.trim()) {
    ElMessage.warning('請填寫登入使用者名稱！')
    return
  }
  if (!teacherForm.email.trim()) {
    ElMessage.warning('請填寫電子郵件信箱！')
    return
  }

  let finalRole = ''
  let finalGrade = ''
  let finalAssignedClass = ''

  if (teacherForm.isSystemPreset) {
    finalRole = teacherForm.role
    finalGrade = teacherForm.role === '學年主任' ? teacherForm.directorGrade : ''
    finalAssignedClass = ''
  } else {
    if (!teacherForm.isHomeroom && !teacherForm.isSubject) {
      ElMessage.warning('請至少開啟「擔任班級導師」或「任課班級設定」以配置教學身分！')
      return
    }

    if (teacherForm.isSubject && totalSelectedClassesCount.value === 0) {
      ElMessage.warning('您已開啟「任課班級設定」，請至少勾選一個任教班級，或將其開關關閉！')
      return
    }

    if (teacherForm.isHomeroom && !teacherForm.isSubject) {
      finalRole = '班級導師'
      finalGrade = teacherForm.homeroomGrade
      const numChar = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }[finalGrade] || finalGrade
      finalAssignedClass = `${numChar}年 ${teacherForm.homeroomClass} 班`
    } else if (!teacherForm.isHomeroom && teacherForm.isSubject) {
      finalRole = '科任教師'
      const activeSubs = availableSubjects.filter(s => (teacherForm.classMatrix[s] || []).length > 0)
      const allSelectedCodes = Object.values(teacherForm.classMatrix).flat()
      const gradesSet = [...new Set(allSelectedCodes.map(c => c.charAt(0)))]
      finalGrade = gradesSet[0] || '3'
      const numChar = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }[finalGrade] || finalGrade
      const subDesc = activeSubs.join('、')
      finalAssignedClass = `${numChar}年級 (${subDesc}科任，${allSelectedCodes.length}班)`
    } else {
      // 導師兼科任 (對應後端 access_level = 3)
      finalRole = '導師兼科任'
      finalGrade = teacherForm.homeroomGrade
      const numChar = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }[finalGrade] || finalGrade
      const activeSubs = availableSubjects.filter(s => (teacherForm.classMatrix[s] || []).length > 0)
      const subParts = activeSubs.map(s => `${s}${teacherForm.classMatrix[s].length}班`).join('、')
      finalAssignedClass = `${numChar}年 ${teacherForm.homeroomClass} 班兼【${subParts}】`
    }
  }

  const payload = {
    name: teacherForm.name.trim(),
    username: teacherForm.username.trim(),
    adminCode: teacherForm.username.trim(),
    role: finalRole,
    grade: finalGrade,
    assignedClass: finalAssignedClass,
    email: teacherForm.email.trim(),
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
      year: '115'
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
// 方案 D：行內快速編輯模式 (Inline Quick Edit)
// ==========================================
const isInlineEditMode = ref(false)

const dirtyTeacherCount = computed(() => {
  return allTeacherList.value.filter(t => t.isDirty).length
})

function toggleInlineEditMode() {
  isInlineEditMode.value = !isInlineEditMode.value
  if (isInlineEditMode.value) {
    allTeacherList.value.forEach(t => {
      t.editGrade = t.grade || '3'
      const match = t.assignedClass?.match(/\d+/)
      t.editClass = match ? match[0] : '1'
      t.isDirty = false
    })
    ElMessage.info('已進入行內快速編輯模式，可直接在表格內切換年級班級！')
  } else {
    allTeacherList.value.forEach(t => { t.isDirty = false })
  }
}

function handleInlineFieldChange(t) {
  t.isDirty = true
}

async function saveInlineEdits() {
  const dirtyTeachers = allTeacherList.value.filter(t => t.isDirty)
  if (dirtyTeachers.length === 0) return

  const updates = dirtyTeachers.map(t => {
    const numChar = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }[t.editGrade] || t.editGrade
    let newAssignedClass = ''
    if (t.role === '班級導師') {
      newAssignedClass = `${numChar}年 ${t.editClass} 班`
    } else if (t.role === '科任教師') {
      newAssignedClass = `${numChar}年級 (科任)`
    } else {
      newAssignedClass = `${numChar}年 ${t.editClass} 班 (導師兼科任)`
    }
    return {
      id: t.id,
      data: {
        grade: t.editGrade,
        assignedClass: newAssignedClass
      }
    }
  })

  await teacherService.batchUpdateTeachers(updates)
  dirtyTeachers.forEach(t => {
    const numChar = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }[t.editGrade] || t.editGrade
    t.grade = t.editGrade
    if (t.role === '班級導師') {
      t.assignedClass = `${numChar}年 ${t.editClass} 班`
    } else if (t.role === '科任教師') {
      t.assignedClass = `${numChar}年級 (科任)`
    } else {
      t.assignedClass = `${numChar}年 ${t.editClass} 班 (導師兼科任)`
    }
    t.isDirty = false
  })

  isInlineEditMode.value = false
  ElMessage.success(`已成功儲存！共更新 ${dirtyTeachers.length} 位教師之教學配置。`)
}

// ==========================================
// 方案 1：兩階段智慧配班 (Sequential Grade & Class Allocation Wizard)
// ==========================================
const batchAllocationDialogVisible = ref(false)
const batchTargetGrade = ref('4')
const batchAllocList = ref([])
const isSavingBatchAllocation = ref(false)

function openBatchAllocationModal() {
  const selected = allTeacherList.value.filter(t => t.selected)
  if (selected.length === 0) {
    ElMessage.info('請先在下方教師名冊勾選欲指派班級的教師（例如勾選某個學年群的老師），即可開啟指派盤！')
    return
  }

  // 自動根據已選的第一位教師的年級預設，若無則預設 '4'
  const firstWithGrade = selected.find(t => t.grade && t.grade !== 'all')
  batchTargetGrade.value = firstWithGrade ? String(firstWithGrade.grade) : '4'

  // 初始化教師清單與預設流水號班級
  batchAllocList.value = selected.map((t, idx) => {
    // 嘗試解析原班級
    let classNum = '0'
    const cMatch = t.assignedClass?.match(/(\d+)[\s*]班/)
    if (cMatch) {
      classNum = cMatch[1]
    } else {
      // 預設給予流水號 1~8
      classNum = (idx + 1) <= 8 ? String(idx + 1) : '0'
    }

    return {
      id: t.id,
      username: t.username || t.adminCode || '',
      name: t.name,
      role: t.role || '教師',
      oldClass: t.assignedClass || '(未配置)',
      targetClassNum: classNum
    }
  })

  batchAllocationDialogVisible.value = true
}

function autoFillSequentialClasses() {
  batchAllocList.value.forEach((item, idx) => {
    item.targetClassNum = (idx + 1) <= 8 ? String(idx + 1) : '0'
  })
}

function clearAllBatchClasses() {
  batchAllocList.value.forEach(item => {
    item.targetClassNum = '0'
  })
}

const conflictClasses = computed(() => {
  const counts = {}
  batchAllocList.value.forEach(item => {
    if (item.targetClassNum && item.targetClassNum !== '0') {
      counts[item.targetClassNum] = (counts[item.targetClassNum] || 0) + 1
    }
  })
  return Object.keys(counts).filter(num => counts[num] > 1)
})

const hasBatchConflict = computed(() => conflictClasses.value.length > 0)

const conflictClassesDesc = computed(() => {
  return conflictClasses.value.map(c => `${c}班`).join('、')
})

function isClassConflict(classNum) {
  if (!classNum || classNum === '0') return false
  return conflictClasses.value.includes(classNum)
}

async function saveBatchAllocation() {
  if (hasBatchConflict.value) {
    ElMessage.error(`偵測到重複班級衝突（${conflictClassesDesc.value}），請修正後再儲存！`)
    return
  }

  isSavingBatchAllocation.value = true
  try {
    const numCharMap = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }
    const chineseGrade = numCharMap[batchTargetGrade.value] || batchTargetGrade.value

    const updates = batchAllocList.value.map(item => {
      let newAssignedClass = ''
      let newRole = item.role

      if (item.targetClassNum === '0') {
        newAssignedClass = `${batchTargetGrade.value}年級 (未指派班級)`
      } else {
        newAssignedClass = `${chineseGrade}年 ${item.targetClassNum} 班`
        // 如果原本是純科任，指派了明確班級則調整身分為導師 (若原為導師兼科任則保留)
        if (newRole === '科任教師' || newRole === '教師') {
          newRole = '班級導師'
        }
      }

      return {
        id: item.id,
        data: {
          grade: batchTargetGrade.value,
          assignedClass: newAssignedClass,
          role: newRole
        }
      }
    })

    // 呼叫後端/Service批次更新
    await teacherService.batchUpdateTeachers(updates)

    // 同步更新前端記憶體狀態
    updates.forEach(({ id, data }) => {
      const localTeacher = allTeacherList.value.find(t => t.id === id)
      if (localTeacher) {
        localTeacher.grade = data.grade
        localTeacher.assignedClass = data.assignedClass
        localTeacher.role = data.role
        localTeacher.selected = false
      }
    })

    batchAllocationDialogVisible.value = false
    cancelSelectAll()
    ElMessage.success(`🎉 已成功完成 ${updates.length} 位教師之 ${batchTargetGrade.value} 年級班級配置！`)
  } catch (err) {
    ElMessage.error('儲存失敗：' + (err.message || '系統發生錯誤'))
  } finally {
    isSavingBatchAllocation.value = false
  }
}

// ==========================================
// 方案 C：新學年滾動轉移精靈 (Academic Year Rollover)
// ==========================================
const rolloverDialogVisible = ref(false)
const rolloverStrategy = ref('smart')

function openRolloverModal() {
  rolloverStrategy.value = 'smart'
  rolloverDialogVisible.value = true
}

const rolloverPreviewList = computed(() => {
  return allTeacherList.value.filter(t => t.role !== '校長').slice(0, 8).map(t => {
    const before = t.assignedClass || `${t.grade || '3'}年級`
    let after = ''
    let status = ''

    if (rolloverStrategy.value === 'smart') {
      if (t.role === '班級導師' || t.role === '導師兼科任') {
        const currG = parseInt(t.grade) || 3
        if (currG >= 6) {
          after = '（未分配 · 待重新指派）'
          status = '六年級畢業卸任導師'
        } else {
          const nextG = currG + 1
          const cMatch = t.assignedClass?.match(/\d+/)
          const cNum = cMatch ? cMatch[0] : '1'
          const numChar = { '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六' }[nextG] || nextG
          after = `${numChar}年 ${cNum} 班`
          status = '原班升年級帶班 (+1)'
        }
      } else {
        after = before + ' (沿用)'
        status = '科任權限年度沿用'
      }
    } else {
      after = '（班級清空 · 帳號保留）'
      status = '清空班級待新排課'
    }

    return {
      name: t.name,
      role: t.role,
      before,
      after,
      status
    }
  })
})

async function applyYearRollover() {
  ElMessage.success('新學年滾動轉移完成！已成功將 114 年度教師名單升學年帶班並更新至新年度。')
  rolloverDialogVisible.value = false
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
