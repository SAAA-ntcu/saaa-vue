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

      <div class="flex flex-col items-end gap-2">
        <!-- Notice Alert -->
        <div class="bg-amber-50/80 border border-amber-200/80 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs text-amber-800">
          <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>成績查詢及下載功能僅以三年為限，請於期限內自行下載留存。</span>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs matching Dropdown Fields -->
    <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-100 scrollbar-none">
      <button
        v-for="t in visibleScoreTabs"
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
      <InquiryDrillDown />
    </div>

    <!-- TAB 2: 各級報表下載 (方案 A: 報表矩陣下載總覽) -->
    <div v-else-if="activeTab === 'reports'" class="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative">
      <!-- Header title -->
      <div class="text-center mb-5 shrink-0">
        <h3 class="text-2xl font-bold text-slate-800 tracking-wide m-0">各級報表下載</h3>
        <div class="w-12 h-1 bg-[#52796f] mx-auto mt-2 rounded-full"></div>
        <p class="text-xs text-slate-500 mt-2">全校、年級、班級與個別學生 5 大分析報表矩陣下載專區</p>
      </div>

      <!-- Controls & Quick Actions Bar -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-5 shrink-0 px-1">
        <!-- Year Selector (3 Years Only) -->
        <div class="flex items-center gap-2 flex-wrap">
          <YearSelector
            v-model="selectedReportYear"
            :years="reportYears"
            @change="changeReportYear"
          />
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex items-center gap-2 text-xs flex-wrap">
          <button
            type="button"
            @click="toggleSelectAllReports"
            class="px-3 py-1.5 border rounded-lg transition font-medium cursor-pointer shadow-2xs"
            :class="isAllReportsSelected
              ? 'bg-[#52796f]/15 border-[#52796f] text-[#354f52]'
              : 'bg-white border-slate-200 text-slate-700 hover:border-[#52796f] hover:text-[#52796f]'"
          >
            {{ isAllReportsSelected ? '取消全選' : `全選當年度所有報表 (${allAvailableReports.length}份)` }}
          </button>
          <button
            v-if="selectedReportCount > 0"
            type="button"
            @click="clearReportSelection"
            class="px-2.5 py-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            清除勾選 ({{ selectedReportCount }})
          </button>
          <button
            type="button"
            @click="downloadAllSchoolPackage"
            class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="打包下載全校當年度所有各級報表"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>一鍵全校打包</span>
          </button>
        </div>
      </div>

      <!-- Reports Matrix Table -->
      <div class="w-full overflow-x-auto border border-slate-200/80 shadow-md rounded-xl bg-white mb-6">
        <table class="w-full text-center border-collapse min-w-[860px]">
          <thead>
            <tr class="text-xs md:text-sm font-bold text-white">
              <!-- Paper Column Header -->
              <th class="bg-[#52796f] py-3.5 px-3 tracking-wider text-left pl-5 w-44">
                卷別 / 施測科目
                <span class="text-[10px] font-normal opacity-80 block font-mono">點擊列首可全選該卷</span>
              </th>

              <!-- 5 Report Type Headers (Clickable to select whole column) -->
              <th
                v-for="rpt in reportTypes"
                :key="rpt.key"
                @click="toggleSelectReportColumn(rpt.key)"
                class="bg-[#52796f] py-3.5 px-2 tracking-wider cursor-pointer hover:bg-[#43645b] transition select-none group"
                :title="`點擊全選/取消【${rpt.name}】所有卷別`"
              >
                <div class="flex items-center justify-center gap-1.5">
                  <span>{{ rpt.name }}</span>
                  <span
                    class="w-3.5 h-3.5 rounded border border-white/60 flex items-center justify-center text-[10px] transition-colors"
                    :class="isReportColumnAllSelected(rpt.key) ? 'bg-white text-[#52796f]' : 'bg-transparent text-transparent'"
                  >
                    ✓
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs md:text-sm font-medium text-slate-700 bg-white">
            <tr
              v-for="paper in paperGrades"
              :key="paper.key"
              class="hover:bg-slate-50/60 transition"
            >
              <!-- Paper Row Header (Clickable to select whole row) -->
              <td
                @click="toggleSelectPaperRow(paper.key)"
                class="font-bold py-3.5 px-5 text-slate-800 bg-slate-50/70 hover:bg-[#52796f]/10 cursor-pointer select-none text-left transition"
                :title="`點擊全選/取消【${paper.label}】所有報表`"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5">
                    <span
                      class="w-2 h-2 rounded-full"
                      :class="paper.subject === '國語文' ? 'bg-amber-500' : paper.subject === '數學' ? 'bg-sky-500' : 'bg-emerald-500'"
                    ></span>
                    <span>{{ paper.label }}</span>
                  </div>
                  <span
                    class="w-3.5 h-3.5 rounded border border-slate-300 flex items-center justify-center text-[10px] transition-colors"
                    :class="isPaperRowAllSelected(paper.key) ? 'bg-[#52796f] border-[#52796f] text-white' : 'bg-white text-transparent'"
                  >
                    ✓
                  </span>
                </div>
              </td>

              <!-- 5 Report Cells -->
              <td
                v-for="rpt in reportTypes"
                :key="rpt.key"
                class="py-3 px-2 transition-colors relative"
                :class="isReportSelected(paper.key, rpt.key) ? 'bg-[#52796f]/10 ring-1 ring-inset ring-[#52796f]/25' : ''"
              >
                <!-- Available Report Cell -->
                <div v-if="isReportTypeAvailable(paper.key, rpt.key)" class="flex items-center justify-center gap-2">
                  <input
                    type="checkbox"
                    :checked="isReportSelected(paper.key, rpt.key)"
                    @change="toggleReportItem(paper.key, rpt.key)"
                    class="w-4 h-4 rounded border-slate-300 text-[#52796f] focus:ring-[#52796f]/30 cursor-pointer accent-[#52796f]"
                    :aria-label="`選取 ${selectedReportYear}年 ${paper.label} ${rpt.name}`"
                  />
                  <!-- Direct Download Button -->
                  <button
                    type="button"
                    @click="downloadSingleReportFile(paper, rpt)"
                    class="inline-flex items-center gap-1 py-1 px-2 rounded-md text-amber-700 hover:text-amber-800 hover:bg-amber-50/80 transition cursor-pointer text-xs font-semibold group/btn"
                    :title="`下載 ${paper.label} ${rpt.name}`"
                  >
                    <svg class="w-3.5 h-3.5 text-amber-600 transition group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                    <span class="underline decoration-amber-300 group-hover/btn:decoration-amber-600">下載</span>
                  </button>
                </div>

                <!-- Unavailable Cell (e.g. 各校等級比例 for 3rd grade) -->
                <div v-else class="flex items-center justify-center text-slate-300 select-none py-1" title="未施測 / 該年級無各校等級比例常模">
                  <span class="text-rose-400 text-lg leading-none select-none" aria-label="未施測">🚫</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Quick Tips Card -->
      <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <span class="text-base">💡</span>
          <span>提示：點擊上方<strong>報表欄首</strong>可全選該報表之所有學段；點擊左側<strong>卷別列首</strong>可全選該學段之所有報表；支援個別勾選與批次下載。</span>
        </div>
      </div>

      <!-- Floating Batch Download Bar -->
      <transition name="slide-up">
        <div
          v-if="selectedReportCount > 0"
          class="sticky bottom-2 left-0 right-0 z-20 mx-auto max-w-xl bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-white/10 mt-4"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-lg">📦</span>
            <div class="text-xs sm:text-sm font-medium truncate">
              已勾選 <span class="font-bold text-[#e9c46a] text-base">{{ selectedReportCount }}</span> 個報表檔案
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              @click="clearReportSelection"
              class="px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              @click="handleBatchReportDownload"
              :disabled="isReportDownloading"
              class="px-4 py-1.5 bg-[#52796f] hover:bg-[#43645b] disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <svg v-if="!isReportDownloading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span v-if="isReportDownloading">下載中 ({{ reportDownloadProgress.current }}/{{ reportDownloadProgress.total }})...</span>
              <span v-else>批量下載 ({{ selectedReportCount }})</span>
            </button>
          </div>
        </div>
      </transition>
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
        <!-- Year Selection (Recent 3 Years Pills + Historical Dropdown) -->
        <YearSelector
          v-model="selectedAnnualYear"
          :years="annualReportYears"
          @change="changeAnnualYear"
        />

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
                v-for="grade in annualGradesHeader.filter(g => isGradeHasAvailableItems(g.key))"
                :key="grade.key"
                @click="toggleSelectAnnualGrade(grade.key)"
                class="bg-[#52796f] py-3.5 px-2 tracking-wider select-none transition group cursor-pointer hover:bg-[#43645b]"
                :title="`點擊全選/取消 ${grade.label}`"
              >
                <div class="flex items-center justify-center gap-1.5">
                  <span>{{ grade.label }}</span>
                  <span
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
              v-for="subject in annualReportSubjects.filter(s => isSubjectHasAvailableItems(s.name))"
              :key="subject.name"
              class="hover:bg-slate-50/60 transition"
            >
              <!-- Subject Row Header (Clickable to select whole row if available items exist) -->
              <td
                @click="toggleSelectAnnualSubject(subject.name)"
                class="font-bold py-3 px-5 text-slate-800 bg-slate-50/70 select-none text-left transition cursor-pointer hover:bg-[#52796f]/10"
                :title="`點擊全選/取消 ${subject.name}`"
              >
                <div class="flex items-center justify-between gap-2">
                  <span>{{ subject.name }}</span>
                  <span
                    class="w-3.5 h-3.5 rounded border border-slate-300 flex items-center justify-center text-[10px] transition-colors"
                    :class="isSubjectAllSelected(subject.name) ? 'bg-[#52796f] border-[#52796f] text-white' : 'bg-white text-transparent'"
                  >
                    ✓
                  </span>
                </div>
              </td>

              <!-- Grade Cells -->
              <td
                v-for="grade in annualGradesHeader.filter(g => isGradeHasAvailableItems(g.key))"
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
    <div v-else-if="activeTab === 'analysis'" class="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      
      <!-- Top Actions Bar -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div class="flex items-center gap-3 flex-wrap">
          <select v-model="analysisFilters.year" class="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition">
            <option value="115">115 年度</option>
            <option value="114">114 年度</option>
            <option value="113">113 年度</option>
          </select>
          <select v-model="analysisFilters.grade" class="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition">
            <option value="3">三年級</option>
            <option value="4">四年級</option>
            <option value="5">五年級</option>
            <option value="6">六年級</option>
          </select>
          <select v-model="analysisFilters.subject" class="h-9 px-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/20 transition">
            <option value="國語文">國語文</option>
            <option value="數學">數學</option>
            <option value="英語文">英語文</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <button @click="downloadSpecialReport('學校試題分析結果')" class="h-9 px-3 bg-[#52796f] hover:bg-[#354f52] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            學校試題分析結果
          </button>
          <button @click="downloadSpecialReport('縣市試題分析結果')" class="h-9 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            縣市試題分析結果
          </button>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="p-5 border-b border-slate-100 relative">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <svg class="w-4 h-4 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
            校級答對率圖
          </h4>
          <div class="flex items-center gap-4 text-xs font-medium">
            <div class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-[#52796f]"></span>學校</div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-[#e07a5f]"></span>縣市</div>
            <div class="flex items-center gap-1.5"><span class="w-3 h-0.5 bg-slate-300" style="border-top: 2px dashed #94a3b8"></span>整體</div>
          </div>
        </div>

        <div class="w-full overflow-x-auto scrollbar-thin py-2" @mouseleave="hoveredPoint = null">
          <div class="min-w-[720px] relative px-1">
            <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="w-full h-auto overflow-visible">
              <!-- Y Axis labels -->
              <g class="text-[10px] fill-slate-400 font-mono">
                <text :x="chartPadding.left - 10" :y="chartPadding.top + 4" text-anchor="end">100%</text>
                <text :x="chartPadding.left - 10" :y="(chartHeight - chartPadding.bottom + chartPadding.top) / 2 + 4" text-anchor="end">50%</text>
                <text :x="chartPadding.left - 10" :y="chartHeight - chartPadding.bottom + 4" text-anchor="end">0%</text>
              </g>
              
              <!-- Grid lines -->
              <g class="stroke-slate-100" stroke-width="1" stroke-dasharray="4 4">
                <line :x1="chartPadding.left" :y1="chartPadding.top" :x2="chartWidth - chartPadding.right" :y2="chartPadding.top" />
                <line :x1="chartPadding.left" :y1="(chartHeight - chartPadding.bottom + chartPadding.top) / 2" :x2="chartWidth - chartPadding.right" :y2="(chartHeight - chartPadding.bottom + chartPadding.top) / 2" />
                <line :x1="chartPadding.left" :y1="chartHeight - chartPadding.bottom" :x2="chartWidth - chartPadding.right" :y2="chartHeight - chartPadding.bottom" stroke-dasharray="none" class="stroke-slate-200" />
              </g>

              <!-- Overall Path -->
              <path :d="chartPaths.overall" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4" />
              <!-- County Path -->
              <path :d="chartPaths.county" fill="none" stroke="#e07a5f" stroke-width="2" />
              <!-- School Path -->
              <path :d="chartPaths.school" fill="none" stroke="#52796f" stroke-width="2.5" />

              <!-- Hover interaction area per point -->
              <g v-for="p in chartPoints" :key="'area-'+p.data.qNum">
                <rect 
                  :x="p.x - ((chartWidth - chartPadding.left - chartPadding.right) / Math.max(1, chartPoints.length - 1)) / 2" 
                  :y="chartPadding.top" 
                  :width="(chartWidth - chartPadding.left - chartPadding.right) / Math.max(1, chartPoints.length - 1)" 
                  :height="chartHeight - chartPadding.top - chartPadding.bottom" 
                  fill="transparent" 
                  class="cursor-pointer"
                  @mouseover="hoveredPoint = p"
                />
              </g>

              <!-- Points and Indicators -->
              <g v-for="p in chartPoints" :key="'pt-'+p.data.qNum">
                <!-- X Axis labels -->
                <text :x="p.x" :y="chartHeight - 12" text-anchor="middle" class="text-[10px] fill-slate-500 font-mono">{{ p.data.qNum }}</text>
                
                <!-- Highlight weak questions on X axis -->
                <circle v-if="p.isWeak" :cx="p.x" :cy="chartHeight - 26" r="3" fill="#e07a5f" />

                <!-- Hover state styling -->
                <g v-if="hoveredPoint && hoveredPoint.data.qNum === p.data.qNum">
                  <!-- Vertical guideline -->
                  <line :x1="p.x" :y1="chartPadding.top" :x2="p.x" :y2="chartHeight - chartPadding.bottom" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3" />
                  
                  <!-- Hovered Points -->
                  <circle :cx="p.x" :cy="p.overallY" r="4" fill="#fff" stroke="#94a3b8" stroke-width="2" />
                  <circle :cx="p.x" :cy="p.countyY" r="4" fill="#fff" stroke="#e07a5f" stroke-width="2" />
                  <circle :cx="p.x" :cy="p.schoolY" r="5" fill="#fff" stroke="#52796f" stroke-width="2.5" />
                </g>
                <g v-else>
                  <!-- Normal Points -->
                  <circle :cx="p.x" :cy="p.schoolY" r="3" fill="#52796f" />
                </g>
              </g>
            </svg>
            
            <!-- Tooltip (自動防切邊：上下自適應翻轉、左右安全邊界錨定) -->
            <div
              v-if="hoveredPoint && tooltipConfig"
              class="absolute z-30 bg-slate-900/95 backdrop-blur-sm text-white px-3.5 py-2.5 rounded-xl shadow-2xl border border-slate-700/80 text-xs pointer-events-none transition-all duration-150 min-w-[170px]"
              :class="[
                tooltipConfig.isUpperHalf ? 'mt-3.5 translate-y-0' : '-mt-3.5 -translate-y-full',
                tooltipConfig.horizontalAlign === 'left' ? 'translate-x-[-15%]' : tooltipConfig.horizontalAlign === 'right' ? 'translate-x-[-85%]' : '-translate-x-1/2'
              ]"
              :style="{
                left: `${tooltipConfig.xPercent}%`,
                top: `${tooltipConfig.yPercent}%`
              }"
            >
              <!-- 題號標題 -->
              <div class="mb-1.5 border-b border-slate-700/80 pb-1.5 font-bold text-emerald-300">
                第 {{ hoveredPoint.data.qNum }} 題
              </div>

              <!-- 答對率指標矩陣 -->
              <div class="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
                <div class="flex justify-between items-center text-slate-300">
                  <span>學校:</span>
                  <span class="font-bold text-emerald-400">{{ hoveredPoint.data.schoolAcc }}%</span>
                </div>
                <div class="flex justify-between items-center text-slate-300">
                  <span>縣市:</span>
                  <span class="text-amber-200">{{ hoveredPoint.data.countyAcc }}%</span>
                </div>
                <div class="flex justify-between items-center text-slate-400">
                  <span>整體:</span>
                  <span>{{ hoveredPoint.data.overallAcc }}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">落差:</span>
                  <span
                    class="font-bold"
                    :class="Number(hoveredPoint.data.schoolAcc) - Number(hoveredPoint.data.countyAcc) < 0 ? 'text-rose-400' : 'text-emerald-400'"
                  >
                    {{ (Number(hoveredPoint.data.schoolAcc) - Number(hoveredPoint.data.countyAcc)) > 0 ? '+' : '' }}{{ (Number(hoveredPoint.data.schoolAcc) - Number(hoveredPoint.data.countyAcc)).toFixed(1) }}%
                  </span>
                </div>
              </div>

              <!-- 指示箭頭 (在上/在下自動反轉) -->
              <div
                v-if="tooltipConfig.isUpperHalf"
                class="absolute -top-1.5 w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-slate-900"
                :class="{
                  'left-1/2 -translate-x-1/2': tooltipConfig.horizontalAlign === 'center',
                  'left-5': tooltipConfig.horizontalAlign === 'left',
                  'right-5': tooltipConfig.horizontalAlign === 'right'
                }"
              ></div>
              <div
                v-else
                class="absolute -bottom-1.5 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-slate-900"
                :class="{
                  'left-1/2 -translate-x-1/2': tooltipConfig.horizontalAlign === 'center',
                  'left-5': tooltipConfig.horizontalAlign === 'left',
                  'right-5': tooltipConfig.horizontalAlign === 'right'
                }"
              ></div>
            </div>
          </div>
        </div>
        <div class="mt-2 text-center text-[11px] text-slate-400">
          <span class="inline-flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-[#e07a5f]"></span> 題號上方的紅點表示該題本校答對率顯著低於縣市平均 (相差 > 10%)</span>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="p-5">
        <h4 class="text-sm font-bold text-slate-800 mb-3">試題詳細數據</h4>
        <div class="border border-slate-200/80 rounded-xl overflow-hidden">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th class="py-2.5 px-4 cursor-pointer hover:bg-slate-100 select-none w-20" @click="sortBy('qNum')">
                  <div class="flex items-center gap-1">題號 <span v-if="sortKey==='qNum'" class="text-[10px]">{{ sortOrder==='asc'?'▲':'▼' }}</span></div>
                </th>
                <th class="py-2.5 px-4 text-center cursor-pointer hover:bg-slate-100 select-none" @click="sortBy('schoolAcc')">
                  <div class="flex items-center justify-center gap-1">學校答對率 <span v-if="sortKey==='schoolAcc'" class="text-[10px]">{{ sortOrder==='asc'?'▲':'▼' }}</span></div>
                </th>
                <th class="py-2.5 px-4 text-center cursor-pointer hover:bg-slate-100 select-none hidden sm:table-cell" @click="sortBy('countyAcc')">
                  <div class="flex items-center justify-center gap-1">縣市答對率 <span v-if="sortKey==='countyAcc'" class="text-[10px]">{{ sortOrder==='asc'?'▲':'▼' }}</span></div>
                </th>
                <th class="py-2.5 px-4 text-center cursor-pointer hover:bg-slate-100 select-none hidden md:table-cell" @click="sortBy('overallAcc')">
                  <div class="flex items-center justify-center gap-1">整體答對率 <span v-if="sortKey==='overallAcc'" class="text-[10px]">{{ sortOrder==='asc'?'▲':'▼' }}</span></div>
                </th>
                <th class="py-2.5 px-4 text-center cursor-pointer hover:bg-slate-100 select-none" @click="sortBy('delta')">
                  <div class="flex items-center justify-center gap-1">校與縣市落差 (Δ) <span v-if="sortKey==='delta'" class="text-[10px]">{{ sortOrder==='asc'?'▲':'▼' }}</span></div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
              <tr v-for="d in sortedAnalysisData" :key="d.qNum" class="hover:bg-slate-50/60 transition" :class="{'bg-rose-50/30': (Number(d.schoolAcc) - Number(d.countyAcc)) <= -10}">
                <td class="py-2 px-4 font-mono text-slate-500 font-bold">{{ d.qNum }}</td>
                <td class="py-2 px-4 text-center font-mono font-bold text-[#52796f]">{{ d.schoolAcc }}%</td>
                <td class="py-2 px-4 text-center font-mono hidden sm:table-cell">{{ d.countyAcc }}%</td>
                <td class="py-2 px-4 text-center font-mono hidden md:table-cell text-slate-400">{{ d.overallAcc }}%</td>
                <td class="py-2 px-4 text-center font-mono font-bold">
                  <span :class="(Number(d.schoolAcc) - Number(d.countyAcc)) < 0 ? 'text-[#e07a5f]' : 'text-emerald-600'">
                    {{ (Number(d.schoolAcc) - Number(d.countyAcc)) > 0 ? '+' : '' }}{{ (Number(d.schoolAcc) - Number(d.countyAcc)).toFixed(1) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 5: 背景資料分析 -->
    <div v-else-if="activeTab === 'background'" class="p-8 md:p-16 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center min-h-[400px]">
      <div class="w-20 h-20 mb-6 bg-slate-50 rounded-full flex items-center justify-center border-4 border-slate-100 shadow-inner">
        <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h3 class="text-xl md:text-2xl font-bold text-slate-700 mb-3 tracking-wider">背景資料分析（學習特質問卷）</h3>
      <div class="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 tracking-wide border border-slate-200">
        開發中 / 尚待更新
      </div>
      <p class="text-sm text-slate-400 max-w-md text-center leading-relaxed">
        本模組功能目前正在積極開發中，將提供學生背景變項與學力表現之深度關聯分析，敬請期待後續系統更新。
      </p>
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
import {
  reportYears,
  reportTypes,
  paperGrades,
  isReportTypeAvailable,
  getReportDownloadUrl
} from '../data/reportsMatrixData'
import { downloadMultipleFiles } from '../utils/batchDownloader'
import YearSelector from '../components/common/YearSelector.vue'
import InquiryDrillDown from '../components/scores/InquiryDrillDown.vue'
import { useAssessmentYear } from '../composables/useAssessmentYear'

import { useAuth } from '../composables/useAuth'

const { state } = useAuth()
const route = useRoute()
const router = useRouter()

const baseTabs = [
  { key: 'inquiry', title: '學生成績查詢' },
  { key: 'reports', title: '各級報表下載' }
]

const adminTabs = [
  { key: 'annual', title: '年度成果報告' },
  { key: 'analysis', title: '試題分析結果' },
  { key: 'background', title: '背景資料分析' }
]

const visibleScoreTabs = computed(() => {
  if (state.role === '校長' || state.role === '校管理者') {
    return [...baseTabs, ...adminTabs]
  }
  return baseTabs
})

const activeTab = ref(route.query.tab || 'inquiry')

watch(() => state.role, () => {
  // If current tab is hidden by role switch, redirect to 'inquiry'
  if (!visibleScoreTabs.value.some(t => t.key === activeTab.value)) {
    switchTab('inquiry')
  }
})

watch(() => route.query.tab, (newTab) => {
  if (newTab && visibleScoreTabs.value.some(t => t.key === newTab)) {
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
// TAB 2: 各級報表下載狀態與互動邏輯 (方案 A: 報表矩陣總覽)
// ----------------------------------------------------
const { activeYear: selectedReportYear, setYear: changeReportYear } = useAssessmentYear(reportYears)
const selectedReportMap = reactive(new Map())
const isReportDownloading = ref(false)
const reportDownloadProgress = reactive({ current: 0, total: 0 })

function getReportItemKey(paperKey, reportKey) {
  return `${selectedReportYear.value}_${paperKey}_${reportKey}`
}

function getReportItemObject(paper, rpt) {
  return {
    key: getReportItemKey(paper.key, rpt.key),
    year: selectedReportYear.value,
    paperKey: paper.key,
    paperLabel: paper.label,
    reportKey: rpt.key,
    reportName: rpt.name,
    name: `${selectedReportYear.value}年度_${paper.label}_${rpt.name}.pdf`,
    url: getReportDownloadUrl(selectedReportYear.value, paper.label, rpt.name)
  }
}

function isReportSelected(paperKey, reportKey) {
  return selectedReportMap.has(getReportItemKey(paperKey, reportKey))
}

function toggleReportItem(paperKey, reportKey) {
  const paper = paperGrades.find(p => p.key === paperKey)
  const rpt = reportTypes.find(r => r.key === reportKey)
  if (!paper || !rpt) return

  const key = getReportItemKey(paperKey, reportKey)
  if (selectedReportMap.has(key)) {
    selectedReportMap.delete(key)
  } else {
    selectedReportMap.set(key, getReportItemObject(paper, rpt))
  }
}

// All available reports for current selected year
const allAvailableReports = computed(() => {
  const list = []
  paperGrades.forEach(p => {
    reportTypes.forEach(r => {
      if (isReportTypeAvailable(p.key, r.key)) {
        list.push(getReportItemObject(p, r))
      }
    })
  })
  return list
})

const selectedReportCount = computed(() => selectedReportMap.size)

const isAllReportsSelected = computed(() => {
  if (allAvailableReports.value.length === 0) return false
  return allAvailableReports.value.every(r => selectedReportMap.has(r.key))
})

function toggleSelectAllReports() {
  const allSel = isAllReportsSelected.value
  allAvailableReports.value.forEach(r => {
    if (allSel) {
      selectedReportMap.delete(r.key)
    } else {
      selectedReportMap.set(r.key, r)
    }
  })
}

function clearReportSelection() {
  selectedReportMap.clear()
}

// Column select (by report type)
function isReportColumnAllSelected(reportKey) {
  const avail = paperGrades.filter(p => isReportTypeAvailable(p.key, reportKey))
  if (avail.length === 0) return false
  return avail.every(p => selectedReportMap.has(getReportItemKey(p.key, reportKey)))
}

function toggleSelectReportColumn(reportKey) {
  const rpt = reportTypes.find(r => r.key === reportKey)
  const avail = paperGrades.filter(p => isReportTypeAvailable(p.key, reportKey))
  if (avail.length === 0 || !rpt) return

  const allSel = isReportColumnAllSelected(reportKey)
  avail.forEach(p => {
    const key = getReportItemKey(p.key, reportKey)
    if (allSel) {
      selectedReportMap.delete(key)
    } else {
      selectedReportMap.set(key, getReportItemObject(p, rpt))
    }
  })
}

// Row select (by paper grade)
function isPaperRowAllSelected(paperKey) {
  const avail = reportTypes.filter(r => isReportTypeAvailable(paperKey, r.key))
  if (avail.length === 0) return false
  return avail.every(r => selectedReportMap.has(getReportItemKey(paperKey, r.key)))
}

function toggleSelectPaperRow(paperKey) {
  const paper = paperGrades.find(p => p.key === paperKey)
  const avail = reportTypes.filter(r => isReportTypeAvailable(paperKey, r.key))
  if (avail.length === 0 || !paper) return

  const allSel = isPaperRowAllSelected(paperKey)
  avail.forEach(r => {
    const key = getReportItemKey(paperKey, r.key)
    if (allSel) {
      selectedReportMap.delete(key)
    } else {
      selectedReportMap.set(key, getReportItemObject(paper, r))
    }
  })
}

function downloadSingleReportFile(paper, rpt) {
  const url = getReportDownloadUrl(selectedReportYear.value, paper.label, rpt.name)
  const filename = `${selectedReportYear.value}年度_${paper.label}_${rpt.name}.pdf`
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success(`開始下載【${selectedReportYear.value}年度 ${paper.label} - ${rpt.name}】`)
}

function downloadAllSchoolPackage() {
  ElMessage.success(`已觸發打包【${selectedReportYear.value}年度 全校各級報表總包裹 (共${allAvailableReports.value.length}份)】`)
}

async function handleBatchReportDownload() {
  if (selectedReportCount.value === 0) return
  const files = Array.from(selectedReportMap.values())
  isReportDownloading.value = true
  reportDownloadProgress.current = 0
  reportDownloadProgress.total = files.length

  try {
    await downloadMultipleFiles(files, (curr, tot) => {
      reportDownloadProgress.current = curr
      reportDownloadProgress.total = tot
    })
    clearReportSelection()
  } finally {
    isReportDownloading.value = false
  }
}

// ----------------------------------------------------
// TAB 3: 年度成果報告狀態與互動邏輯 (對齊評量架構/試題公告)
// ----------------------------------------------------
const { activeYear: selectedAnnualYear, setYear: changeAnnualYear } = useAssessmentYear(annualReportYears)
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

// ----------------------------------------------------
// TAB 4: 試題分析結果 (方案A)
// ----------------------------------------------------
const analysisFilters = reactive({
  year: '115',
  grade: '5',
  subject: '國語文'
})

// Mock up to 30 questions
const analysisData = ref(Array.from({ length: 30 }, (_, i) => {
  const qNum = i + 1;
  const countyAcc = 50 + Math.random() * 40; 
  const overallAcc = countyAcc + (Math.random() * 10 - 5); 
  const schoolAcc = countyAcc + (Math.random() * 20 - 10); 
  
  if (i === 4 || i === 12 || i === 25) {
    return {
      qNum,
      overallAcc: overallAcc.toFixed(1),
      countyAcc: countyAcc.toFixed(1),
      schoolAcc: Math.max(0, countyAcc - 15 - Math.random() * 10).toFixed(1)
    }
  }

  return {
    qNum,
    overallAcc: Math.min(100, Math.max(0, overallAcc)).toFixed(1),
    countyAcc: Math.min(100, Math.max(0, countyAcc)).toFixed(1),
    schoolAcc: Math.min(100, Math.max(0, schoolAcc)).toFixed(1)
  }
}))

const sortKey = ref('qNum')
const sortOrder = ref('asc') 

const sortedAnalysisData = computed(() => {
  return [...analysisData.value].sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];
    
    if (sortKey.value === 'delta') {
      valA = Number(a.schoolAcc) - Number(a.countyAcc);
      valB = Number(b.schoolAcc) - Number(b.countyAcc);
    } else {
      valA = Number(valA);
      valB = Number(valB);
    }

    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
})

function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = key === 'qNum' ? 'asc' : 'desc'; 
  }
}

const hoveredPoint = ref(null)

const chartWidth = 860;
const chartHeight = 290;
const chartPadding = { top: 35, right: 35, bottom: 45, left: 55 };

const chartPoints = computed(() => {
  const data = analysisData.value;
  const numPoints = data.length;
  const xStep = (chartWidth - chartPadding.left - chartPadding.right) / Math.max(1, numPoints - 1);
  
  const getY = (val) => {
    const height = chartHeight - chartPadding.top - chartPadding.bottom;
    return chartHeight - chartPadding.bottom - (Number(val) / 100) * height;
  };

  return data.map((d, i) => {
    const x = chartPadding.left + i * xStep;
    return {
      x,
      data: d,
      schoolY: getY(d.schoolAcc),
      countyY: getY(d.countyAcc),
      overallY: getY(d.overallAcc),
      isWeak: (Number(d.schoolAcc) - Number(d.countyAcc)) <= -10
    };
  });
});

const tooltipConfig = computed(() => {
  if (!hoveredPoint.value) return null;
  const p = hoveredPoint.value;
  
  // 當點位於上半部 (schoolY <= 140，即答對率 >= 50%)，將提示框翻轉到點的下方顯示，防止頂部被切邊
  const isUpperHalf = p.schoolY <= 140;
  
  // 左右邊界安全錨定，防止最左題(Q1~Q3)或最右題(Q28~Q30)溢出容器被裁切
  let horizontalAlign = 'center';
  if (p.x < 150) {
    horizontalAlign = 'left';
  } else if (p.x > chartWidth - 150) {
    horizontalAlign = 'right';
  }
  
  return {
    isUpperHalf,
    horizontalAlign,
    xPercent: (p.x / chartWidth) * 100,
    yPercent: (p.schoolY / chartHeight) * 100
  };
});

const chartPaths = computed(() => {
  const points = chartPoints.value;
  if (points.length === 0) return { school: '', county: '', overall: '' };
  return {
    school: points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.schoolY}`).join(' '),
    county: points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.countyY}`).join(' '),
    overall: points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.overallY}`).join(' ')
  };
});
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
