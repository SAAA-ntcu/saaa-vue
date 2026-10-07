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
        <div class="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
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

          <!-- 右側標籤與多指針圖例 -->
          <div class="flex items-center gap-3 text-xs flex-wrap font-medium">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#9333ea]"></span>
              <span class="text-slate-600">總參與平均</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
              <span class="text-slate-600">縣市平均</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
              <span class="text-slate-600">學校平均</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#84cc16]"></span>
              <span class="text-slate-800 font-bold">班級實測 (主指針)</span>
            </div>
          </div>
        </div>

        <!-- 多指針時鐘儀表盤全景呈現：頂部總答對率 + 下方 10 大向度多指針時鐘儀表盤全景牆 -->
        <div class="space-y-6 pt-2">
          
          <!-- 1. 頂部核心橫幅：【全科總答對率 · 多指針時鐘主儀表盤】 -->
          <div class="bg-gradient-to-br from-slate-50 via-white to-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              <!-- 左側：270 度多指針大儀表盤 (5 Cols) -->
              <div class="lg:col-span-5 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                <div class="w-full max-w-[320px] aspect-[16/11] relative flex items-center justify-center">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 320 220">
                    <defs>
                      <filter id="hub-shadow-hero" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.25"/>
                      </filter>
                    </defs>

                    <!-- 外圈分段彩弧 (0-5% 墨灰、5-60% 萊姆綠、60-85% 皇家藍、85-100% 淺灰) -->
                    <path :d="getDialArc(0, 5, 160, 135, 95)" fill="none" stroke="#334155" stroke-width="7" stroke-linecap="round" />
                    <path :d="getDialArc(5, 60, 160, 135, 95)" fill="none" stroke="#84cc16" stroke-width="7" />
                    <path :d="getDialArc(60, 85, 160, 135, 95)" fill="none" stroke="#2563eb" stroke-width="7" />
                    <path :d="getDialArc(85, 100, 160, 135, 95)" fill="none" stroke="#e2e8f0" stroke-width="7" stroke-linecap="round" />

                    <!-- 內部刻度數字 (每 20%) -->
                    <g v-for="p in [0, 20, 40, 60, 80, 100]" :key="'hero-tick-' + p">
                      <line
                        :x1="160 + Math.cos((135 + p * 2.7) * Math.PI / 180) * 86"
                        :y1="135 + Math.sin((135 + p * 2.7) * Math.PI / 180) * 86"
                        :x2="160 + Math.cos((135 + p * 2.7) * Math.PI / 180) * 94"
                        :y2="135 + Math.sin((135 + p * 2.7) * Math.PI / 180) * 94"
                        stroke="#64748b"
                        stroke-width="1.8"
                      />
                      <text
                        :x="160 + Math.cos((135 + p * 2.7) * Math.PI / 180) * 75"
                        :y="135 + Math.sin((135 + p * 2.7) * Math.PI / 180) * 75 + 3"
                        font-size="9"
                        font-family="monospace"
                        font-weight="bold"
                        fill="#64748b"
                        text-anchor="middle"
                      >
                        {{ p }}
                      </text>
                    </g>

                    <!-- 四根同心指針 (中心 160, 135) -->
                    <!-- 總參與 (Purple) -->
                    <line
                      x1="160" y1="135" x2="160" y2="68"
                      stroke="#9333ea" stroke-width="2.5" stroke-linecap="round"
                      class="transition-all duration-500 ease-out opacity-80"
                      :style="{ transform: `rotate(${getNeedleRotation(overallStat.national)}deg)`, transformOrigin: '160px 135px' }"
                    />
                    <!-- 縣市 (Royal Blue) -->
                    <line
                      x1="160" y1="135" x2="160" y2="61"
                      stroke="#2563eb" stroke-width="3" stroke-linecap="round"
                      class="transition-all duration-500 ease-out opacity-85"
                      :style="{ transform: `rotate(${getNeedleRotation(overallStat.county)}deg)`, transformOrigin: '160px 135px' }"
                    />
                    <!-- 學校 (Amber) -->
                    <line
                      x1="160" y1="135" x2="160" y2="53"
                      stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"
                      class="transition-all duration-500 ease-out"
                      :style="{ transform: `rotate(${getNeedleRotation(overallStat.school)}deg)`, transformOrigin: '160px 135px' }"
                    />
                    <!-- 班級實測主指針 (Lime Green) -->
                    <line
                      x1="160" y1="135" x2="160" y2="44"
                      stroke="#84cc16" stroke-width="4.5" stroke-linecap="round"
                      class="transition-all duration-500 ease-out drop-shadow-md"
                      :style="{ transform: `rotate(${getNeedleRotation(overallStat.classVal)}deg)`, transformOrigin: '160px 135px' }"
                    />

                    <!-- 金色軸心 -->
                    <circle cx="160" cy="135" r="11" fill="#fbbf24" stroke="#ffffff" stroke-width="2.5" filter="url(#hub-shadow-hero)" />
                    <circle cx="160" cy="135" r="3.5" fill="#d97706" />

                    <!-- 底部中央標籤 -->
                    <text x="160" y="212" font-size="11" font-weight="bold" fill="#64748b" text-anchor="middle">
                      全科總答對率 · 鐘面指針
                    </text>
                  </svg>
                </div>
              </div>

              <!-- 右側：總答對率數值診斷艙 (7 Cols) -->
              <div class="lg:col-span-7 space-y-4">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-[#52796f] text-white">
                      🌟 全科總答對率
                    </span>
                    <span class="text-xs text-slate-500 font-medium">
                      {{ state.school }} {{ inquiryState.classObj }} 班 綜合指標
                    </span>
                  </div>
                  <span
                    class="px-2.5 py-1 rounded-lg text-xs font-bold font-mono"
                    :class="overallStat.classVal >= overallStat.school ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                  >
                    {{ overallStat.classVal >= overallStat.school ? '+' : '' }}{{ overallStat.classVal - overallStat.school }}%
                  </span>
                </div>

                <div class="flex items-baseline gap-3">
                  <span class="text-4xl sm:text-5xl font-mono font-black text-slate-900 tracking-tight">
                    {{ overallStat.classVal }}.0%
                  </span>
                  <span class="text-xs text-slate-500">
                    高於全國均標 ({{ overallStat.national }}%) · 全縣均標 ({{ overallStat.county }}%)
                  </span>
                </div>

                <!-- 4 欄獨立彩色數值艙 (零文字重疊) -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div class="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/60 flex flex-col items-center">
                    <span class="text-[10px] font-bold text-purple-900 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#9333ea]"></span>
                      總參與平均
                    </span>
                    <span class="mt-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#9333ea] text-white">
                      {{ overallStat.national }}.0%
                    </span>
                  </div>

                  <div class="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 flex flex-col items-center">
                    <span class="text-[10px] font-bold text-blue-900 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#2563eb]"></span>
                      縣市平均
                    </span>
                    <span class="mt-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#2563eb] text-white">
                      {{ overallStat.county }}.0%
                    </span>
                  </div>

                  <div class="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex flex-col items-center">
                    <span class="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                      學校平均
                    </span>
                    <span class="mt-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#f59e0b] text-white">
                      {{ overallStat.school }}.0%
                    </span>
                  </div>

                  <div class="p-2.5 rounded-xl bg-lime-50 border border-lime-300 shadow-2xs flex flex-col items-center">
                    <span class="text-[10px] font-bold text-lime-900 flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#84cc16]"></span>
                      {{ inquiryState.classObj }} 班實測
                    </span>
                    <span class="mt-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-black bg-[#84cc16] text-white">
                      {{ overallStat.classVal }}.0%
                    </span>
                  </div>
                </div>

                <p class="text-xs text-slate-500 m-0 leading-relaxed">
                  本班在全體學力常模中位居前段，下方展開 10 大向度的獨立多指針時鐘儀表盤，綠色主指針越過橘色學校刻度即代表達標勝出。
                </p>
              </div>

            </div>
          </div>

          <!-- 2. 各評量向度 · 多指針時鐘儀表盤矩陣 (共 10 項，統一整齊排列) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between border-b border-slate-200 pb-2">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-5 rounded-full bg-[#52796f]"></span>
                <h4 class="text-sm sm:text-base font-bold text-slate-800 m-0">各評量向度 · 多指針時鐘儀表盤（共 {{ dimensionStats.length }} 項）</h4>
              </div>
              <span class="text-xs text-slate-400 font-medium">每向度獨立 4 指針鐘面 · 即時常模比對</span>
            </div>

            <!-- 統一網格整齊排列 (整齊 5 欄排列，行動端響應自適應) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <div
                v-for="item in dimensionStats"
                :key="item.name"
                class="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs hover:shadow-md hover:border-[#52796f] transition-all flex flex-col justify-between"
              >
                <!-- 卡片頂部：標題與 89% -4% -->
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="item.classVal >= item.school ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                    <strong class="text-sm font-bold text-slate-800 truncate">{{ item.name }}</strong>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="font-mono font-black text-sm text-slate-900">{{ item.classVal }}%</span>
                    <span
                      class="px-1.5 py-0.5 rounded text-xs font-bold font-mono"
                      :class="item.classVal >= item.school ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                    >
                      {{ item.classVal >= item.school ? '+' : '' }}{{ item.classVal - item.school }}%
                    </span>
                  </div>
                </div>

                <!-- 270 度多指針鐘面 SVG (文字刻度加大，中心 120, 110, 半徑 70) -->
                <div class="w-full aspect-[16/11] relative flex items-center justify-center my-1.5">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 240 185">
                    <!-- 外圈分段彩弧 (0-5% 墨灰、5-60% 萊姆綠、60-85% 皇家藍、85-100% 淺灰) -->
                    <path :d="getDialArc(0, 5, 120, 110, 70)" fill="none" stroke="#334155" stroke-width="6.5" stroke-linecap="round" />
                    <path :d="getDialArc(5, 60, 120, 110, 70)" fill="none" stroke="#84cc16" stroke-width="6.5" />
                    <path :d="getDialArc(60, 85, 120, 110, 70)" fill="none" stroke="#2563eb" stroke-width="6.5" />
                    <path :d="getDialArc(85, 100, 120, 110, 70)" fill="none" stroke="#e2e8f0" stroke-width="6.5" stroke-linecap="round" />

                    <!-- 內部刻度線與放大的刻度數字 (每 20%) -->
                    <g v-for="p in [0, 20, 40, 60, 80, 100]" :key="'dim-tick-' + p">
                      <line
                        :x1="120 + Math.cos((135 + p * 2.7) * Math.PI / 180) * 62"
                        :y1="110 + Math.sin((135 + p * 2.7) * Math.PI / 180) * 62"
                        :x2="120 + Math.cos((135 + p * 2.7) * Math.PI / 180) * 69"
                        :y2="110 + Math.sin((135 + p * 2.7) * Math.PI / 180) * 69"
                        stroke="#64748b"
                        stroke-width="1.8"
                      />
                      <text
                        :x="120 + Math.cos((135 + p * 2.7) * Math.PI / 180) * 50"
                        :y="110 + Math.sin((135 + p * 2.7) * Math.PI / 180) * 50 + 4"
                        font-size="12"
                        font-family="monospace"
                        font-weight="bold"
                        fill="#475569"
                        text-anchor="middle"
                      >
                        {{ p }}
                      </text>
                    </g>

                    <!-- 4 根同心指針 -->
                    <!-- 總參與 (Purple) -->
                    <line
                      x1="120" y1="110" x2="120" y2="58"
                      stroke="#9333ea" stroke-width="2.5" stroke-linecap="round"
                      class="transition-all duration-500 ease-out opacity-85"
                      :style="{ transform: `rotate(${getNeedleRotation(item.national)}deg)`, transformOrigin: '120px 110px' }"
                    />
                    <!-- 縣市 (Royal Blue) -->
                    <line
                      x1="120" y1="110" x2="120" y2="52"
                      stroke="#2563eb" stroke-width="3" stroke-linecap="round"
                      class="transition-all duration-500 ease-out opacity-90"
                      :style="{ transform: `rotate(${getNeedleRotation(item.county)}deg)`, transformOrigin: '120px 110px' }"
                    />
                    <!-- 學校 (Amber) -->
                    <line
                      x1="120" y1="110" x2="120" y2="46"
                      stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round"
                      class="transition-all duration-500 ease-out"
                      :style="{ transform: `rotate(${getNeedleRotation(item.school)}deg)`, transformOrigin: '120px 110px' }"
                    />
                    <!-- 班級實測主指針 (Lime Green) -->
                    <line
                      x1="120" y1="110" x2="120" y2="38"
                      stroke="#84cc16" stroke-width="4.5" stroke-linecap="round"
                      class="transition-all duration-500 ease-out drop-shadow-sm"
                      :style="{ transform: `rotate(${getNeedleRotation(item.classVal)}deg)`, transformOrigin: '120px 110px' }"
                    />

                    <!-- 金色軸心 -->
                    <circle cx="120" cy="110" r="8.5" fill="#fbbf24" stroke="#ffffff" stroke-width="2" />
                    <circle cx="120" cy="110" r="3" fill="#d97706" />

                    <!-- 指針下方中央：醒目大字班級實測數值 -->
                    <text x="120" y="148" font-size="16" font-family="monospace" font-weight="900" fill="#0f172a" text-anchor="middle">
                      {{ item.classVal }}%
                    </text>
                    <text x="120" y="165" font-size="11" font-weight="bold" fill="#64748b" text-anchor="middle">
                      班級實測
                    </text>
                  </svg>
                </div>

                <!-- 卡片底部：4 欄數值艙 (零碰撞排版，字體加大清晰) -->
                <div class="grid grid-cols-4 gap-1 pt-2.5 border-t border-slate-100 text-center">
                  <div class="bg-purple-50/80 rounded-lg py-1.5 px-0.5 border border-purple-100 flex flex-col items-center justify-center">
                    <span class="text-[11px] font-bold text-purple-900 leading-tight">總參與</span>
                    <span class="font-mono text-xs font-black text-purple-950 mt-0.5">{{ item.national }}%</span>
                  </div>
                  <div class="bg-blue-50/80 rounded-lg py-1.5 px-0.5 border border-blue-100 flex flex-col items-center justify-center">
                    <span class="text-[11px] font-bold text-blue-900 leading-tight">縣市</span>
                    <span class="font-mono text-xs font-black text-blue-950 mt-0.5">{{ item.county }}%</span>
                  </div>
                  <div class="bg-amber-50/80 rounded-lg py-1.5 px-0.5 border border-amber-100 flex flex-col items-center justify-center">
                    <span class="text-[11px] font-bold text-amber-900 leading-tight">學校</span>
                    <span class="font-mono text-xs font-black text-amber-950 mt-0.5">{{ item.school }}%</span>
                  </div>
                  <div class="bg-lime-50 rounded-lg py-1.5 px-0.5 border-2 border-lime-400 flex flex-col items-center justify-center shadow-2xs">
                    <span class="text-[11px] font-extrabold text-lime-950 leading-tight">本班</span>
                    <span class="font-mono text-xs font-black text-lime-950 mt-0.5">{{ item.classVal }}%</span>
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
        <div class="shrink-0 px-6 py-3.5 border-b border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between z-10 shadow-2xs">
          <div class="flex items-center gap-2.5">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#52796f] bg-[#52796f]/10 px-2.5 py-1 rounded-md">
              個別診斷報告
            </span>
            <h3 class="text-lg font-black text-slate-800 m-0 flex items-center gap-2">
              <span>{{ activeStudent.name }}</span>
              <span class="text-xs font-mono font-medium text-slate-400">({{ inquiryState.classObj }}班 · {{ activeStudent.seat }}號)</span>
            </h3>
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
          class="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-5 space-y-5 scrollbar-thin"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
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

          <!-- 評量向度表現與錯題診斷表 (精確對應圖一下方清冊，自然展開隨主體滾動) -->
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

// 儀表盤角度計算 (0% = 135 deg, 100% = 405 deg)
const pctToDialDeg = (pct) => 135 + (pct || 0) * 2.7
const getNeedleRotation = (pct) => pctToDialDeg(pct) - 270

// 儀表盤外圈分段圓弧生成
const getDialArc = (p1, p2, cx = 120, cy = 110, r = 70) => {
  const deg1 = pctToDialDeg(p1), deg2 = pctToDialDeg(p2)
  const rad1 = deg1 * Math.PI / 180, rad2 = deg2 * Math.PI / 180
  const x1 = cx + Math.cos(rad1) * r, y1 = cy + Math.sin(rad1) * r
  const x2 = cx + Math.cos(rad2) * r, y2 = cy + Math.sin(rad2) * r
  const delta = (p2 - p1) * 2.7
  const largeArc = delta > 180 ? 1 : 0
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`
}

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
  return isDrawerExpanded.value ? '880px' : '680px'
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
