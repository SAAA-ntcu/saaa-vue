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
    <!-- VIEW 1: 教師帳號管理 (新舊融合旗艦版)       -->
    <!-- ========================================== -->
    <div v-if="mainTab === 'teachers'" class="space-y-4">
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between flex-wrap gap-3 pb-1">
        <div class="text-xs text-slate-500 font-medium">
          {{ teacherFilters.year }} 學年度教師登入權限、身分群組與授課配置，支援即時篩選、彈窗新增與批次匯出。
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- 學年度 -->
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">學年度</label>
            <select
              v-model="teacherFilters.year"
              @change="handleTeacherFilterChange"
              class="w-full h-9 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f] cursor-pointer"
            >
              <option value="115">115 學年度</option>
              <option value="114">114 學年度</option>
              <option value="113">113 學年度</option>
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
                placeholder="姓名、管理碼或信箱"
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
        class="flex items-center justify-between p-2.5 sm:p-3 bg-[#edf2ee] border border-[#52796f]/30 rounded-xl text-xs text-[#2f3e46] transition-all"
      >
        <div class="flex items-center gap-2 font-medium">
          <span class="w-2 h-2 rounded-full bg-[#52796f]"></span>
          <span>已勾選 <strong class="text-[#354f52] font-bold">{{ selectedTeacherCount }}</strong> 位教師帳號</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="exportSelectedTeachers"
            class="px-3 py-1.5 bg-[#52796f] hover:bg-[#354f52] text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            匯出所選教師 (Excel)
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
                <th class="py-3 px-4">教師姓名 / 管理專用碼</th>
                <th class="py-3 px-4">組別身分</th>
                <th class="py-3 px-4">任教年級 / 班級</th>
                <th class="py-3 px-4">電子郵件信箱</th>
                <th class="py-3 px-4 text-center">有效期限 / 狀態</th>
                <th class="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              <tr
                v-for="(t, index) in paginatedTeacherList"
                :key="t.id"
                class="hover:bg-slate-50/70 transition"
                :class="{ 'bg-emerald-50/20': t.selected }"
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

                <!-- 姓名 / 管理專用碼 (複合欄位) -->
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-800 text-xs">{{ t.name }}</div>
                  <div class="font-mono text-[11px] text-slate-400 tracking-tight">{{ t.adminCode }}</div>
                </td>

                <!-- 組別身分 -->
                <td class="py-3 px-4">
                  <span
                    class="px-2.5 py-0.5 rounded-md text-[11px] font-semibold"
                    :class="getRoleBadgeClass(t.role)"
                  >
                    {{ t.role }}
                  </span>
                </td>

                <!-- 任教年級 / 班級 -->
                <td class="py-3 px-4">
                  <div class="font-medium text-slate-700">{{ t.assignedClass }}</div>
                </td>

                <!-- 電子郵件信箱 -->
                <td class="py-3 px-4 font-mono text-slate-600 text-[11px]">
                  <a :href="`mailto:${t.email}`" class="text-slate-600 hover:text-[#52796f] hover:underline no-underline">
                    {{ t.email }}
                  </a>
                </td>

                <!-- 有效期限 / 狀態 -->
                <td class="py-3 px-4 text-center">
                  <div class="font-mono text-slate-600 text-[11px]">{{ t.expiryDate }}</div>
                  <div class="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[10px] mt-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    啟用中
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
                <td colspan="8" class="py-12 text-center text-slate-400">
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
          全校教師共 <span class="font-bold text-slate-800">{{ allTeacherList.length }}</span> 位，符合篩選條件：<span class="font-bold text-[#52796f]">{{ filteredTeacherList.length }}</span> 位
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

    <!-- ============================================== -->
    <!-- MODAL 1: 新增 / 編輯教師帳號 (保留舊版完整欄位) -->
    <!-- ============================================== -->
    <el-dialog
      v-model="createDialogVisible"
      :title="isEditMode ? '編輯教師帳號資訊' : '新增校內教師帳號'"
      width="560px"
      append-to-body
      destroy-on-close
      class="rounded-2xl overflow-hidden"
    >
      <form @submit.prevent="saveTeacher" class="space-y-4 text-xs">
        <!-- 權限身分 (舊版 Radio) -->
        <div>
          <label class="block font-bold text-slate-700 mb-1.5">
            權限身分 <span class="text-rose-500">*</span>
          </label>
          <div class="bg-slate-50/70 border border-slate-200 rounded-xl p-3 space-y-2">
            <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input type="radio" v-model="teacherForm.role" value="班級導師" class="text-[#52796f]" />
              <span>班級導師 (擔任單一班級導師)</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input type="radio" v-model="teacherForm.role" value="科任教師" class="text-[#52796f]" />
              <span>科任教師 (未擔任班導，僅教授特定學科)</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input type="radio" v-model="teacherForm.role" value="授課教師" class="text-[#52796f]" />
              <span>授課教師 (兼任導師身分，亦教授其它班級特定學科)</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input type="radio" v-model="teacherForm.role" value="學年主任" class="text-[#52796f]" />
              <span>學年主任 (負責全學年年段施測與成績檢閱)</span>
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
              使用者名稱 / 帳號 <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="teacherForm.username"
              type="text"
              required
              placeholder="例：t_chen08"
              class="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f]"
            />
          </div>
        </div>

        <!-- 授課年級 & 班級/科目 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">授課年級</label>
            <select
              v-model="teacherForm.grade"
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
            <label class="block font-bold text-slate-700 mb-1">任教班級 / 科目說明</label>
            <input
              v-model="teacherForm.assignedClass"
              type="text"
              placeholder="例：五年1班 或 數學科任"
              class="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f]"
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

        <!-- 帳號有效起訖日 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">帳號有效起日</label>
            <input
              v-model="teacherForm.startDate"
              type="date"
              class="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f]"
            />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">帳號有效迄日</label>
            <input
              v-model="teacherForm.endDate"
              type="date"
              class="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg outline-none focus:border-[#52796f]"
            />
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            @click="createDialogVisible = false"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-5 py-2 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer active:scale-95"
          >
            {{ isEditMode ? '儲存變更' : '確認新增' }}
          </button>
        </div>
      </form>
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
// 1. 教師帳號管理 (新舊融合旗艦版)
// ==========================================
const teacherFilters = reactive({
  year: '115',
  role: 'all',
  grade: 'all',
  keyword: ''
})

