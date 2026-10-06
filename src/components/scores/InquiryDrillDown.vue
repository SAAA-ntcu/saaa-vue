<template>
  <div class="space-y-6">
    <!-- 頂部過濾與階層麵包屑導覽列 -->
    <div class="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4 md:items-center">
      <!-- 麵包屑導覽 (Drill-down Breadcrumbs) -->
      <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
        <!-- 學校總覽按鈕 (導師身分隱藏) -->
        <button
          v-if="!isHomeroomTeacher"
          type="button"
          @click="drillUp('school')"
          class="hover:text-[#52796f] transition cursor-pointer flex items-center gap-1.5"
          :class="{'text-[#52796f]': inquiryState.level === 'school'}"
        >
          <svg class="w-4 h-4 text-[#52796f] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>學校總覽</span>
        </button>

        <template v-if="inquiryState.level === 'class'">
          <span v-if="!isHomeroomTeacher" class="text-slate-300">/</span>
          <span class="text-[#52796f] flex items-center gap-1.5 font-bold">
            <svg class="w-4 h-4 text-[#52796f] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{{ isHomeroomTeacher ? `【導師專屬】${inquiryState.classObj} 班成績診斷與學生名單` : `${inquiryState.classObj} 班 (向度診斷與學生名單)` }}</span>
          </span>
        </template>
      </div>

      <!-- 快速切換篩選項目 -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="flex items-center gap-1.5 text-xs">
          <label class="font-bold text-slate-500">年度</label>
          <select
            v-model="inquiryState.year"
            class="h-9 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#52796f] cursor-pointer"
          >
            <option value="115">115 年度</option>
            <option value="114">114 年度</option>
            <option value="113">113 年度</option>
          </select>
        </div>

        <div class="flex items-center gap-1.5 text-xs">
          <label class="font-bold text-slate-500">年級</label>
          <select
            v-model="inquiryState.grade"
            :disabled="isHomeroomTeacher"
            class="h-9 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#52796f] cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            <option value="3">3 年級</option>
            <option value="4">4 年級</option>
            <option value="5">5 年級</option>
            <option value="6">6 年級</option>
          </select>
        </div>

        <div class="flex items-center gap-1.5 text-xs">
          <label class="font-bold text-slate-500">科目</label>
          <select
            v-model="inquiryState.subject"
            class="h-9 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#52796f] cursor-pointer"
          >
            <option value="國語文">國語文</option>
            <option value="數學">數學</option>
            <option value="英語文">英語文</option>
          </select>
        </div>

        <div v-if="inquiryState.level === 'school'" class="flex items-center gap-1.5 text-xs">
          <label class="font-bold text-slate-500">所對準向度</label>
          <select
            v-model="inquiryState.dimension"
            class="h-9 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#52796f] cursor-pointer"
          >
            <option value="整體">整體答對率</option>
            <option value="形音知識">形音知識</option>
            <option value="字詞知識">字詞知識</option>
            <option value="語法知識">語法知識</option>
            <option value="篇章理解">篇章理解</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- 層級 1：學校成績統計（整合圖二：各班答對率比較圖 + 基準參考線） -->
    <!-- ============================================================== -->
    <div v-if="inquiryState.level === 'school'" class="space-y-5">
      <!-- 校級統計圖卡 (原圖二的現代化內嵌實作) -->
      <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#52796f]"></span>
              <h3 class="text-base font-bold text-slate-800 m-0">
                校級成績統計 · {{ inquiryState.grade }}年級各班答對率比較
              </h3>
            </div>
            <p class="text-xs text-slate-400 mt-1 m-0">
              {{ state.school }} {{ inquiryState.grade }}年級 {{ inquiryState.subject }} · 所對準向度：<strong class="text-slate-700">{{ inquiryState.dimension }}</strong>（點擊任一長條即可直接進入該班診斷）
            </p>
          </div>

          <!-- 圖例 (圖二參考線) -->
          <div class="flex items-center gap-3 text-xs flex-wrap font-medium">
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-3.5 rounded bg-[#6096ba]/80"></span>
              <span class="text-slate-600">各班平均(%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-4 h-0.5 border-t-2 border-dashed border-[#e76f51]"></span>
              <span class="text-[#e76f51] font-bold">校平均 ({{ schoolAvg }}%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-4 h-0.5 border-t-2 border-dashed border-[#2a9d8f]"></span>
              <span class="text-[#2a9d8f] font-bold">縣市平均 ({{ countyAvg }}%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-4 h-0.5 border-t-2 border-dashed border-[#f72585]"></span>
              <span class="text-[#f72585] font-bold">總參與平均 ({{ nationalAvg }}%)</span>
            </div>
          </div>
        </div>

        <!-- 互動柱狀圖 (純 SVG 繪製，無外部依賴且支援點擊下鑽) -->
        <div class="w-full overflow-x-auto scrollbar-none py-2">
          <div class="min-w-[700px] h-72 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 760 260">
              <!-- Y 軸刻度線 (0% ~ 100%) -->
              <g class="text-[10px] fill-slate-400 font-mono">
                <text x="35" y="25" text-anchor="end">100%</text>
                <text x="35" y="75" text-anchor="end">75%</text>
                <text x="35" y="125" text-anchor="end">50%</text>
                <text x="35" y="175" text-anchor="end">25%</text>
                <text x="35" y="225" text-anchor="end">0%</text>
              </g>

              <!-- 網格背景線 -->
              <g stroke="#f1f5f9" stroke-width="1">
                <line x1="45" y1="20" x2="740" y2="20" />
                <line x1="45" y1="70" x2="740" y2="70" />
                <line x1="45" y1="120" x2="740" y2="120" />
                <line x1="45" y1="170" x2="740" y2="170" />
                <line x1="45" y1="220" x2="740" y2="220" stroke="#cbd5e1" stroke-width="1.5" />
              </g>

              <!-- 3條水平參考基準線 (對應圖二) -->
              <!-- 校平均線 (Orange) -->
              <line x1="45" :y1="220 - (schoolAvg * 2)" x2="740" :y2="220 - (schoolAvg * 2)" stroke="#e76f51" stroke-width="2" stroke-dasharray="6 4" />
              <!-- 縣市平均線 (Green) -->
              <line x1="45" :y1="220 - (countyAvg * 2)" x2="740" :y2="220 - (countyAvg * 2)" stroke="#2a9d8f" stroke-width="2" stroke-dasharray="6 4" />
              <!-- 總參與平均線 (Pink) -->
              <line x1="45" :y1="220 - (nationalAvg * 2)" x2="740" :y2="220 - (nationalAvg * 2)" stroke="#f72585" stroke-width="2" stroke-dasharray="6 4" />

              <!-- 各班長條柱 (301 ~ 308) -->
              <g v-for="(cls, idx) in classStats" :key="cls.name">
                <!-- 柱體本體 (點選下鑽) -->
                <rect
                  :x="75 + idx * 82"
                  :y="220 - (cls.rate * 2)"
                  width="44"
                  :height="cls.rate * 2"
                  rx="6"
                  class="cursor-pointer transition-all duration-200 fill-[#6096ba]/80 hover:fill-[#274c77] hover:opacity-100"
                  @click="drillToClass(cls.name)"
                />
                <!-- 柱頂百分比文字 -->
                <text
                  :x="75 + idx * 82 + 22"
                  :y="220 - (cls.rate * 2) - 6"
                  text-anchor="middle"
                  class="text-[11px] font-bold font-mono fill-slate-700"
                >
                  {{ cls.rate }}%
                </text>

                <!-- X 軸班級標籤 -->
                <text
                  :x="75 + idx * 82 + 22"
                  y="242"
                  text-anchor="middle"
                  class="text-xs font-bold fill-slate-600 cursor-pointer hover:fill-[#52796f]"
                  @click="drillToClass(cls.name)"
                >
                  {{ cls.name }}班
                </text>
              </g>
            </svg>
          </div>
        </div>

        <div class="mt-3 p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-center justify-between text-xs text-amber-900 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span><strong>303 班</strong> 與 <strong>306 班</strong> 答對率低於縣市平均線（86%），建議點擊該班進行向度弱點診斷。</span>
          </div>
          <span class="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
            <span>點擊班級長條即可進入</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      <!-- 快捷班級卡片矩陣 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <button
          v-for="cls in classStats"
          :key="cls.name"
          type="button"
          @click="drillToClass(cls.name)"
          class="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl text-center shadow-2xs hover:shadow-xs transition cursor-pointer group"
        >
          <div class="text-xs font-bold text-slate-800 group-hover:text-[#52796f]">{{ cls.name }} 班</div>
          <div class="text-base font-black font-mono text-[#52796f] my-1">{{ cls.rate }}%</div>
          <div class="text-[10px] text-slate-400">平均分：{{ (cls.rate * 0.95).toFixed(1) }}</div>
        </button>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- 層級 2：班級成績統計（整合圖三：向度群組圖 + 該班學生名單）     -->
    <!-- ============================================================== -->
    <div v-else-if="inquiryState.level === 'class'" class="space-y-6">
      <!-- 班級向度長條圖 (原圖三的現代化內嵌實作) -->
      <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <button
                v-if="!isHomeroomTeacher"
                type="button"
                @click="drillUp('school')"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <svg class="w-3.5 h-3.5 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>返回各班比較</span>
              </button>
              <h3 class="text-base font-bold text-slate-800 m-0">
                班級成績統計 · {{ state.school }} {{ inquiryState.classObj }} 班答對率向度分析
              </h3>
            </div>
            <p class="text-xs text-slate-400 mt-1 m-0">
              包含全校、縣市與總參與平均對照，可快速鎖定本班需補救加強之關鍵向度。
            </p>
          </div>

          <!-- 圖例 (對應圖三 4 條顏色群組) -->
          <div class="flex items-center gap-3 text-xs flex-wrap font-medium">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-[#b5179e]"></span>
              <span class="text-slate-600">總參與平均</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-[#1d3557]"></span>
              <span class="text-slate-600">縣市平均</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-[#f77f00]"></span>
              <span class="text-slate-600">學校平均</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-[#52b788]"></span>
              <span class="text-slate-800 font-bold">班級平均</span>
            </div>
          </div>
        </div>

        <!-- 向度長條分組圖 (SVG) -->
        <div class="w-full overflow-x-auto scrollbar-none py-2">
          <div class="min-w-[840px] h-72 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 860 260">
              <!-- Y 軸刻度線 -->
              <g class="text-[10px] fill-slate-400 font-mono">
                <text x="35" y="25" text-anchor="end">100%</text>
                <text x="35" y="75" text-anchor="end">75%</text>
                <text x="35" y="125" text-anchor="end">50%</text>
                <text x="35" y="175" text-anchor="end">25%</text>
                <text x="35" y="225" text-anchor="end">0%</text>
              </g>

              <!-- 網格背景線 -->
              <g stroke="#f1f5f9" stroke-width="1">
                <line x1="45" y1="20" x2="840" y2="20" />
                <line x1="45" y1="70" x2="840" y2="70" />
                <line x1="45" y1="120" x2="840" y2="120" />
                <line x1="45" y1="170" x2="840" y2="170" />
                <line x1="45" y1="220" x2="840" y2="220" stroke="#cbd5e1" stroke-width="1.5" />
              </g>

              <!-- 各向度 4 根群組柱體 (總共 11 個向度) -->
              <g v-for="(dim, dIdx) in classDimensions" :key="dim.name">
                <!-- Group Container: X = 55 + dIdx * 72 -->
                <!-- Bar 1: 總參與 (Purple) -->
                <rect
                  :x="55 + dIdx * 72"
                  :y="220 - (dim.national * 2)"
                  width="11"
                  :height="dim.national * 2"
                  fill="#b5179e"
                  rx="2"
                />
                <!-- Bar 2: 縣市 (Dark Blue) -->
                <rect
                  :x="55 + dIdx * 72 + 12"
                  :y="220 - (dim.county * 2)"
                  width="11"
                  :height="dim.county * 2"
                  fill="#1d3557"
                  rx="2"
                />
                <!-- Bar 3: 學校 (Orange) -->
                <rect
                  :x="55 + dIdx * 72 + 24"
                  :y="220 - (dim.school * 2)"
                  width="11"
                  :height="dim.school * 2"
                  fill="#f77f00"
                  rx="2"
                />
                <!-- Bar 4: 班級 (Green) -->
                <rect
                  :x="55 + dIdx * 72 + 36"
                  :y="220 - (dim.classVal * 2)"
                  width="11"
                  :height="dim.classVal * 2"
                  fill="#52b788"
                  rx="2"
                />

                <!-- 班級最高數值標籤 -->
                <text
                  :x="55 + dIdx * 72 + 41"
                  :y="220 - (dim.classVal * 2) - 4"
                  text-anchor="middle"
                  class="text-[9px] font-bold font-mono fill-emerald-700"
                >
                  {{ dim.classVal }}%
                </text>

                <!-- X 軸向度標籤 -->
                <text
                  :x="55 + dIdx * 72 + 24"
                  y="238"
                  text-anchor="middle"
                  class="text-[10px] font-bold fill-slate-600"
                >
                  {{ dim.name }}
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <!-- 該班學生名單清單 (點選即滑出右側診斷抽屜) -->
      <div class="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div class="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 class="text-sm font-bold text-slate-800 m-0">
              {{ inquiryState.classObj }} 班 學生名冊與個人成績診斷
            </h4>
            <p class="text-[11px] text-slate-400 m-0 mt-0.5">點擊學生任一列或「個人診斷報告」按鈕，即可檢視該生向度與錯題清單。</p>
          </div>
          <div class="text-xs text-slate-500 font-medium">
            全班共 <strong class="text-slate-800">{{ studentList.length }}</strong> 名學生
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th class="py-3 px-4 w-16 text-center">座號</th>
                <th class="py-3 px-4">學生姓名</th>
                <th class="py-3 px-4 text-center">科目答對率</th>
                <th class="py-3 px-4 text-center">PR 值 (縣市)</th>
                <th class="py-3 px-4 text-center">PR 值 (全國)</th>
                <th class="py-3 px-4">弱勢向度警示</th>
                <th class="py-3 px-4 text-center w-28">個人報表</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr
                v-for="st in studentList"
                :key="st.seat"
                @click="openStudentDrawer(st)"
                class="hover:bg-slate-50/80 transition cursor-pointer"
                :class="{'bg-[#edf2ee]/50 font-bold': activeStudent?.seat === st.seat}"
              >
                <td class="py-3 px-4 text-center font-mono text-slate-500">{{ st.seat }}</td>
                <td class="py-3 px-4 font-bold text-slate-800">{{ st.name }}</td>
                <td class="py-3 px-4 text-center font-mono font-bold" :class="st.rate < 60 ? 'text-rose-600' : 'text-[#52796f]'">
                  {{ st.rate }}%
                </td>
                <td class="py-3 px-4 text-center font-mono text-slate-600">PR {{ st.prCounty }}</td>
                <td class="py-3 px-4 text-center font-mono text-slate-600">PR {{ st.prNation }}</td>
                <td class="py-3 px-4">
                  <span
                    v-if="st.weak"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                  >
                    <svg class="w-3 h-3 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{{ st.weak }}</span>
                  </span>
                  <span v-else class="text-[11px] text-emerald-600 font-medium">表現穩健</span>
                </td>
                <td class="py-3 px-4 text-center">
                  <button
                    type="button"
                    @click.stop="openStudentDrawer(st)"
                    class="px-2.5 py-1 bg-[#52796f] hover:bg-[#354f52] text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                  >
                    診斷報告
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- 層級 3：個人成績統計報告（整合圖一：右側無縫抽屜 Drawer）       -->
    <!-- ============================================================== -->
    <el-drawer
      v-model="studentDrawerVisible"
      :size="isMobile ? '100%' : '620px'"
      direction="rtl"
      :with-header="false"
      class="rounded-l-2xl overflow-hidden"
    >
      <div v-if="activeStudent" class="p-6 space-y-6 text-slate-800">
        <!-- 抽屜頂部標題與快速導航 -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#52796f] bg-[#52796f]/10 px-2 py-0.5 rounded-md">
              個別診斷報告
            </span>
            <h3 class="text-xl font-black text-slate-800 mt-1 m-0">個人成績統計報告</h3>
          </div>
          <button
            type="button"
            @click="studentDrawerVisible = false"
            class="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            aria-label="關閉"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 學生基本資訊卡片 (精確對應圖一上方欄位) -->
        <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span class="text-slate-400 text-[11px] block">所屬學校</span>
              <strong class="font-bold text-slate-700">{{ state.school }}</strong>
            </div>
            <div>
              <span class="text-slate-400 text-[11px] block">班級 / 座號</span>
              <strong class="font-bold text-slate-700">{{ inquiryState.classObj }} 班 · {{ activeStudent.seat }} 號</strong>
            </div>
            <div>
              <span class="text-slate-400 text-[11px] block">學生姓名</span>
              <strong class="font-bold text-slate-800 text-sm">{{ activeStudent.name }}</strong>
            </div>
            <div>
              <span class="text-slate-400 text-[11px] block">評量科目</span>
              <strong class="font-bold text-[#52796f]">{{ inquiryState.subject }}</strong>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-200/60 text-center">
            <div class="bg-white p-2 rounded-xl border border-slate-200/70">
              <span class="text-slate-400 text-[10px] block font-medium">個人答對率</span>
              <span class="text-base font-black font-mono" :class="activeStudent.rate < 60 ? 'text-rose-600' : 'text-[#52796f]'">
                {{ activeStudent.rate }}%
              </span>
            </div>
            <div class="bg-white p-2 rounded-xl border border-slate-200/70">
              <span class="text-slate-400 text-[10px] block font-medium">PR 值 (縣市)</span>
              <span class="text-base font-black font-mono text-slate-700">{{ activeStudent.prCounty }}</span>
            </div>
            <div class="bg-white p-2 rounded-xl border border-slate-200/70">
              <span class="text-slate-400 text-[10px] block font-medium">PR 值 (全國)</span>
              <span class="text-base font-black font-mono text-slate-700">{{ activeStudent.prNation }}</span>
            </div>
          </div>
        </div>

        <!-- 水平答對率對照長條圖 (精確對應圖一中間橫條圖) -->
        <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
          <div class="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>平均答對率(%) 橫向對比</span>
            <span class="text-[10px] text-slate-400 font-mono">0% ~ 100%</span>
          </div>

          <!-- 5 條水平 Bar (個人, 班級, 學校, 縣市, 總平均) -->
          <div class="space-y-2 text-xs">
            <!-- 1. 個人 -->
            <div class="flex items-center gap-3">
              <span class="w-12 text-slate-500 font-bold shrink-0 text-right">個人</span>
              <div class="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden relative">
                <div
                  class="h-full rounded-full flex items-center justify-end pr-2 text-[10px] font-bold font-mono text-white transition-all duration-500"
                  :class="activeStudent.rate < 60 ? 'bg-rose-500' : 'bg-[#52796f]'"
                  :style="{ width: `${Math.max(12, activeStudent.rate)}%` }"
                >
                  {{ activeStudent.rate }}%
                </div>
              </div>
            </div>

            <!-- 2. 班級 -->
            <div class="flex items-center gap-3">
              <span class="w-12 text-slate-500 font-medium shrink-0 text-right">班級</span>
              <div class="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden relative">
                <div class="h-full bg-[#6096ba] rounded-full flex items-center justify-end pr-2 text-[10px] font-bold font-mono text-white" style="width: 76%">
                  76%
                </div>
              </div>
            </div>

            <!-- 3. 學校 -->
            <div class="flex items-center gap-3">
              <span class="w-12 text-slate-500 font-medium shrink-0 text-right">學校</span>
              <div class="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden relative">
                <div class="h-full bg-[#83c5be] rounded-full flex items-center justify-end pr-2 text-[10px] font-bold font-mono text-white" style="width: 77%">
                  77%
                </div>
              </div>
            </div>

            <!-- 4. 縣市 -->
            <div class="flex items-center gap-3">
              <span class="w-12 text-slate-500 font-medium shrink-0 text-right">縣市</span>
              <div class="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden relative">
                <div class="h-full bg-[#94d2bd] rounded-full flex items-center justify-end pr-2 text-[10px] font-bold font-mono text-white" style="width: 72%">
                  72%
                </div>
              </div>
            </div>

            <!-- 5. 總平均 -->
            <div class="flex items-center gap-3">
              <span class="w-12 text-slate-500 font-medium shrink-0 text-right">總平均</span>
              <div class="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden relative">
                <div class="h-full bg-[#e9d8a6] rounded-full flex items-center justify-end pr-2 text-[10px] font-bold font-mono text-slate-700" style="width: 70%">
                  70%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 評量向度表現與錯題診斷表 (精確對應圖一下方清冊) -->
        <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
          <div class="p-3 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>各評量向度答對率與錯題清冊</span>
            <span class="text-[10px] text-rose-500 font-normal">紅色題號為答錯題目，建議優先輔導</span>
          </div>

          <div class="overflow-x-auto max-h-72">
            <table class="w-full text-left border-collapse text-xs">
              <thead class="sticky top-0 bg-white shadow-2xs">
                <tr class="border-b border-slate-200 text-slate-500 text-[11px] font-semibold">
                  <th class="py-2.5 px-3">評量向度</th>
                  <th class="py-2.5 px-2 text-center w-14">題數</th>
                  <th class="py-2.5 px-3 text-center w-16">答對率</th>
                  <th class="py-2.5 px-3">答對題號</th>
                  <th class="py-2.5 px-3">答錯題號 (補救重點)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                <tr v-for="dim in studentBreakdown" :key="dim.name" class="hover:bg-slate-50/70">
                  <td class="py-2.5 px-3 font-bold text-slate-800">{{ dim.name }}</td>
                  <td class="py-2.5 px-2 text-center font-mono text-slate-400">{{ dim.totalQ }}</td>
                  <td class="py-2.5 px-3 text-center font-mono font-bold" :class="dim.rate < 50 ? 'text-rose-500' : 'text-[#52796f]'">
                    {{ dim.rate }}%
                  </td>
                  <td class="py-2.5 px-3 font-mono text-slate-600 text-[11px]">{{ dim.correctQs || '-' }}</td>
                  <td class="py-2.5 px-3 font-mono text-[11px]">
                    <span v-if="dim.wrongQs" class="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      {{ dim.wrongQs }}
                    </span>
                    <span v-else class="text-slate-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 底部切換上下位學生按鈕 -->
        <div class="flex items-center justify-between pt-2">
          <button
            type="button"
            @click="switchStudent(-1)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 transition cursor-pointer shadow-2xs"
          >
            <svg class="w-3.5 h-3.5 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>前一位學生</span>
          </button>
          <span class="text-xs text-slate-400 font-mono">座號 {{ activeStudent.seat }} / {{ studentList.length }}</span>
          <button
            type="button"
            @click="switchStudent(1)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600 transition cursor-pointer shadow-2xs"
          >
            <span>後一位學生</span>
            <svg class="w-3.5 h-3.5 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useAuth } from '../../composables/useAuth'

const { state } = useAuth()

const isHomeroomTeacher = computed(() => state.role === '導師' || state.role === '班級導師')

const inquiryState = reactive({
  level: 'school', // 'school' | 'class'
  year: '115',
  grade: '3',
  subject: '國語文',
  dimension: '整體',
  classObj: '301'
})

// 班級導師權限鎖定：自動切換至任教班級，且禁止返回學校總覽
watch(() => [state.role, state.grade, state.classroom], () => {
  if (isHomeroomTeacher.value) {
    inquiryState.level = 'class'
    const g = state.grade || '3'
    const c = state.classroom || '1'
    inquiryState.grade = g
    inquiryState.classObj = `${g}0${c}`
  }
}, { immediate: true })

// Mock Baseline Averages for Chart 2 (校級成績統計)
const schoolAvg = 93
const countyAvg = 86
const nationalAvg = 84

// Mock Class List for Chart 2
const classStats = [
  { name: '301', rate: 95 },
  { name: '302', rate: 91 },
  { name: '303', rate: 84 },
  { name: '304', rate: 95 },
  { name: '305', rate: 95 },
  { name: '306', rate: 84 },
  { name: '307', rate: 96 },
  { name: '308', rate: 96 }
]

// Mock Dimension Data for Chart 3 (班級成績統計)
const classDimensions = [
  { name: '總答對率', national: 70, county: 72, school: 77, classVal: 76 },
  { name: '形音知識', national: 84, county: 86, school: 93, classVal: 95 },
  { name: '字詞知識', national: 62, county: 63, school: 68, classVal: 73 },
  { name: '語法知識', national: 78, county: 79, school: 83, classVal: 82 },
  { name: '修辭知識', national: 65, county: 65, school: 67, classVal: 63 },
  { name: '章法知識', national: 49, county: 48, school: 54, classVal: 54 },
  { name: '文體知識', national: 65, county: 65, school: 72, classVal: 68 },
  { name: '字詞理解', national: 73, county: 74, school: 80, classVal: 75 },
  { name: '句子理解', national: 83, county: 84, school: 89, classVal: 93 },
  { name: '段落理解', national: 71, county: 73, school: 77, classVal: 79 },
  { name: '篇章理解', national: 63, county: 66, school: 73, classVal: 71 }
]

// Mock Students in the Selected Class
const studentList = [
  { seat: '01', name: '陳小明', rate: 33, prCounty: 4, prNation: 5, weak: '篇章理解' },
  { seat: '02', name: '林志豪', rate: 78, prCounty: 65, prNation: 68, weak: null },
  { seat: '03', name: '張雅晴', rate: 92, prCounty: 94, prNation: 95, weak: null },
  { seat: '04', name: '李佳穎', rate: 55, prCounty: 32, prNation: 35, weak: '章法知識' },
  { seat: '05', name: '王宗憲', rate: 85, prCounty: 80, prNation: 82, weak: null },
  { seat: '06', name: '黃冠宇', rate: 46, prCounty: 18, prNation: 21, weak: '語法知識' },
  { seat: '07', name: '趙子涵', rate: 98, prCounty: 99, prNation: 99, weak: null },
  { seat: '08', name: '孫佩珊', rate: 88, prCounty: 85, prNation: 87, weak: null }
]

// Mock Breakdown table for the active student (對應圖一清單)
const studentBreakdown = [
  { name: '形音知識', totalQ: 3, rate: 67, correctQs: '1, 2', wrongQs: '3' },
  { name: '字詞知識', totalQ: 2, rate: 100, correctQs: '4, 5', wrongQs: '' },
  { name: '語法知識', totalQ: 4, rate: 25, correctQs: '9', wrongQs: '6, 7, 8' },
  { name: '修辭知識', totalQ: 2, rate: 50, correctQs: '11', wrongQs: '10' },
  { name: '標點知識', totalQ: 1, rate: 0, correctQs: '', wrongQs: '12' },
  { name: '文體知識', totalQ: 1, rate: 0, correctQs: '', wrongQs: '13' },
  { name: '字詞理解', totalQ: 4, rate: 50, correctQs: '15, 16', wrongQs: '14, 18' },
  { name: '句子理解', totalQ: 2, rate: 50, correctQs: '17', wrongQs: '19' },
  { name: '段落理解', totalQ: 2, rate: 0, correctQs: '', wrongQs: '20, 21' },
  { name: '篇章理解', totalQ: 3, rate: 33, correctQs: '23', wrongQs: '22, 24' }
]

// Drawer & Selection state
const studentDrawerVisible = ref(false)
const activeStudent = ref(null)
const isMobile = computed(() => window.innerWidth < 768)

function drillToClass(cName) {
  inquiryState.classObj = cName
  inquiryState.level = 'class'
}

function drillUp(lvl) {
  if (isHomeroomTeacher.value) return // 導師鎖定於自己班級
  inquiryState.level = lvl
}

function openStudentDrawer(st) {
  activeStudent.value = st
  studentDrawerVisible.value = true
}

function switchStudent(offset) {
  if (!activeStudent.value) return
  const curIdx = studentList.findIndex(s => s.seat === activeStudent.value.seat)
  const nextIdx = curIdx + offset
  if (nextIdx >= 0 && nextIdx < studentList.length) {
    activeStudent.value = studentList[nextIdx]
  }
}
</script>
