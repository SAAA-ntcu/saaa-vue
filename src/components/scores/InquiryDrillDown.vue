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

        <!-- 班級選擇器 (校長、校管理者、科任等可切換各班或學校總覽；導師鎖定專屬班級) -->
        <div class="flex items-center gap-1.5 text-xs">
          <label class="font-bold text-slate-500">班級</label>
          <select
            :value="classSelectValue"
            @change="handleClassSelectChange($event.target.value)"
            :disabled="isHomeroomTeacher"
            class="h-9 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-[#52796f] cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
            :title="isHomeroomTeacher ? '導師身分僅限檢視任教班級' : '選擇指定班級進行向度診斷或檢視全校總覽'"
          >
            <!-- 學校總覽選項 (非導師可選) -->
            <option v-if="!isHomeroomTeacher" value="all">
              全校各班 (學校總覽)
            </option>
            <option
              v-for="cls in availableClasses"
              :key="cls.value"
              :value="cls.value"
            >
              {{ cls.label }}
            </option>
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
              {{ state.school }} {{ inquiryState.grade }}年級 {{ inquiryState.subject }} · 所對準向度：<strong class="text-slate-700">{{ inquiryState.dimension }}</strong>（點選任一班級圓點即可直接進入該班向度診斷）
            </p>
          </div>

          <!-- 圖例 (棒棒糖圓點與參考基準帶) -->
          <div class="flex items-center gap-3 text-xs flex-wrap font-medium">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-[#52796f]"></span>
              <span class="text-slate-600">各班平均(%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-2 rounded bg-emerald-100 border border-emerald-300"></span>
              <span class="text-emerald-700 font-bold">校平均 ({{ schoolAvg }}%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-2 rounded bg-teal-50 border border-teal-300"></span>
              <span class="text-teal-700 font-bold">縣市平均 ({{ countyAvg }}%)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3.5 h-0.5 border-t-2 border-dashed border-slate-400"></span>
              <span class="text-slate-500 font-medium">總參與 ({{ nationalAvg }}%)</span>
            </div>
          </div>
        </div>

        <!-- 互動棒棒糖點圖 (Lollipop Chart + 基準帶，聚焦 70% ~ 100%) -->
        <div class="w-full overflow-x-auto scrollbar-none py-2">
          <div class="min-w-[700px] h-64 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 760 250">
              <!-- 背景基準區間帶 (Reference Bands) -->
              <!-- 1. 校均以上優質表現區間 (≥ 93%) -->
              <rect
                x="50"
                :y="getRateY(100)"
                width="675"
                :height="getRateY(schoolAvg) - getRateY(100)"
                fill="#f0fdf4"
                rx="6"
              />
              <!-- 2. 縣市平均 ~ 校平均常模區間 (86% ~ 93%) -->
              <rect
                x="50"
                :y="getRateY(schoolAvg)"
                width="675"
                :height="getRateY(countyAvg) - getRateY(schoolAvg)"
                fill="#f8fafc"
                rx="4"
              />

              <!-- Y 軸刻度線 (70% ~ 100%) -->
              <g class="text-[10px] fill-slate-400 font-mono" text-anchor="end">
                <text x="42" :y="getRateY(100) + 4">100%</text>
                <text x="42" :y="getRateY(90) + 4">90%</text>
                <text x="42" :y="getRateY(80) + 4">80%</text>
                <text x="42" :y="getRateY(70) + 4">70%</text>
              </g>

              <!-- 網格背景線 -->
              <g stroke="#f1f5f9" stroke-width="1">
                <line x1="50" :y1="getRateY(100)" x2="725" :y2="getRateY(100)" stroke-dasharray="2 4" />
                <line x1="50" :y1="getRateY(90)" x2="725" :y2="getRateY(90)" stroke-dasharray="2 4" />
                <line x1="50" :y1="getRateY(80)" x2="725" :y2="getRateY(80)" stroke-dasharray="2 4" />
                <line x1="50" :y1="getRateY(70)" x2="725" :y2="getRateY(70)" stroke="#cbd5e1" stroke-width="1.5" />
              </g>

              <!-- 水平參考基準線與標籤 -->
              <!-- 校平均線 (Emerald) -->
              <line
                x1="50"
                :y1="getRateY(schoolAvg)"
                x2="670"
                :y2="getRateY(schoolAvg)"
                stroke="#10b981"
                stroke-width="1.5"
                stroke-dasharray="5 3"
              />
              <text x="674" :y="getRateY(schoolAvg) + 4" class="text-[10px] font-bold fill-emerald-700">
                校均 {{ schoolAvg }}%
              </text>

              <!-- 縣市平均線 (Teal) -->
              <line
                x1="50"
                :y1="getRateY(countyAvg)"
                x2="670"
                :y2="getRateY(countyAvg)"
                stroke="#0d9488"
                stroke-width="1.5"
                stroke-dasharray="5 3"
              />
              <text x="674" :y="getRateY(countyAvg) + 4" class="text-[10px] font-bold fill-teal-700">
                縣均 {{ countyAvg }}%
              </text>

              <!-- 總參與平均線 (Slate) -->
              <line
                x1="50"
                :y1="getRateY(nationalAvg)"
                x2="670"
                :y2="getRateY(nationalAvg)"
                stroke="#94a3b8"
                stroke-width="1.2"
                stroke-dasharray="3 3"
              />
              <text x="674" :y="getRateY(nationalAvg) + 4" class="text-[10px] font-medium fill-slate-500">
                總均 {{ nationalAvg }}%
              </text>

              <!-- 各班棒棒糖 (軸線 Stem + 頂端圓點 Head) -->
              <g
                v-for="(cls, idx) in classStats"
                :key="cls.name"
                class="cursor-pointer"
                @click="drillToClass(cls.name)"
              >
                <!-- 桿身 (Stem) -->
                <line
                  :x1="85 + idx * 72"
                  :y1="getRateY(70)"
                  :x2="85 + idx * 72"
                  :y2="getRateY(cls.rate)"
                  class="stroke-slate-300"
                  stroke-width="2.5"
                  stroke-linecap="round"
                />

                <!-- 圓點本體 (Circle Head) -->
                <circle
                  :cx="85 + idx * 72"
                  :cy="getRateY(cls.rate)"
                  r="14"
                  class="shadow-sm"
                  :class="inquiryState.classObj === cls.name
                    ? 'fill-[#274c77] stroke-white stroke-2'
                    : 'fill-[#52796f] stroke-white stroke-2'"
                />

                <!-- 圓心百分比數字 -->
                <text
                  :x="85 + idx * 72"
                  :y="getRateY(cls.rate) + 4"
                  text-anchor="middle"
                  class="text-[11px] font-bold font-mono fill-white pointer-events-none select-none"
                >
                  {{ cls.rate }}%
                </text>

                <!-- X 軸班級標籤 -->
                <text
                  :x="85 + idx * 72"
                  y="235"
                  text-anchor="middle"
                  class="text-xs font-bold select-none"
                  :class="inquiryState.classObj === cls.name
                    ? 'fill-[#274c77] font-black'
                    : 'fill-slate-600'"
                >
                  {{ cls.name }}班
                </text>
              </g>
            </svg>
          </div>
        </div>

        <!-- 友善專業診斷引導提示 (不標籤化落後班級，避免爭議) -->
        <div class="mt-3 p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex items-center justify-between text-xs text-slate-700 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#52796f] shrink-0"></span>
            <span>
              <strong>向度診斷指引：</strong>
              背景綠色區間為校均標（{{ schoolAvg }}%）以上，淺色區間為縣市平均（{{ countyAvg }}%）。點選任一班級圓點即可進入該班查看學生名冊與「形音、字詞、語法、篇章」各向度分析。
            </span>
          </div>
          <span class="text-[11px] font-semibold text-[#52796f] flex items-center gap-1">
            <span>點選班級即可進入</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

    </div>

    <!-- ============================================================== -->
    <!-- 層級 2：班級成績統計（整合圖三：向度群組圖 + 該班學生名單）     -->
    <!-- ============================================================== -->
    <div v-else-if="inquiryState.level === 'class'" class="space-y-6">
      <!-- 班級向度長條圖 (原圖三的現代化內嵌實作) -->
      <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div class="mb-4 pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2 flex-wrap">
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
              班級成績統計 · {{ state.school }}
              <span class="text-[#52796f] font-black">{{ inquiryState.classObj }} 班</span>
              答對率向度分析
            </h3>
          </div>

          <!-- 校長、校管理者快捷切換班級按鈕群 (Class Switcher Pills) -->
          <div v-if="!isHomeroomTeacher" class="flex items-center gap-2 mt-2.5 flex-wrap">
            <span class="text-xs font-bold text-slate-500 flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              切換班級：
            </span>
            <div class="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/70 flex-wrap">
              <button
                v-for="cls in availableClasses"
                :key="'pill-' + cls.value"
                type="button"
                @click="drillToClass(cls.value)"
                class="px-2 py-0.5 rounded-md text-xs font-bold transition cursor-pointer"
                :class="inquiryState.classObj === cls.value
                  ? 'bg-[#52796f] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'"
              >
                {{ cls.value }} 班
              </button>
            </div>
          </div>

          <p class="text-xs text-slate-400 mt-1.5 m-0">
            包含全校、縣市與總參與平均對照，可快速鎖定本班需補救加強之關鍵向度。
          </p>
        </div>

        <!-- 主體內容：頂部總體儀表盤 + 下方向度全覽水平基準長條對齊圖 -->
        <div class="space-y-6 pt-1">

          <!-- 1. 頂部核心橫幅：【全科總答對率 · 儀表盤診斷艙 (依附圖實作)】 -->
          <div class="bg-gradient-to-r from-slate-50 via-white to-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <!-- 左側：全新極簡浮島環形儀表盤 (5 Cols - 100% 對標附圖，零壓圖) -->
              <div class="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
                <div class="w-full max-w-[270px] aspect-square relative flex items-center justify-center">
                  <svg viewBox="0 0 320 320" class="w-full h-full overflow-visible select-none">
                    <defs>
                      <!-- 藍紫漸層 (100% 依附圖深藍至藍紫漸變) -->
                      <linearGradient id="ringGradient" x1="100%" y1="20%" x2="10%" y2="90%">
                        <stop offset="0%" stop-color="#c7d2fe" stop-opacity="0.85" />
                        <stop offset="50%" stop-color="#6366f1" />
                        <stop offset="100%" stop-color="#1d4ed8" />
                      </linearGradient>

                      <!-- 浮島中央白圓陰影 -->
                      <filter id="discShadow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#1e3a8a" flood-opacity="0.12" />
                        <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.04" />
                      </filter>
                    </defs>

                    <!-- 1. 背景底軌淺灰色圓環 (0~100%) -->
                    <circle
                      cx="160"
                      cy="160"
                      r="110"
                      fill="none"
                      stroke="#f1f5f9"
                      stroke-width="22"
                    />

                    <!-- 2. 本班進度漸層動態環 (依附圖風格，無任何壓圖) -->
                    <circle
                      cx="160"
                      cy="160"
                      r="110"
                      fill="none"
                      stroke="url(#ringGradient)"
                      stroke-width="22"
                      stroke-linecap="round"
                      :stroke-dasharray="ringCircumference"
                      :stroke-dashoffset="ringProgressOffset"
                      class="transition-all duration-700 ease-out drop-shadow-sm"
                    />

                    <!-- 3. 方案 B 之軌道微型刻度標記線 (學校、縣市、全體，無壓圖零遮蔽) -->
                    <g class="pointer-events-auto">
                      <template v-for="bm in precisionTicks" :key="'tick-' + bm.key">
                        <g
                          class="cursor-pointer transition-all duration-300"
                          @mouseenter="activeHoverBenchmark = bm.key"
                          @mouseleave="activeHoverBenchmark = null"
                        >
                          <!-- 刻度微線 (橫跨外軌，安全離中心白圓 12px 間隔) -->
                          <line
                            :x1="bm.p1.x"
                            :y1="bm.p1.y"
                            :x2="bm.p2.x"
                            :y2="bm.p2.y"
                            :stroke="bm.color"
                            :stroke-width="activeHoverBenchmark === bm.key ? 4 : 2.5"
                            stroke-linecap="round"
                            class="transition-all duration-300 drop-shadow-xs"
                          />
                          <!-- 外端點小微珠 (增添刻度指針精緻度) -->
                          <circle
                            :cx="bm.p2.x"
                            :cy="bm.p2.y"
                            :r="activeHoverBenchmark === bm.key ? 3.5 : 2.2"
                            :fill="bm.color"
                            class="transition-all duration-300 drop-shadow-xs"
                          />
                          <title>{{ bm.label }}平均：{{ bm.val }}%</title>
                        </g>
                      </template>
                    </g>

                    <!-- 4. 中央浮島純白圓形卡片 (直徑與環形保留 13px 安全間距，絕對不壓圖) -->
                    <circle
                      cx="160"
                      cy="160"
                      r="86"
                      fill="#ffffff"
                      filter="url(#discShadow)"
                    />

                    <!-- 5. 中央數值文字 (100% 依附圖純粹大字風格) -->
                    <text
                      x="160"
                      y="162"
                      text-anchor="middle"
                      class="font-mono text-4xl sm:text-5xl font-black fill-[#1d4ed8] select-none"
                    >
                      {{ overallStat.classVal }}%
                    </text>
                    <text
                      x="160"
                      y="188"
                      text-anchor="middle"
                      class="text-xs font-bold fill-slate-400 tracking-wider select-none"
                    >
                      全科總答對率
                    </text>
                  </svg>
                </div>
              </div>

              <!-- 右側：全科綜合說明與 3 大對照基準卡 (7 Cols，無任何冗餘重複) -->
              <div class="lg:col-span-7 space-y-4 flex flex-col justify-center">
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-[#52796f] text-white">
                      🌟 全科總答對率 · 儀表診斷
                    </span>
                    <h4 class="text-sm font-bold text-slate-800 m-0">
                      {{ state.school }} {{ inquiryState.classObj }} 班 綜合指標
                    </h4>
                  </div>
                  <p class="text-xs text-slate-400 m-0 mt-1.5">
                    依據標準常模儀表盤直觀呈現本班全科總答對率落點，並提供學校、縣市與全國平均對照。
                  </p>
                </div>

                <!-- 3 欄獨立基準常模艙 (學校、縣市、全體對照，移除非必要的本班重複卡片) -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <!-- 1. 學校平均 (琥珀橘) -->
                  <div
                    @mouseenter="activeHoverBenchmark = 'school'"
                    @mouseleave="activeHoverBenchmark = null"
                    class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 shadow-2xs flex flex-col items-center transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer"
                    :class="activeHoverBenchmark === 'school' ? 'ring-2 ring-amber-400 bg-amber-100/90 scale-[1.02]' : ''"
                  >
                    <span class="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                      學校平均
                    </span>
                    <span class="mt-1.5 font-mono text-2xl font-black text-amber-950">
                      {{ overallStat.school }}.0%
                    </span>
                    <span class="text-[10px] font-medium text-amber-700 mt-1">校內平均</span>
                  </div>

                  <!-- 2. 縣市平均 (蔚藍色) -->
                  <div
                    @mouseenter="activeHoverBenchmark = 'county'"
                    @mouseleave="activeHoverBenchmark = null"
                    class="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 shadow-2xs flex flex-col items-center transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer"
                    :class="activeHoverBenchmark === 'county' ? 'ring-2 ring-blue-400 bg-blue-100/90 scale-[1.02]' : ''"
                  >
                    <span class="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-[#2563eb]"></span>
                      縣市平均
                    </span>
                    <span class="mt-1.5 font-mono text-2xl font-black text-blue-950">
                      {{ overallStat.county }}.0%
                    </span>
                    <span class="text-[10px] font-medium text-blue-700 mt-1">縣市常模</span>
                  </div>

                  <!-- 3. 全體平均 (質感紫) -->
                  <div
                    @mouseenter="activeHoverBenchmark = 'national'"
                    @mouseleave="activeHoverBenchmark = null"
                    class="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 shadow-2xs flex flex-col items-center transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer"
                    :class="activeHoverBenchmark === 'national' ? 'ring-2 ring-purple-400 bg-purple-100/90 scale-[1.02]' : ''"
                  >
                    <span class="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-[#9333ea]"></span>
                      全體平均
                    </span>
                    <span class="mt-1.5 font-mono text-2xl font-black text-purple-950">
                      {{ overallStat.national }}.0%
                    </span>
                    <span class="text-[10px] font-medium text-purple-700 mt-1">全國總常模</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- 2. 核心主體：各評量向度 · 水平基準長條對齊圖（清楚標記 校/縣/全，拿掉落差） -->
          <div class="space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-5 rounded-full bg-[#52796f]"></span>
                <h4 class="text-sm sm:text-base font-bold text-slate-800 m-0">
                  各評量向度 · 水平基準長條對齊圖（共 {{ sortedDimensionStats.length }} 項）
                </h4>
              </div>

              <!-- 排序切換鈕群 -->
              <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                <span class="text-slate-400 font-medium px-1 text-[11px]">排序方式：</span>
                <button
                  type="button"
                  @click="dimensionSortMode = 'default'"
                  class="px-2.5 py-1 rounded-lg font-bold transition cursor-pointer"
                  :class="dimensionSortMode === 'default'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'"
                >
                  標準向度序
                </button>
                <button
                  type="button"
                  @click="dimensionSortMode = 'weak'"
                  class="px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1"
                  :class="dimensionSortMode === 'weak'
                    ? 'bg-[#52796f] text-white shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'"
                >
                  <span>依本班得分由低至高 (優先加強)</span>
                </button>
              </div>
            </div>

            <!-- 標尺刻度列 (Ruler Header) 與圖例欄位整合 -->
            <div class="hidden sm:grid grid-cols-[110px_1fr_260px] gap-4 items-center text-[11px] text-slate-500 px-3 py-1.5 font-mono bg-slate-50/80 rounded-lg border border-slate-200/80">
              <div class="font-bold text-slate-700">評量向度</div>
              <div class="relative flex justify-between px-1 text-slate-400 font-medium">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <div class="flex items-center justify-end gap-3 text-right font-medium">
                <span class="text-[#16a34a] font-bold">本班</span>
                <span class="text-[#f59e0b] font-bold">學校</span>
                <span class="text-[#2563eb] font-bold">縣市</span>
                <span class="text-[#9333ea] font-bold">全體</span>
              </div>
            </div>

            <!-- 向度長條圖列表 (統一 4 色，每個標線均有直觀「校/縣/全」徽章) -->
            <div class="space-y-2">
              <div
                v-for="item in sortedDimensionStats"
                :key="item.name"
                class="group grid grid-cols-1 sm:grid-cols-[110px_1fr_260px] gap-2 sm:gap-4 items-center p-2.5 rounded-xl border border-slate-200/80 hover:border-[#52796f]/40 hover:bg-slate-50/70 transition-all duration-200"
              >
                <!-- 向度名稱 -->
                <div class="flex items-center gap-1.5 shrink-0 truncate">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#16a34a] shrink-0"></span>
                  <strong class="text-xs sm:text-sm font-bold text-slate-800 truncate">{{ item.name }}</strong>
                </div>

                <!-- 長條軌道 (Track) + 3 清楚可辨之基準標線 (校、縣、全) -->
                <div class="relative h-7 bg-slate-100/90 rounded-lg flex items-center px-1 overflow-visible">
                  <!-- 背景刻度導引線 -->
                  <div class="absolute left-1/4 top-0 bottom-0 w-px bg-slate-200 pointer-events-none"></div>
                  <div class="absolute left-2/4 top-0 bottom-0 w-px bg-slate-200 pointer-events-none"></div>
                  <div class="absolute left-3/4 top-0 bottom-0 w-px bg-slate-200 pointer-events-none"></div>

                  <!-- 本班得分長條 (Main Bar - 統一純粹翡翠綠) -->
                  <div
                    class="h-4.5 rounded-md flex items-center justify-end pr-1.5 text-[10px] font-mono font-bold text-white shadow-2xs transition-all duration-500 z-5 bg-gradient-to-r from-[#16a34a] to-[#22c55e]"
                    :style="{ width: `${item.classVal}%` }"
                  >
                    <span v-if="item.classVal >= 15">{{ item.classVal }}%</span>
                  </div>
                  <span v-if="item.classVal < 15" class="ml-1 text-[10px] font-mono font-black text-emerald-700">
                    {{ item.classVal }}%
                  </span>

                  <!-- 學校平均標線 (琥珀橘實線 + 頂部明確小圓標：校) -->
                  <div
                    class="absolute top-0 bottom-0 w-1 bg-[#f59e0b] rounded-full z-20 shadow-xs cursor-help"
                    :style="{ left: `${item.school}%` }"
                    :title="`學校平均: ${item.school}%`"
                  >
                    <span class="absolute -top-3.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#f59e0b] text-[8px] font-bold text-white flex items-center justify-center shadow-2xs select-none">
                      校
                    </span>
                  </div>

                  <!-- 縣市平均標線 (蔚藍色實線 + 頂部明確小圓標：縣) -->
                  <div
                    class="absolute top-0 bottom-0 w-1 bg-[#2563eb] rounded-full z-15 shadow-xs cursor-help"
                    :style="{ left: `${item.county}%` }"
                    :title="`縣市平均: ${item.county}%`"
                  >
                    <span class="absolute -top-3.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#2563eb] text-[8px] font-bold text-white flex items-center justify-center shadow-2xs select-none">
                      縣
                    </span>
                  </div>

                  <!-- 全體平均標線 (質感紫實線 + 頂部明確小圓標：全) -->
                  <div
                    class="absolute top-0 bottom-0 w-1 bg-[#9333ea] rounded-full z-10 shadow-xs cursor-help"
                    :style="{ left: `${item.national}%` }"
                    :title="`全體平均: ${item.national}%`"
                  >
                    <span class="absolute -top-3.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#9333ea] text-[8px] font-bold text-white flex items-center justify-center shadow-2xs select-none">
                      全
                    </span>
                  </div>
                </div>

                <!-- 右側 4 項純粹基準數值 (本班 / 學校 / 縣市 / 全體) - 完全無落差 -->
                <div class="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 text-xs font-mono shrink-0">
                  <!-- 本班 -->
                  <div class="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-950 font-black flex items-center gap-1" title="本班實測">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span>
                    <span>{{ item.classVal }}%</span>
                  </div>
                  <!-- 學校 -->
                  <div class="px-1.5 py-0.5 rounded-md bg-amber-50/80 border border-amber-200 text-amber-900 font-bold flex items-center gap-1" title="學校平均">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                    <span>{{ item.school }}%</span>
                  </div>
                  <!-- 縣市 -->
                  <div class="px-1.5 py-0.5 rounded-md bg-blue-50/80 border border-blue-200 text-blue-900 font-bold flex items-center gap-1" title="縣市平均">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>
                    <span>{{ item.county }}%</span>
                  </div>
                  <!-- 全體 -->
                  <div class="px-1.5 py-0.5 rounded-md bg-purple-50/80 border border-purple-200 text-purple-900 font-bold flex items-center gap-1" title="全體平均">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#9333ea]"></span>
                    <span>{{ item.national }}%</span>
                  </div>
                </div>
              </div>
            </div>
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
    <!-- ============================================================== -->
    <!-- 層級 3：個人成績統計報告（獨立視窗/抽屜最佳化）               -->
    <!-- ============================================================== -->
    <el-drawer
      v-model="studentDrawerVisible"
      :size="drawerSize"
      direction="rtl"
      :with-header="false"
      append-to-body
      class="student-report-drawer"
    >
      <div v-if="activeStudent" class="h-full flex flex-col bg-white text-slate-800">
        <!-- 1. 抽屜頂部固定標題列 (Pinned Header) -->
        <div class="shrink-0 px-5 sm:px-6 py-3.5 border-b border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between z-10 shadow-2xs gap-3 flex-wrap">
          <div class="flex items-center gap-2.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#52796f] bg-[#52796f]/10 px-2.5 py-1 rounded-md">
              個別診斷報告
            </span>
            <h3 class="text-lg font-black text-slate-800 m-0 flex items-center gap-2">
              <span>{{ activeStudent.name }}</span>
              <span class="text-xs font-mono font-medium text-slate-400">({{ inquiryState.classObj }} 班 · {{ activeStudent.seat }} 號)</span>
            </h3>
          </div>

          <!-- 報告視圖切換鈕 (360° 全景網 vs 向度錯題清冊) -->
          <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
            <button
              type="button"
              @click="activeDrawerTab = 'panorama'"
              class="px-3 py-1.5 rounded-lg transition cursor-pointer"
              :class="activeDrawerTab === 'panorama' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
            >
              🌟 360° 跨領域能力全景網
            </button>
            <button
              type="button"
              @click="activeDrawerTab = 'breakdown'"
              class="px-3 py-1.5 rounded-lg transition cursor-pointer"
              :class="activeDrawerTab === 'breakdown' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
            >
              📋 評量向度與錯題清冊
            </button>
          </div>

          <div class="flex items-center gap-1.5">
            <!-- 展開寬版切換按鈕 (Desktop only) -->
            <button
              v-if="!isMobile"
              type="button"
              @click="isDrawerExpanded = !isDrawerExpanded"
              class="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              :title="isDrawerExpanded ? '恢復標準寬度' : '擴展為寬版看板'"
            >
              <svg v-if="!isDrawerExpanded" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9L4 4m0 0h4m-4 0v4m11 1l5-5m0 0h-4m4 0v4M9 15l-5 5m0 0h4m-4 0v-4m11-1l5 5m0 0h-4m4 0v-4" />
              </svg>
            </button>

            <!-- 關閉按鈕 -->
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
        </div>

        <!-- 2. 可平滑捲動的主體內容區 (Scrollable Main Body) -->
        <div
          ref="drawerBodyRef"
          class="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 space-y-5 scrollbar-thin"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <!-- ============================================================== -->
          <!-- 分頁 1：360° 跨領域三科能力全景網 (依附圖全景架構設計)           -->
          <!-- ============================================================== -->
          <div v-if="activeDrawerTab === 'panorama' && studentSubjectReport" class="space-y-5">
            <!-- 學生頂部綜述條 -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#52796f]/10 border border-[#52796f]/20 flex items-center justify-center text-[#52796f] font-black text-base shadow-2xs">
                    {{ activeStudent.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-800 text-sm">{{ activeStudent.name }}</span>
                      <span class="text-xs font-mono font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">座號 {{ activeStudent.seat }}</span>
                      <span class="text-xs font-mono text-slate-400">{{ studentSubjectReport.studentId }}</span>
                    </div>
                    <p class="text-xs text-slate-500 m-0 mt-0.5">
                      {{ state.school }} · {{ inquiryState.classObj }} 班 | 跨領域三科學力檢測全景診斷
                    </p>
                  </div>
                </div>

                <!-- 三科 PR 速覽膠囊 -->
                <div class="flex items-center gap-2 text-xs">
                  <div class="px-3 py-1 bg-blue-50/80 border border-blue-200 rounded-xl text-center">
                    <span class="text-[10px] text-blue-600 font-medium block">國語文 PR</span>
                    <strong class="font-mono text-sm font-black text-blue-900">{{ studentSubjectReport.chinese.pr }}</strong>
                  </div>
                  <div class="px-3 py-1 bg-emerald-50/80 border border-emerald-200 rounded-xl text-center">
                    <span class="text-[10px] text-emerald-600 font-medium block">數學科 PR</span>
                    <strong class="font-mono text-sm font-black text-emerald-900">{{ studentSubjectReport.math.pr }}</strong>
                  </div>
                  <div class="px-3 py-1 bg-purple-50/80 border border-purple-200 rounded-xl text-center">
                    <span class="text-[10px] text-purple-600 font-medium block">英語文 PR</span>
                    <strong class="font-mono text-sm font-black text-purple-900">{{ studentSubjectReport.english.pr }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- 左右雙欄主體 (12 欄格線佈局) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

              <!-- 左欄 (5 Cols)：360° 跨領域三科能力全景網 (雷達圖) -->
              <div class="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-2xs">
                        🧭
                      </span>
                      <h4 class="text-xs sm:text-sm font-bold text-slate-800 m-0">
                        360° 跨領域三科能力全景網
                      </h4>
                    </div>
                    <span class="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      國語 · 數學 · 英語
                    </span>
                  </div>

                  <!-- 雷達圖 SVG -->
                  <div v-if="radarData" class="relative w-full aspect-square max-w-[360px] mx-auto my-2 flex items-center justify-center select-none">
                    <svg viewBox="0 0 400 400" class="w-full h-full overflow-visible">
                      <defs>
                        <radialGradient id="drawerPolyGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.32" />
                          <stop offset="100%" stop-color="#4338ca" stop-opacity="0.12" />
                        </radialGradient>
                        <filter id="drawerPolyGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#4338ca" flood-opacity="0.25" />
                        </filter>
                      </defs>

                      <!-- 背景同心刻度圈 (20%, 40%, 60%, 80%, 100%) -->
                      <circle cx="200" cy="200" r="140" fill="none" stroke="#e2e8f0" stroke-width="1.2" stroke-dasharray="3 3" />
                      <circle cx="200" cy="200" r="112" fill="none" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 2" />
                      <circle cx="200" cy="200" r="84" fill="none" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 2" />
                      <circle cx="200" cy="200" r="56" fill="none" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="2 2" />
                      <circle cx="200" cy="200" r="28" fill="none" stroke="#f1f5f9" stroke-width="0.8" />

                      <!-- 11 軸線導引 -->
                      <g stroke="#cbd5e1" stroke-width="0.9" opacity="0.75">
                        <line
                          v-for="ax in radarData.axes"
                          :key="'line-' + ax.dimKey"
                          x1="200" y1="200"
                          :x2="ax.xOuter" :y2="ax.yOuter"
                          :stroke="hoveredRadarDim === ax.dimKey ? '#4338ca' : '#cbd5e1'"
                          :stroke-width="hoveredRadarDim === ax.dimKey ? 2 : 0.9"
                          class="transition-all duration-200"
                        />
                      </g>

                      <!-- 全校平均多邊形 (綠色虛線) -->
                      <polygon
                        :points="radarData.schoolPolygon"
                        fill="none"
                        stroke="#16a34a"
                        stroke-width="1.8"
                        stroke-dasharray="3 3"
                      />

                      <!-- 縣市常模多邊形 (紫色點線) -->
                      <polygon
                        :points="radarData.countyPolygon"
                        fill="none"
                        stroke="#9333ea"
                        stroke-width="1.8"
                        stroke-dasharray="2 3"
                      />

                      <!-- 學生個人多邊形 (實心漸層 + 亮藍紫邊框) -->
                      <polygon
                        :points="radarData.studentPolygon"
                        fill="url(#drawerPolyGrad)"
                        stroke="#4338ca"
                        stroke-width="2.6"
                        filter="url(#drawerPolyGlow)"
                      />

                      <!-- 個人節點微珠 -->
                      <circle
                        v-for="ax in radarData.axes"
                        :key="'dot-' + ax.dimKey"
                        :cx="ax.sx" :cy="ax.sy"
                        :r="hoveredRadarDim === ax.dimKey ? 6 : 4"
                        fill="#4338ca"
                        stroke="#ffffff"
                        stroke-width="1.5"
                        class="transition-all duration-200 cursor-pointer"
                        @mouseenter="hoveredRadarDim = ax.dimKey"
                        @mouseleave="hoveredRadarDim = null"
                      />

                      <!-- 11 軸向文字標籤 -->
                      <text
                        v-for="ax in radarData.axes"
                        :key="'txt-' + ax.dimKey"
                        :x="ax.tx" :y="ax.ty"
                        :text-anchor="ax.textAnchor"
                        class="text-[9.5px] font-bold font-sans cursor-pointer transition-colors duration-200"
                        :class="hoveredRadarDim === ax.dimKey ? 'fill-[#4338ca] font-black' : 'fill-slate-600'"
                        @mouseenter="hoveredRadarDim = ax.dimKey"
                        @mouseleave="hoveredRadarDim = null"
                      >
                        {{ ax.label }}
                      </text>
                    </svg>
                  </div>

                  <!-- 圖例標籤 -->
                  <div class="flex items-center justify-center gap-3 flex-wrap pt-2 border-t border-slate-100 text-[11px] font-medium">
                    <div class="flex items-center gap-1.5">
                      <span class="w-3 h-2 rounded-xs bg-[#4338ca]"></span>
                      <span class="text-slate-800 font-bold">個人多邊形</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="w-3 h-0.5 border-t-2 border-dashed border-[#16a34a]"></span>
                      <span class="text-slate-600">全校平均</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <span class="w-3 h-0.5 border-t-2 border-dotted border-[#9333ea]"></span>
                      <span class="text-slate-600">縣市常模</span>
                    </div>
                  </div>
                </div>

                <!-- 診斷導讀備註 -->
                <div class="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed">
                  💡 <strong>雷達診斷導讀：</strong> 多邊形向外延伸代表優勢向度，向內凹陷代表需導師重點關聯輔導之學習盲點。
                </div>
              </div>

              <!-- 右欄 (7 Cols)：分科向度深潛卡片 (國語文、數學科、英語文) -->
              <div class="lg:col-span-7 space-y-3.5">

                <!-- 1. 國語文 (冷海藍) -->
                <div class="bg-white border border-blue-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                  <div class="flex items-center justify-between pb-2 border-b border-blue-100">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-4.5 rounded-full bg-[#2563eb]"></span>
                      <h4 class="text-sm sm:text-base font-bold text-slate-900 m-0">國語文</h4>
                      <span class="text-xs font-mono font-medium text-slate-400">(PR: {{ studentSubjectReport.chinese.pr }})</span>
                    </div>
                    <span class="font-mono text-lg font-black text-slate-900">{{ studentSubjectReport.chinese.rate }}%</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div
                      v-for="d in studentSubjectReport.chinese.dims"
                      :key="d.key"
                      class="space-y-1 p-1 rounded-lg transition"
                      :class="hoveredRadarDim === d.key ? 'bg-blue-50/80 ring-1 ring-blue-300' : ''"
                      @mouseenter="hoveredRadarDim = d.key"
                      @mouseleave="hoveredRadarDim = null"
                    >
                      <div class="flex items-center justify-between text-slate-700">
                        <span class="font-bold flex items-center gap-1" :class="d.val < 60 ? 'text-rose-600' : ''">
                          {{ d.name }}
                          <span v-if="d.val < 60" class="text-[9px] px-1 bg-rose-50 text-rose-500 rounded font-normal">補救重點</span>
                        </span>
                        <span class="font-mono font-bold" :class="d.val < 60 ? 'text-rose-600' : 'text-blue-900'">{{ d.val }}%</span>
                      </div>
                      <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :class="d.val < 60 ? 'bg-rose-500' : 'bg-[#2563eb]'"
                          :style="{ width: `${d.val}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 2. 數學科 (翡翠綠) -->
                <div class="bg-white border border-emerald-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                  <div class="flex items-center justify-between pb-2 border-b border-emerald-100">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-4.5 rounded-full bg-[#16a34a]"></span>
                      <h4 class="text-sm sm:text-base font-bold text-slate-900 m-0">數學科</h4>
                      <span class="text-xs font-mono font-medium text-slate-400">(PR: {{ studentSubjectReport.math.pr }})</span>
                    </div>
                    <span class="font-mono text-lg font-black text-slate-900">{{ studentSubjectReport.math.rate }}%</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div
                      v-for="d in studentSubjectReport.math.dims"
                      :key="d.key"
                      class="space-y-1 p-1 rounded-lg transition"
                      :class="hoveredRadarDim === d.key ? 'bg-emerald-50/80 ring-1 ring-emerald-300' : ''"
                      @mouseenter="hoveredRadarDim = d.key"
                      @mouseleave="hoveredRadarDim = null"
                    >
                      <div class="flex items-center justify-between text-slate-700">
                        <span class="font-bold flex items-center gap-1" :class="d.val < 60 ? 'text-rose-600' : ''">
                          {{ d.name }}
                          <span v-if="d.val < 60" class="text-[9px] px-1 bg-rose-50 text-rose-500 rounded font-normal">補救重點</span>
                        </span>
                        <span class="font-mono font-bold" :class="d.val < 60 ? 'text-rose-600' : 'text-emerald-900'">{{ d.val }}%</span>
                      </div>
                      <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :class="d.val < 60 ? 'bg-rose-500' : 'bg-[#16a34a]'"
                          :style="{ width: `${d.val}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 3. 英語文 (典雅紫) -->
                <div class="bg-white border border-purple-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                  <div class="flex items-center justify-between pb-2 border-b border-purple-100">
                    <div class="flex items-center gap-2">
                      <span class="w-2.5 h-4.5 rounded-full bg-[#9333ea]"></span>
                      <h4 class="text-sm sm:text-base font-bold text-slate-900 m-0">英語文</h4>
                      <span class="text-xs font-mono font-medium text-slate-400">(PR: {{ studentSubjectReport.english.pr }})</span>
                    </div>
                    <span class="font-mono text-lg font-black text-slate-900">{{ studentSubjectReport.english.rate }}%</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div
                      v-for="d in studentSubjectReport.english.dims"
                      :key="d.key"
                      class="space-y-1 p-1 rounded-lg transition"
                      :class="hoveredRadarDim === d.key ? 'bg-purple-50/80 ring-1 ring-purple-300' : ''"
                      @mouseenter="hoveredRadarDim = d.key"
                      @mouseleave="hoveredRadarDim = null"
                    >
                      <div class="flex items-center justify-between text-slate-700">
                        <span class="font-bold flex items-center gap-1" :class="d.val < 60 ? 'text-rose-600' : ''">
                          {{ d.name }}
                          <span v-if="d.val < 60" class="text-[9px] px-1 bg-rose-50 text-rose-500 rounded font-normal">補救重點</span>
                        </span>
                        <span class="font-mono font-bold" :class="d.val < 60 ? 'text-rose-600' : 'text-purple-900'">{{ d.val }}%</span>
                      </div>
                      <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          :class="d.val < 60 ? 'bg-rose-500' : 'bg-[#9333ea]'"
                          :style="{ width: `${d.val}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <!-- ============================================================== -->
          <!-- 分頁 2：評量向度與錯題補救清冊 (單科深入對照與清單)             -->
          <!-- ============================================================== -->
          <div v-else-if="activeDrawerTab === 'breakdown'" class="space-y-5">
            <!-- 學生基本資訊卡片 -->
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
                  <span class="text-base font-black font-mono text-[#52796f]">
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

            <!-- 水平答對率對照長條圖 -->
            <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>平均答對率(%) 橫向對比</span>
                <span class="text-[10px] text-slate-400 font-mono">0% ~ 100%</span>
              </div>

              <div class="space-y-2 text-xs">
                <!-- 1. 個人 -->
                <div class="flex items-center gap-3">
                  <span class="w-12 text-slate-500 font-bold shrink-0 text-right">個人</span>
                  <div class="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden relative">
                    <div
                      class="h-full rounded-full flex items-center justify-end pr-2 text-[10px] font-bold font-mono text-white transition-all duration-500 bg-[#52796f]"
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

            <!-- 評量向度表現與錯題診斷表 -->
            <div class="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div class="p-3 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>各評量向度答對率與錯題清冊</span>
                <span class="text-[10px] text-rose-500 font-normal">紅色題號為答錯題目，建議優先輔導</span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="border-b border-slate-200 bg-slate-50/60 text-slate-500 text-[11px] font-semibold">
                      <th class="py-2.5 px-3">評量向度</th>
                      <th class="py-2.5 px-2 text-center w-14">題數</th>
                      <th class="py-2.5 px-3 text-center w-16">答對率</th>
                      <th class="py-2.5 px-3">答對題號</th>
                      <th class="py-2.5 px-3">答錯題號 (補救重點)</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr v-for="dim in studentBreakdown" :key="dim.name" class="hover:bg-slate-50/70 transition">
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
          </div>
        </div>

        <!-- 3. 抽屜底部固定導覽列 (Pinned Footer) -->
        <div class="shrink-0 px-6 py-3 border-t border-slate-100 bg-slate-50/95 backdrop-blur-xs flex items-center justify-between z-10">
          <button
            type="button"
            @click="switchStudent(-1)"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs hover:border-[#52796f]/40"
          >
            <svg class="w-3.5 h-3.5 text-[#52796f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>前一位學生</span>
          </button>

          <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>座號 <strong class="text-slate-800 font-mono text-sm">{{ activeStudent.seat }}</strong> / {{ studentList.length }}</span>
            <span class="text-[10px] text-slate-400 hidden sm:inline">(支援左右滑動翻頁)</span>
          </div>

          <button
            type="button"
            @click="switchStudent(1)"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-white text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs hover:border-[#52796f]/40"
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
import { reactive, ref, computed, watch, nextTick } from 'vue'
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

// 棒棒糖圖 (Lollipop Chart) Y 軸坐標映射 (聚焦 70% ~ 100%)
function getRateY(rate) {
  const val = Number(rate) || 70
  const clamped = Math.max(70, Math.min(100, val))
  // 100% -> Y=32, 70% -> Y=212 (高度 180px)
  return Math.round(212 - ((clamped - 70) / 30) * 180)
}

// 各年級動態班級列表 (Chart 2 及班級切換共用)
const classStats = computed(() => {
  const g = inquiryState.grade || '3'
  const rates = [95, 91, 84, 95, 95, 84, 96, 96]
  return Array.from({ length: 8 }, (_, i) => ({
    name: `${g}0${i + 1}`,
    rate: rates[i % rates.length]
  }))
})

// 可選定之班級選單 (校長、校管、學年主任可選全校各班；導師僅能選擇其任教班級)
const availableClasses = computed(() => {
  if (isHomeroomTeacher.value) {
    return [{ value: inquiryState.classObj, label: `${inquiryState.classObj} 班` }]
  }
  const g = inquiryState.grade || '3'
  return Array.from({ length: 8 }, (_, i) => {
    const code = `${g}0${i + 1}`
    return {
      value: code,
      label: `${code} 班`
    }
  })
})

// 頂部下拉選單的當前綁定值 ('all' 代表學校總覽，或各班代碼如 '306')
const classSelectValue = computed(() => {
  if (isHomeroomTeacher.value) {
    return inquiryState.classObj
  }
  if (inquiryState.level === 'school') {
    return 'all'
  }
  return inquiryState.classObj
})

function handleClassSelectChange(val) {
  if (isHomeroomTeacher.value) return
  if (val === 'all') {
    inquiryState.level = 'school'
  } else {
    inquiryState.classObj = val
    inquiryState.level = 'class'
  }
}

// 當年級變更時，若選定的班級代碼不屬於該年級，自動調整至新的一班
watch(() => inquiryState.grade, (newGrade) => {
  if (!isHomeroomTeacher.value && inquiryState.classObj) {
    const classNum = inquiryState.classObj.slice(-2) || '01'
    inquiryState.classObj = `${newGrade}${classNum}`
  }
})

// 當切換選定班級時，若學生抽屜開啟中，自動切換至新班級的第 1 位學生
watch(() => inquiryState.classObj, () => {
  if (studentDrawerVisible.value && studentList.value.length > 0) {
    activeStudent.value = studentList.value[0]
  }
})

// 各班向度統計數據 (動態隨選定之班級計算)
const classDimensions = computed(() => {
  const cNum = parseInt(inquiryState.classObj?.slice(-2) || '1', 10)
  return [
    { name: '總答對率', national: 70, county: 72, school: 77, classVal: Math.min(100, Math.max(50, 76 + ((cNum * 7) % 15) - 7)) },
    { name: '形音知識', national: 84, county: 86, school: 93, classVal: Math.min(100, Math.max(50, 95 - ((cNum * 5) % 12))) },
    { name: '字詞知識', national: 62, county: 63, school: 68, classVal: Math.min(100, Math.max(50, 73 + ((cNum * 3) % 10))) },
    { name: '語法知識', national: 78, county: 79, school: 83, classVal: Math.min(100, Math.max(50, 82 - ((cNum * 4) % 10))) },
    { name: '修辭知識', national: 65, county: 65, school: 67, classVal: Math.min(100, Math.max(50, 63 + ((cNum * 6) % 12))) },
    { name: '章法知識', national: 49, county: 48, school: 54, classVal: Math.min(100, Math.max(40, 54 - ((cNum * 2) % 8))) },
    { name: '文體知識', national: 65, county: 65, school: 72, classVal: Math.min(100, Math.max(50, 68 + ((cNum * 5) % 10))) },
    { name: '字詞理解', national: 73, county: 74, school: 80, classVal: Math.min(100, Math.max(50, 75 - ((cNum * 3) % 8))) },
    { name: '句子理解', national: 83, county: 84, school: 89, classVal: Math.min(100, Math.max(50, 93 - ((cNum * 4) % 10))) },
    { name: '段落理解', national: 71, county: 73, school: 77, classVal: Math.min(100, Math.max(50, 79 + ((cNum * 2) % 9))) },
    { name: '篇章理解', national: 63, county: 66, school: 73, classVal: Math.min(100, Math.max(50, 71 - ((cNum * 5) % 10))) }
  ]
})

// 全科總答對率與各評量向度清單 (統一維護，自動擴充向度無須硬編碼分類)
const overallStat = computed(() => classDimensions.value[0] || { name: '總答對率', national: 70, county: 72, school: 77, classVal: 75 })
const dimensionStats = computed(() => classDimensions.value.slice(1))

// 向度排序模式 ('default': 標準向度序; 'weak': 本班得分由低至高)
const dimensionSortMode = ref('default')
const sortedDimensionStats = computed(() => {
  const list = [...dimensionStats.value]
  if (dimensionSortMode.value === 'weak') {
    return list.sort((a, b) => a.classVal - b.classVal)
  }
  return list
})

// 環形儀表盤進度計算 (依附圖浮島環形設計，純粹極簡無遮蔽)
const ringCircumference = 2 * Math.PI * 110 // 約 691.15

const ringProgressOffset = computed(() => {
  const score = Math.max(0, Math.min(100, Number(overallStat.value?.classVal) || 76))
  return ringCircumference * (1 - score / 100)
})

// 儀表盤刻度基準融合 (方案 B：軌道微型精準刻度標記線)
const activeHoverBenchmark = ref(null)

const precisionTicks = computed(() => {
  const cx = 160
  const cy = 160
  const r1 = 98
  const r2 = 123
  const stat = overallStat.value || { classVal: 76, school: 77, county: 72, national: 70 }

  const benchmarks = [
    {
      key: 'national',
      label: '全體',
      val: Number(stat.national) || 70,
      color: '#9333ea'
    },
    {
      key: 'county',
      label: '縣市',
      val: Number(stat.county) || 72,
      color: '#2563eb'
    },
    {
      key: 'school',
      label: '學校',
      val: Number(stat.school) || 77,
      color: '#f59e0b'
    }
  ]

  return benchmarks.map(bm => {
    // 圓環進度計算：0% 位於 3 點鐘方位 (0度)，順時針依比例前進
    const angleDeg = (Math.max(0, Math.min(100, bm.val)) / 100) * 360
    const rad = (angleDeg * Math.PI) / 180
    const cosVal = Math.cos(rad)
    const sinVal = Math.sin(rad)

    return {
      ...bm,
      angleDeg,
      p1: {
        x: Number((cx + r1 * cosVal).toFixed(1)),
        y: Number((cy + r1 * sinVal).toFixed(1))
      },
      p2: {
        x: Number((cx + r2 * cosVal).toFixed(1)),
        y: Number((cy + r2 * sinVal).toFixed(1))
      }
    }
  })
})

// 各班學生名冊 (動態隨選定之班級計算)
const studentList = computed(() => {
  const cNum = parseInt(inquiryState.classObj?.slice(-2) || '1', 10)
  const lastNames = ['陳', '林', '黃', '張', '李', '王', '吳', '劉', '蔡', '楊']
  const firstNames = ['小明', '志豪', '雅晴', '佳穎', '宗憲', '冠宇', '子涵', '佩珊']
  const weaks = ['篇章理解', null, null, '章法知識', null, '語法知識', null, null]

  return Array.from({ length: 8 }, (_, i) => {
    const seat = String(i + 1).padStart(2, '0')
    const nameIdx = (i + cNum) % lastNames.length
    const name = `${lastNames[nameIdx]}${firstNames[i % firstNames.length]}`
    const rate = Math.min(99, Math.max(33, 75 + ((i * 17 + cNum * 13) % 45) - 20))
    const prCounty = Math.min(99, Math.max(4, rate - 2 + (i % 5)))
    const prNation = Math.min(99, Math.max(5, rate + (cNum % 3)))
    const weak = rate < 60 ? (weaks[i] || '篇章理解') : null
    return {
      seat,
      name,
      rate,
      prCounty,
      prNation,
      weak
    }
  })
})

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
const isDrawerExpanded = ref(false)
const drawerBodyRef = ref(null)
const isMobile = computed(() => window.innerWidth < 768)

const drawerSize = computed(() => {
  if (isMobile.value) return '100%'
  return isDrawerExpanded.value ? '96vw' : 'min(94vw, 1140px)'
})

// 抽屜內分頁切換 ('panorama': 360度跨領域全景網, 'breakdown': 評量向度與錯題清冊)
const activeDrawerTab = ref('panorama')
const hoveredRadarDim = ref(null)

// 學生跨領域三科成績與向度分析 (動態隨選取學生計算)
const studentSubjectReport = computed(() => {
  const st = activeStudent.value
  if (!st) return null

  const baseRate = st.rate || 85
  const seed = parseInt(st.seat || '1', 10)

  // 1. 國語文 (冷海藍)
  const chineseRate = Math.min(98, Math.max(50, baseRate + ((seed * 7) % 15) - 5))
  const chinesePr = Math.min(99, Math.max(45, st.prCounty || 90))
  const chineseDims = [
    { name: '形音知識', key: 'chi-1', val: Math.min(100, Math.max(40, chineseRate - 15 + ((seed * 3) % 20))) },
    { name: '字詞知識', key: 'chi-2', val: Math.min(100, Math.max(55, chineseRate + 10)) },
    { name: '語法知識', key: 'chi-3', val: Math.min(100, Math.max(50, chineseRate + 5)) },
    { name: '修辭知識', key: 'chi-4', val: Math.min(100, Math.max(30, chineseRate - 25 + ((seed * 5) % 20))) }
  ]

  // 2. 數學科 (翡翠綠)
  const mathRate = Math.min(99, Math.max(55, baseRate + ((seed * 11) % 18) - 4))
  const mathPr = Math.min(99, Math.max(50, (st.prCounty || 90) + 3))
  const mathDims = [
    { name: '數與計算', key: 'mat-1', val: Math.min(100, Math.max(50, mathRate + 5)) },
    { name: '量與實測', key: 'mat-2', val: Math.min(100, Math.max(45, mathRate + 2)) },
    { name: '空間與形狀', key: 'mat-3', val: Math.min(100, Math.max(50, mathRate + 6)) },
    { name: '關係', key: 'mat-4', val: Math.min(100, Math.max(35, mathRate - 18 + ((seed * 4) % 15))) }
  ]

  // 3. 英語文 (典雅紫)
  const engRate = Math.min(99, Math.max(50, baseRate + ((seed * 13) % 16) - 6))
  const engPr = Math.min(99, Math.max(40, (st.prCounty || 90) - 4))
  const engDims = [
    { name: '聽力 - 語音聽辨', key: 'eng-1', val: Math.min(100, Math.max(50, engRate + 4)) },
    { name: '聽力 - 辭彙聽辨', key: 'eng-2', val: Math.min(100, Math.max(45, engRate + 5)) },
    { name: '聽力 - 教室生活群句理解與回應', key: 'eng-3', val: Math.min(100, Math.max(35, engRate - 12 + ((seed * 6) % 16))) },
    { name: '聽力 - 文化節慶理解', key: 'eng-4', val: Math.min(100, Math.max(50, engRate + 6)) }
  ]

  return {
    studentId: `STU_113_${String(seed).padStart(4, '0')}`,
    chinese: { name: '國語文', pr: chinesePr, rate: chineseRate, color: '#2563eb', dims: chineseDims },
    math: { name: '數學科', pr: mathPr, rate: mathRate, color: '#16a34a', dims: mathDims },
    english: { name: '英語文', pr: engPr, rate: engRate, color: '#9333ea', dims: engDims }
  }
})

// 360° 雷達網 11 軸向配置 (依附圖順時針方向排列)
const radarAxes = [
  { label: '[國] 形音知識', shortLabel: '形音知識', subject: 'chinese', dimKey: 'chi-1', textAnchor: 'middle', tx: 200, ty: 44 },
  { label: '[英] 生活群句', shortLabel: '生活群句', subject: 'english', dimKey: 'eng-3', textAnchor: 'start', tx: 295, ty: 70 },
  { label: '[英] 辭彙聽辨', shortLabel: '辭彙聽辨', subject: 'english', dimKey: 'eng-2', textAnchor: 'start', tx: 345, ty: 145 },
  { label: '[英] 語音聽辨', shortLabel: '語音聽辨', subject: 'english', dimKey: 'eng-1', textAnchor: 'start', tx: 355, ty: 225 },
  { label: '[數] 關係', shortLabel: '關係', subject: 'math', dimKey: 'mat-4', textAnchor: 'start', tx: 318, ty: 308 },
  { label: '[數] 空間形狀', shortLabel: '空間形狀', subject: 'math', dimKey: 'mat-3', textAnchor: 'middle', tx: 245, ty: 355 },
  { label: '[數] 量與實測', shortLabel: '量與實測', subject: 'math', dimKey: 'mat-2', textAnchor: 'middle', tx: 155, ty: 355 },
  { label: '[數] 數與計算', shortLabel: '數與計算', subject: 'math', dimKey: 'mat-1', textAnchor: 'end', tx: 82, ty: 308 },
  { label: '[國] 語法知識', shortLabel: '語法知識', subject: 'chinese', dimKey: 'chi-3', textAnchor: 'end', tx: 45, ty: 225 },
  { label: '[國] 字詞知識', shortLabel: '字詞知識', subject: 'chinese', dimKey: 'chi-2', textAnchor: 'end', tx: 55, ty: 145 },
  { label: '[國] 修辭知識', shortLabel: '修辭知識', subject: 'chinese', dimKey: 'chi-4', textAnchor: 'end', tx: 105, ty: 70 }
]

const radarData = computed(() => {
  const rep = studentSubjectReport.value
  if (!rep) return null

  const cx = 200, cy = 200, rMax = 140
  const n = radarAxes.length

  const studentPoints = []
  const schoolPoints = []
  const countyPoints = []

  const axesWithCoords = radarAxes.map((axis, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
    const cosVal = Math.cos(angle)
    const sinVal = Math.sin(angle)

    const xOuter = Number((cx + rMax * cosVal).toFixed(1))
    const yOuter = Number((cy + rMax * sinVal).toFixed(1))

    let val = 80
    const subjData = rep[axis.subject]
    if (subjData && subjData.dims) {
      const d = subjData.dims.find(item => item.key === axis.dimKey)
      if (d) val = d.val
    }

    const schoolVal = 77 + ((i * 3) % 10) - 4
    const countyVal = 72 + ((i * 2) % 8) - 3

    const rStudent = (Math.max(10, Math.min(100, val)) / 100) * rMax
    const sx = Number((cx + rStudent * cosVal).toFixed(1))
    const sy = Number((cy + rStudent * sinVal).toFixed(1))
    studentPoints.push(`${sx},${sy}`)

    const rSchool = (schoolVal / 100) * rMax
    const scx = Number((cx + rSchool * cosVal).toFixed(1))
    const scy = Number((cy + rSchool * sinVal).toFixed(1))
    schoolPoints.push(`${scx},${scy}`)

    const rCounty = (countyVal / 100) * rMax
    const cxCounty = Number((cx + rCounty * cosVal).toFixed(1))
    const cyCounty = Number((cy + rCounty * sinVal).toFixed(1))
    countyPoints.push(`${cxCounty},${cyCounty}`)

    return {
      ...axis,
      val,
      schoolVal,
      countyVal,
      xOuter,
      yOuter,
      sx,
      sy
    }
  })

  return {
    axes: axesWithCoords,
    studentPolygon: studentPoints.join(' '),
    schoolPolygon: schoolPoints.join(' '),
    countyPolygon: countyPoints.join(' ')
  }
})

function scrollToTop() {
  nextTick(() => {
    if (drawerBodyRef.value) {
      drawerBodyRef.value.scrollTop = 0
    }
  })
}

// 觸控左右滑動翻頁 (Touch Swipe Navigation)
let touchStartX = 0
let touchStartY = 0

function handleTouchStart(e) {
  if (e.touches && e.touches[0]) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }
}

function handleTouchEnd(e) {
  if (!e.changedTouches || !e.changedTouches[0]) return
  const deltaX = e.changedTouches[0].clientX - touchStartX
  const deltaY = e.changedTouches[0].clientY - touchStartY

  // 當水平滑動距離超過 50px 且水平位移明顯大於垂直滾動時觸發切換
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
    if (deltaX < 0) {
      switchStudent(1) // 向左滑 -> 後一位學生
    } else {
      switchStudent(-1) // 向右滑 -> 前一位學生
    }
  }
}

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
  scrollToTop()
}

function switchStudent(offset) {
  if (!activeStudent.value) return
  const curIdx = studentList.value.findIndex(s => s.seat === activeStudent.value.seat)
  const nextIdx = curIdx + offset
  if (nextIdx >= 0 && nextIdx < studentList.value.length) {
    activeStudent.value = studentList.value[nextIdx]
    scrollToTop()
  }
}
</script>

<style scoped>
:deep(.student-report-drawer) {
  border-top-left-radius: 1.25rem !important;
  border-bottom-left-radius: 1.25rem !important;
  overflow: hidden !important;
  box-shadow: -8px 0 32px rgba(15, 23, 42, 0.15) !important;
}

:deep(.student-report-drawer .el-drawer__body) {
  padding: 0 !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  max-height: 100vh !important;
}
</style>