const teacherCurrentPage = ref(1)
const teacherPageSize = ref(8)

const allTeacherList = ref([
  {
    id: 1,
    selected: false,
    name: `${state.school}_校長`,
    adminCode: 'PAdmin_054628',
    role: '校長',
    grade: 'all',
    assignedClass: '全校業務統整',
    email: 'principal@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 2,
    selected: false,
    name: '陳○廷',
    adminCode: 'DAdmin_014628',
    role: '學年主任',
    grade: '1',
    assignedClass: '一年級全年級',
    email: 'grade1@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 3,
    selected: false,
    name: '林○萱',
    adminCode: 'DAdmin_024628',
    role: '學年主任',
    grade: '2',
    assignedClass: '二年級全年級',
    email: 'grade2@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 4,
    selected: false,
    name: '張○恩',
    adminCode: 'DAdmin_034628',
    role: '學年主任',
    grade: '3',
    assignedClass: '三年級全年級',
    email: 'grade3@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 5,
    selected: false,
    name: '王○晴',
    adminCode: 'TAdmin_301001',
    role: '班級導師',
    grade: '3',
    assignedClass: '三年 1 班',
    email: 'wang@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 6,
    selected: false,
    name: '李○哲',
    adminCode: 'TAdmin_302002',
    role: '班級導師',
    grade: '3',
    assignedClass: '三年 2 班',
    email: 'lee@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 7,
    selected: false,
    name: '許○婷',
    adminCode: 'TAdmin_401003',
    role: '科任教師',
    grade: '4',
    assignedClass: '四年級 (數學科任)',
    email: 'hsu@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 8,
    selected: false,
    name: '趙○芬',
    adminCode: 'TAdmin_501004',
    role: '班級導師',
    grade: '5',
    assignedClass: '五年 1 班',
    email: 'chao@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 9,
    selected: false,
    name: '周○廷',
    adminCode: 'TAdmin_502005',
    role: '授課教師',
    grade: '5',
    assignedClass: '五年 2 班兼國語科任',
    email: 'chou@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  },
  {
    id: 10,
    selected: false,
    name: '謝○睿',
    adminCode: 'TAdmin_601006',
    role: '科任教師',
    grade: '6',
    assignedClass: '六年級 (英語文科任)',
    email: 'hsieh@ntcu.edu.tw',
    expiryDate: '2027/07/31'
  }
])

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
    // 身分群組篩選
    if (teacherFilters.role !== 'all' && t.role !== teacherFilters.role) {
      return false
    }
    // 授課年級篩選
    if (teacherFilters.grade !== 'all' && t.grade !== teacherFilters.grade && t.grade !== 'all') {
      return false
    }
    // 關鍵字搜尋
    if (teacherFilters.keyword.trim()) {
      const kw = teacherFilters.keyword.trim().toLowerCase()
      const matchName = t.name.toLowerCase().includes(kw)
      const matchCode = t.adminCode.toLowerCase().includes(kw)
      const matchEmail = t.email.toLowerCase().includes(kw)
      const matchClass = t.assignedClass.toLowerCase().includes(kw)
      if (!matchName && !matchCode && !matchEmail && !matchClass) {
        return false
      }
    }
    return true
  })
})

