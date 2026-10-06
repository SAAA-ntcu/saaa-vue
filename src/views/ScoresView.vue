<template>
  <div class="w-full max-w-5xl mx-auto p-2 md:p-6 bg-white/80 backdrop-blur-xs rounded-2xl">
    <!-- Header title -->
    <div class="mb-4 md:mb-6 pb-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-[#52796f]/10 text-[#52796f] flex items-center justify-center shrink-0 shadow-xs">
          <!-- Analytics / Chart SVG -->
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl md:text-2xl font-black text-slate-800 tracking-wider m-0">
            成績專區
            <span class="text-xs md:text-sm font-medium text-slate-400 ml-1 font-mono">Score Reports & Analytics</span>
          </h2>
          <div class="h-1 w-8 bg-[#52796f] rounded-full mt-1"></div>
        </div>
      </div>

      <!-- Notice Alert -->
      <div class="bg-amber-50/80 border border-amber-200/80 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs text-amber-800">
        <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>成績查詢及下載功能僅以三年為限，請於期限內自行下載留存。</span>
      </div>
    </div>

    <!-- Navigation Tabs matching Dropdown Fields -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-100 scrollbar-none">
      <button
        v-for="t in scoreTabs"
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

    <!-- TAB 1: 學生成績查詢 (預設) -->
    <div v-if="activeTab === 'inquiry'">
      <!-- Filter Form -->
      <div class="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 sm:p-5 mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <!-- School Year -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">年度</label>
            <select
              v-model="filters.year"
              class="w-full h-10 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition"
            >
              <option value="115">115 年度</option>
              <option value="114">114 年度</option>
              <option value="113">113 年度</option>
            </select>
          </div>

          <!-- Grade -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">施測年級</label>
            <select
              v-model="filters.grade"
              class="w-full h-10 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition"
            >
              <option value="all">全學年</option>
              <option value="3">三年級</option>
              <option value="4">四年級</option>
              <option value="5">五年級</option>
              <option value="6">六年級</option>
            </select>
          </div>

          <!-- Subject -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">施測科目</label>
            <select
              v-model="filters.subject"
              class="w-full h-10 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition"
            >
              <option value="all">全部科目</option>
              <option value="國語文">國語文</option>
              <option value="數學">數學</option>
              <option value="英語文">英語文</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-end gap-2">
            <button
              @click="handleQuery"
              class="flex-1 h-10 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              查詢成績
            </button>
            <button
              @click="downloadAll"
              class="h-10 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              title="匯出查詢結果"
            >
              <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              匯出
            </button>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs bg-white">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th class="py-3.5 px-4">年度</th>
                <th class="py-3.5 px-4">年級/班級</th>
                <th class="py-3.5 px-4">科目</th>
                <th class="py-3.5 px-4 text-center">應測人數</th>
                <th class="py-3.5 px-4 text-center">實測人數</th>
                <th class="py-3.5 px-4 text-center">平均分數</th>
                <th class="py-3.5 px-4 text-center">通過率</th>
                <th class="py-3.5 px-4 text-center">報告下載</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              <tr v-for="item in tableData" :key="item.id" class="hover:bg-slate-50/60 transition">
                <td class="py-3 px-4 font-mono text-slate-500">{{ item.year }}</td>
                <td class="py-3 px-4 font-bold text-slate-800">{{ item.gradeClass }}</td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                    :class="item.subject === '國語文' ? 'bg-amber-50 text-amber-700 border border-amber-200' : item.subject === '數學' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'"
                  >
                    {{ item.subject }}
                  </span>
                </td>
                <td class="py-3 px-4 text-center font-mono">{{ item.expected }}</td>
                <td class="py-3 px-4 text-center font-mono">{{ item.actual }}</td>
                <td class="py-3 px-4 text-center font-mono font-bold text-[#52796f]">{{ item.average }}</td>
                <td class="py-3 px-4 text-center">
                  <div class="inline-flex items-center gap-1.5">
                    <div class="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div class="bg-[#52796f] h-full rounded-full" :style="{ width: item.passRate }"></div>
                    </div>
                    <span class="font-mono text-[11px] font-bold text-slate-600">{{ item.passRate }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    @click="downloadReport(item)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#52796f] text-[#52796f] hover:text-white border border-[#52796f]/40 hover:border-[#52796f] rounded-lg transition text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    清冊
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: 各級報表下載 -->
    <div v-else-if="activeTab === 'reports'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="rpt in reportCards" :key="rpt.title" class="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div class="w-9 h-9 rounded-xl bg-[#52796f]/10 text-[#52796f] flex items-center justify-center mb-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 class="text-sm font-bold text-slate-800 mb-1">{{ rpt.title }}</h4>
            <p class="text-xs text-slate-500 leading-relaxed">{{ rpt.desc }}</p>
          </div>
          <button @click="downloadSpecialReport(rpt.title)" class="mt-4 w-full py-2 bg-[#52796f] hover:bg-[#354f52] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下載檔案 (PDF/XLSX)
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 3: 年度成果報告 (依據圖一成果報告矩陣與評量架構/試題公告互動邏輯) -->
    <div v-else-if="activeTab === 'annual'" class="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative">
      <!-- Header title matching Image 1 -->
      <div class="text-center mb-5 shrink-0">
        <h3 class="text-2xl font-bold text-slate-800 tracking-wide m-0">成果報告</h3>
        <div class="w-12 h-1 bg-[#52796f] mx-auto mt-2 rounded-full"></div>
      </div>

      <!-- Year Selection & Batch Selection Controls Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 shrink-0 px-1">
        <!-- Year Selection Tabs -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 whitespace-nowrap max-w-full">
          <button
            v-for="year in annualReportYears"
            :key="year"
            type="button"
            @click="changeAnnualYear(year)"
            class="px-3 py-1.5 border rounded-lg transition transform active:scale-95 duration-150 font-medium text-xs md:text-sm cursor-pointer"
            :class="selectedAnnualYear === year
              ? 'bg-[#52796f] text-white border-[#52796f] shadow-xs'
              : 'border-slate-300 text-slate-600 bg-white hover:border-[#52796f] hover:text-[#52796f]'"
          >
            {{ year }}年
          </button>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex items-center gap-2 text-xs shrink-0">
          <button
            type="button"
            @click="toggleSelectAllAnnualYear"
            class="px-3 py-1.5 border rounded-lg transition font-medium cursor-pointer shadow-2xs"
            :class="isAllCurrentAnnualYearSelected
              ? 'bg-[#52796f]/15 border-[#52796f] text-[#354f52]'
              : 'bg-white border-slate-200 text-slate-700 hover:border-[#52796f] hover:text-[#52796f]'"
          >
            {{ isAllCurrentAnnualYearSelected ? '取消當年度全選' : `全選 ${selectedAnnualYear} 年度成果報告 (${currentYearAvailableCount}份)` }}
          </button>
          <button
            v-if="selectedAnnualCount > 0"
            type="button"
            @click="clearAnnualSelection"
            class="px-2.5 py-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            清除勾選 ({{ selectedAnnualCount }})
          </button>
        </div>
      </div>

      <!-- Data Matrix Table matching Image 1 -->
      <div class="w-full overflow-x-auto border border-slate-200/80 shadow-md rounded-xl bg-white mb-6">
        <table class="w-full text-center border-collapse min-w-[760px]">
          <thead>
            <tr class="text-xs md:text-sm font-bold text-white">
              <th class="bg-[#52796f] py-3.5 px-3 tracking-wider text-left pl-5 w-28">
                科目
                <span class="text-[10px] font-normal opacity-80 block font-mono">點擊列首全選</span>
              </th>
              <th
                v-for="grade in annualGradesHeader"
                :key="grade.key"
                @click="isGradeHasAvailableItems(grade.key) ? toggleSelectAnnualGrade(grade.key) : null"
                class="bg-[#52796f] py-3.5 px-2 tracking-wider select-none transition group"
                :class="isGradeHasAvailableItems(grade.key) ? 'cursor-pointer hover:bg-[#43645b]' : 'cursor-default opacity-85'"
                :title="isGradeHasAvailableItems(grade.key) ? `點擊全選/取消 ${grade.label}` : `${grade.label} 本年度未施測`"
              >
                <div class="flex items-center justify-center gap-1.5">
                  <span>{{ grade.label }}</span>
                  <span
                    v-if="isGradeHasAvailableItems(grade.key)"
                    class="w-3.5 h-3.5 rounded border border-white/60 flex items-center justify-center text-[10px] transition-colors"
                    :class="isGradeAllSelected(grade.key) ? 'bg-white text-[#52796f]' : 'bg-transparent text-transparent'"
                  >
                    ✓
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs md:text-sm font-medium text-slate-700 bg-white">
            <tr
              v-for="subject in annualReportSubjects"
              :key="subject.name"
              class="hover:bg-slate-50/60 transition"
            >
              <!-- Subject Row Header (Clickable to select whole row if available items exist) -->
              <td
                @click="isSubjectHasAvailableItems(subject.name) ? toggleSelectAnnualSubject(subject.name) : null"
                class="font-bold py-3 px-5 text-slate-800 bg-slate-50/70 select-none text-left transition"
                :class="isSubjectHasAvailableItems(subject.name) ? 'cursor-pointer hover:bg-[#52796f]/10' : 'cursor-default'"
                :title="isSubjectHasAvailableItems(subject.name) ? `點擊全選/取消 ${subject.name}` : `${subject.name} 本年度無施測年級`"
              >
                <div class="flex items-center justify-between gap-2">
                  <span>{{ subject.name }}</span>
                  <span
                    v-if="isSubjectHasAvailableItems(subject.name)"
                    class="w-3.5 h-3.5 rounded border border-slate-300 flex items-center justify-center text-[10px] transition-colors"
                    :class="isSubjectAllSelected(subject.name) ? 'bg-[#52796f] border-[#52796f] text-white' : 'bg-white text-transparent'"
                  >
                    ✓
                  </span>
                </div>
              </td>

              <!-- Grade Cells -->
              <td
                v-for="grade in annualGradesHeader"
                :key="grade.key"
                class="py-3 px-2 transition-colors relative"
                :class="isAnnualSelected(grade.key, subject.name) ? 'bg-[#52796f]/10 ring-1 ring-inset ring-[#52796f]/25' : ''"
              >
                <!-- Available: Checkbox + Download Button matching Screenshot 1 -->
                <div v-if="isAnnualReportAvailable(selectedAnnualYear, grade.key, subject.name)" class="flex items-center justify-center gap-2">
                  <input
                    type="checkbox"
                    :checked="isAnnualSelected(grade.key, subject.name)"
                    @change="toggleAnnualItem(grade.key, subject.name, grade.label)"
                    class="w-4 h-4 rounded border-slate-300 text-[#52796f] focus:ring-[#52796f]/30 cursor-pointer accent-[#52796f]"
                    :aria-label="`選取 ${selectedAnnualYear}年 ${grade.label} ${subject.name}`"
                  />
                  <button
                    type="button"
                    @click="downloadSingleAnnualReport(selectedAnnualYear, grade.label, subject.name)"
                    class="inline-flex items-center gap-1 py-1 px-2 rounded-md text-amber-700 hover:text-amber-800 hover:bg-amber-50/80 transition cursor-pointer text-xs font-semibold group/btn"
                    title="點擊單檔下載成果報告"
                  >
                    <svg class="w-3.5 h-3.5 text-amber-600 transition group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    <span class="underline decoration-amber-300 group-hover/btn:decoration-amber-600">下載</span>
                  </button>
                </div>

                <!-- Not Available: Prohibited icon 🚫 (未施測) matching Screenshot 1 -->
                <div v-else class="flex items-center justify-center text-slate-300 select-none py-1" title="未施測 / 無資料">
                  <span class="text-rose-400 text-lg leading-none select-none" aria-label="未施測">🚫</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Whole-school summary report shortcut card -->
      <div class="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#52796f]/10 text-[#52796f] flex items-center justify-center shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div class="text-xs font-bold text-slate-800">{{ selectedAnnualYear }} 年度全校施測成果總報告書</div>
            <div class="text-[11px] text-slate-500">彙整全校各年級整體學力指標達成率及縣市常模參照比對分析。</div>
          </div>
        </div>
        <button
          @click="downloadSpecialReport(`${selectedAnnualYear}年度成果總報告書`)"
          class="px-3.5 py-1.5 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下載全校總報告 (PDF)
        </button>
      </div>

      <!-- Floating Batch Download Bar -->
      <transition name="slide-up">
        <div
          v-if="selectedAnnualCount > 0"
          class="sticky bottom-2 left-0 right-0 z-20 mx-auto max-w-xl bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-white/10 mt-4"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-lg">📦</span>
            <div class="text-xs sm:text-sm font-medium truncate">
              已勾選 <span class="font-bold text-[#e9c46a] text-base">{{ selectedAnnualCount }}</span> 個成果報告
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              @click="clearAnnualSelection"
              class="px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              @click="handleAnnualBatchDownload"
              :disabled="isAnnualDownloading"
              class="px-4 py-1.5 bg-[#52796f] hover:bg-[#43645b] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <svg v-if="!isAnnualDownloading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span v-if="isAnnualDownloading">下載中 ({{ annualDownloadProgress.current }}/{{ annualDownloadProgress.total }})...</span>
              <span v-else>批量下載 ({{ selectedAnnualCount }})</span>
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- TAB 4: 試題分析結果 -->
    <div v-else-if="activeTab === 'analysis'" class="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <h3 class="text-base font-bold text-slate-800 mb-2">試題難易度與鑑別度分析</h3>
      <p class="text-xs text-slate-500 mb-4">針對國語文、數學、英語文各題答對率(P值)及鑑別指標(D值)進行精準診斷。</p>
      <div class="flex items-center gap-3">
        <button @click="downloadSpecialReport('試題難易度分佈清單')" class="px-4 py-2 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
          下載試題分析矩陣表 (EXCEL)
        </button>
      </div>
    </div>

    <!-- TAB 5: 背景資料分析 -->
    <div v-else-if="activeTab === 'background'" class="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <h3 class="text-base font-bold text-slate-800 mb-2">背景變項與學力表現關聯分析</h3>
      <p class="text-xs text-slate-500 mb-4">深入比對學生家庭數位環境、閱讀自主習慣與學科表現之交叉交叉統計分析。</p>
      <div class="flex items-center gap-3">
        <button @click="downloadSpecialReport('背景資料交叉分析表')" class="px-4 py-2 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer">
          下載背景分析圖表 (PDF)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  annualReportYears,
  annualReportSubjects,
  annualGradesHeader,
  isAnnualReportAvailable,
  getAnnualReportDownloadUrl
} from '../data/annualReportData'
import { downloadMultipleFiles } from '../utils/batchDownloader'

const route = useRoute()
const router = useRouter()

const scoreTabs = [
  { key: 'inquiry', title: '學生成績查詢' },
  { key: 'reports', title: '各級報表下載' },
  { key: 'annual', title: '年度成果報告' },
  { key: 'analysis', title: '試題分析結果' },
  { key: 'background', title: '背景資料分析' }
]

const activeTab = ref(route.query.tab || 'inquiry')

watch(() => route.query.tab, (newTab) => {
  if (newTab && scoreTabs.some(t => t.key === newTab)) {
    activeTab.value = newTab
  }
})

function switchTab(key) {
  activeTab.value = key
  router.replace({ query: { ...route.query, tab: key } })
}

const filters = reactive({
  year: '115',
  grade: 'all',
  subject: 'all'
})

const tableData = ref([
  { id: 1, year: '115', gradeClass: '五年1班', subject: '國語文', expected: 28, actual: 28, average: '84.2', passRate: '89.3%' },
  { id: 2, year: '115', gradeClass: '五年1班', subject: '數學', expected: 28, actual: 27, average: '79.6', passRate: '82.1%' },
  { id: 3, year: '115', gradeClass: '五年1班', subject: '英語文', expected: 28, actual: 28, average: '88.5', passRate: '92.9%' },
  { id: 4, year: '115', gradeClass: '五年2班', subject: '國語文', expected: 27, actual: 27, average: '82.8', passRate: '85.2%' },
  { id: 5, year: '115', gradeClass: '五年2班', subject: '數學', expected: 27, actual: 27, average: '81.4', passRate: '85.2%' },
  { id: 6, year: '115', gradeClass: '五年2班', subject: '英語文', expected: 27, actual: 26, average: '86.1', passRate: '88.9%' },
  { id: 7, year: '115', gradeClass: '六年1班', subject: '國語文', expected: 29, actual: 29, average: '86.3', passRate: '93.1%' },
  { id: 8, year: '115', gradeClass: '六年1班', subject: '數學', expected: 29, actual: 29, average: '83.7', passRate: '89.7%' }
])

const reportCards = [
  { title: '全校整體成績總冊', desc: '包含各年級、班級之全科平均分數、到考率與五標常模比對總覽。' },
  { title: '年級別學力報告書', desc: '針對單一年級進行各班表現、能力指標通過率分析之主管報表。' },
  { title: '班級成績通知單清冊', desc: '可直接列印提供導師與學生家長之個別成績診斷通知單。' }
]

function handleQuery() {
  ElMessage.success('已更新查詢條件')
}

function downloadReport(item) {
  ElMessage.success(`開始下載【${item.gradeClass} ${item.subject}】成績清冊 PDF`)
}

function downloadAll() {
  ElMessage.success('已打包匯出全體選取成績清冊 EXCEL')
}

function downloadSpecialReport(name) {
  ElMessage.success(`正在產生並下載【${name}】...`)
}

// ----------------------------------------------------
// TAB 3: 年度成果報告狀態與互動邏輯 (對齊評量架構/試題公告)
// ----------------------------------------------------
const selectedAnnualYear = ref('115')
const selectedAnnualMap = reactive(new Map())
const isAnnualDownloading = ref(false)
const annualDownloadProgress = reactive({ current: 0, total: 0 })

function getAnnualItemKey(year, gradeKey, subjectName) {
  return `${year}_${subjectName}_${gradeKey}`
}

function getAnnualItemObject(year, gradeKey, subjectName, gradeLabel) {
  return {
    key: getAnnualItemKey(year, gradeKey, subjectName),
    year,
    gradeKey,
    subjectName,
    gradeLabel,
    name: `${year}年度縣市學生學習能力檢測成果報告_${gradeLabel}_${subjectName}.pdf`,
    url: getAnnualReportDownloadUrl(year, gradeLabel, subjectName)
  }
}

function isAnnualSelected(gradeKey, subjectName) {
  return selectedAnnualMap.has(getAnnualItemKey(selectedAnnualYear.value, gradeKey, subjectName))
}

function toggleAnnualItem(gradeKey, subjectName, gradeLabel) {
  const key = getAnnualItemKey(selectedAnnualYear.value, gradeKey, subjectName)
  if (selectedAnnualMap.has(key)) {
    selectedAnnualMap.delete(key)
  } else {
    selectedAnnualMap.set(key, getAnnualItemObject(selectedAnnualYear.value, gradeKey, subjectName, gradeLabel))
  }
}

const currentYearAvailableItems = computed(() => {
  const list = []
  annualGradesHeader.forEach((g) => {
    annualReportSubjects.forEach((s) => {
      if (isAnnualReportAvailable(selectedAnnualYear.value, g.key, s.name)) {
        list.push({ gradeKey: g.key, gradeLabel: g.label, subjectName: s.name })
      }
    })
  })
  return list
})

const currentYearAvailableCount = computed(() => currentYearAvailableItems.value.length)

const isAllCurrentAnnualYearSelected = computed(() => {
  if (currentYearAvailableItems.value.length === 0) return false
  return currentYearAvailableItems.value.every((item) =>
    selectedAnnualMap.has(getAnnualItemKey(selectedAnnualYear.value, item.gradeKey, item.subjectName))
  )
})

function toggleSelectAllAnnualYear() {
  const allSelected = isAllCurrentAnnualYearSelected.value
  currentYearAvailableItems.value.forEach((item) => {
    const key = getAnnualItemKey(selectedAnnualYear.value, item.gradeKey, item.subjectName)
    if (allSelected) {
      selectedAnnualMap.delete(key)
    } else {
      selectedAnnualMap.set(key, getAnnualItemObject(selectedAnnualYear.value, item.gradeKey, item.subjectName, item.gradeLabel))
    }
  })
}

function isGradeHasAvailableItems(gradeKey) {
  return annualReportSubjects.some((s) => isAnnualReportAvailable(selectedAnnualYear.value, gradeKey, s.name))
}

function isGradeAllSelected(gradeKey) {
  const avail = annualReportSubjects.filter((s) => isAnnualReportAvailable(selectedAnnualYear.value, gradeKey, s.name))
  if (avail.length === 0) return false
  return avail.every((s) => selectedAnnualMap.has(getAnnualItemKey(selectedAnnualYear.value, gradeKey, s.name)))
}

function toggleSelectAnnualGrade(gradeKey) {
  const gradeObj = annualGradesHeader.find((g) => g.key === gradeKey)
  const avail = annualReportSubjects.filter((s) => isAnnualReportAvailable(selectedAnnualYear.value, gradeKey, s.name))
  if (avail.length === 0) return
  const allSelected = isGradeAllSelected(gradeKey)
  avail.forEach((s) => {
    const key = getAnnualItemKey(selectedAnnualYear.value, gradeKey, s.name)
    if (allSelected) {
      selectedAnnualMap.delete(key)
    } else {
      selectedAnnualMap.set(key, getAnnualItemObject(selectedAnnualYear.value, gradeKey, s.name, gradeObj?.label || gradeKey))
    }
  })
}

function isSubjectHasAvailableItems(subjectName) {
  return annualGradesHeader.some((g) => isAnnualReportAvailable(selectedAnnualYear.value, g.key, subjectName))
}

function isSubjectAllSelected(subjectName) {
  const avail = annualGradesHeader.filter((g) => isAnnualReportAvailable(selectedAnnualYear.value, g.key, subjectName))
  if (avail.length === 0) return false
  return avail.every((g) => selectedAnnualMap.has(getAnnualItemKey(selectedAnnualYear.value, g.key, subjectName)))
}

function toggleSelectAnnualSubject(subjectName) {
  const avail = annualGradesHeader.filter((g) => isAnnualReportAvailable(selectedAnnualYear.value, g.key, subjectName))
  if (avail.length === 0) return
  const allSelected = isSubjectAllSelected(subjectName)
  avail.forEach((g) => {
    const key = getAnnualItemKey(selectedAnnualYear.value, g.key, subjectName)
    if (allSelected) {
      selectedAnnualMap.delete(key)
    } else {
      selectedAnnualMap.set(key, getAnnualItemObject(selectedAnnualYear.value, g.key, subjectName, g.label))
    }
  })
}

const selectedAnnualCount = computed(() => selectedAnnualMap.size)

function clearAnnualSelection() {
  selectedAnnualMap.clear()
}

function changeAnnualYear(year) {
  selectedAnnualYear.value = year
}

function downloadSingleAnnualReport(year, gradeLabel, subject) {
  const url = getAnnualReportDownloadUrl(year, gradeLabel, subject)
  const filename = `${year}年度縣市學生學習能力檢測成果報告_${gradeLabel}_${subject}.pdf`
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success(`開始下載【${year}年度 ${gradeLabel} ${subject}】成果報告`)
}

async function handleAnnualBatchDownload() {
  if (selectedAnnualCount.value === 0) return
  const files = Array.from(selectedAnnualMap.values())
  isAnnualDownloading.value = true
  annualDownloadProgress.current = 0
  annualDownloadProgress.total = files.length

  try {
    await downloadMultipleFiles(files, (curr, tot) => {
      annualDownloadProgress.current = curr
      annualDownloadProgress.total = tot
    })
    clearAnnualSelection()
  } finally {
    isAnnualDownloading.value = false
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