// 分頁切片
const paginatedTeacherList = computed(() => {
  const start = (teacherCurrentPage.value - 1) * teacherPageSize.value
  return filteredTeacherList.value.slice(start, start + teacherPageSize.value)
})

function handleTeacherFilterChange() {
  teacherCurrentPage.value = 1
}

function resetTeacherFilters() {
  teacherFilters.year = '115'
  teacherFilters.role = 'all'
  teacherFilters.grade = 'all'
  teacherFilters.keyword = ''
  teacherCurrentPage.value = 1
  ElMessage.info('已重設教師篩選條件')
}

// 勾選批次控制
const selectedTeacherCount = computed(() => {
  return allTeacherList.value.filter(t => t.selected).length
})

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
  const count = selectedTeacherCount.value
  ElMessage.success(`已成功匯出所選取的【${count} 位教師帳號名冊】EXCEL 檔案！`)
}

function batchResetTeacherPw() {
  const count = selectedTeacherCount.value
  ElMessage.success(`已將所選取的【${count} 位教師密碼】批次重設為預設值：saaa.ntcu`)
  cancelSelectAll()
}

function resetTeacherPw(name) {
  ElMessage.success(`已重設【${name}】教師密碼為預設值：saaa.ntcu`)
}

// ==========================================
// 彈窗 1：新增 / 編輯教師帳號
// ==========================================
const createDialogVisible = ref(false)
const isEditMode = ref(false)
const currentEditingId = ref(null)

const teacherForm = reactive({
  role: '班級導師',
  name: '',
  username: '',
  grade: '3',
  assignedClass: '',
  email: '',
  startDate: '2026-10-06',
  endDate: '2027-07-31'
})

function openCreateTeacherModal() {
  isEditMode.value = false
  currentEditingId.value = null
  teacherForm.role = '班級導師'
  teacherForm.name = ''
  teacherForm.username = ''
  teacherForm.grade = '3'
  teacherForm.assignedClass = ''
  teacherForm.email = ''
  teacherForm.startDate = '2026-10-06'
  teacherForm.endDate = '2027-07-31'
  createDialogVisible.value = true
}

function openEditTeacherModal(t) {
  isEditMode.value = true
  currentEditingId.value = t.id
  teacherForm.role = t.role
  teacherForm.name = t.name
  teacherForm.username = t.adminCode
  teacherForm.grade = t.grade !== 'all' ? t.grade : '3'
  teacherForm.assignedClass = t.assignedClass
  teacherForm.email = t.email
  teacherForm.startDate = '2026-10-06'
  teacherForm.endDate = t.expiryDate.replace(/\//g, '-')
  createDialogVisible.value = true
}

function saveTeacher() {
  if (!teacherForm.name || !teacherForm.username || !teacherForm.email) {
    ElMessage.warning('請填寫完整必填欄位')
    return
  }

  if (isEditMode.value && currentEditingId.value) {
    const item = allTeacherList.value.find(t => t.id === currentEditingId.value)
    if (item) {
      item.name = teacherForm.name
      item.role = teacherForm.role
      item.grade = teacherForm.grade
      item.assignedClass = teacherForm.assignedClass || `${teacherForm.grade}年級`
      item.email = teacherForm.email
      item.expiryDate = teacherForm.endDate.replace(/-/g, '/')
      ElMessage.success(`已更新【${item.name}】教師帳號資訊！`)
    }
  } else {
    allTeacherList.value.unshift({
      id: Date.now(),
      selected: false,
      name: teacherForm.name,
      adminCode: `TAdmin_${Math.floor(100000 + Math.random() * 900000)}`,
      role: teacherForm.role,
      grade: teacherForm.grade,
      assignedClass: teacherForm.assignedClass || `${teacherForm.grade}年級`,
      email: teacherForm.email,
      expiryDate: teacherForm.endDate.replace(/-/g, '/')
    })
    ElMessage.success(`成功建立教師帳號：${teacherForm.name}，並已發送通知信！`)
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

function uploadBatch() {
  if (!selectedFileName.value) {
    ElMessage.warning('請先選擇要上傳的 Excel 檔案！')
    return
  }
  ElMessage.success(`檔案【${selectedFileName.value}】批次解析完成，已成功匯入教師帳號並寄送通知信！`)
  selectedFileName.value = ''
  batchDialogVisible.value = false
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
