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
      <!-- 五年級專屬：高通真實學力資料總覽、問題定位儀表、待加強分布樹狀圖與優先行動方案 (引用 gaotong-dashboard) -->
      <section v-if="isGaotongGrade(inquiryState.grade)" class="space-y-5">
        <!-- 頂部 4 大校務指標卡 -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div class="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <span class="text-xs text-slate-400 font-medium">五年級在籍學生</span>
            <div class="text-xl sm:text-2xl font-mono font-black text-slate-800">
              {{ gaotongSchoolStats.totalStudents }} <span class="text-xs font-normal text-slate-400">人</span>
            </div>
            <div class="text-[11px] text-slate-500">501–509 班 (共 9 班)</div>
          </div>
          <div class="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <span class="text-xs text-slate-400 font-medium">跨科成績完整度</span>
            <div class="text-xl sm:text-2xl font-mono font-black text-emerald-600">
              {{ gaotongSchoolStats.completenessRate }}%
            </div>
            <div class="text-[11px] text-emerald-700/80">缺考／待補資料已全數標示</div>
          </div>
          <div class="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <span class="text-xs text-slate-400 font-medium">優先處理班級</span>
            <div class="text-xl sm:text-2xl font-mono font-black text-amber-600">
              {{ gaotongSchoolStats.priorityClassCount }} <span class="text-xs font-normal text-slate-400">班</span>
            </div>
            <div class="text-[11px] text-amber-700/80">至少一科待加強率偏高</div>
          </div>
          <div class="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <span class="text-xs text-slate-400 font-medium">跨科到考率</span>
            <div class="text-xl sm:text-2xl font-mono font-black text-blue-600">
              {{ gaotongSchoolStats.testedRate }}%
            </div>
            <div class="text-[11px] text-blue-700/80">三科皆有完整作答紀錄</div>
          </div>
        </div>

        <!-- 01 / 科目問題定位與待加強分布樹狀圖 -->
        <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-[#52796f] bg-[#52796f]/10 px-2 py-0.5 rounded">
                01 / 科目問題定位
              </span>
              <h3 class="text-base font-bold text-slate-800 m-0 mt-1">
                各學科與縣市差距指針 · 待加強人數分布樹狀圖
              </h3>
            </div>
            <span class="text-xs text-slate-400">
              指針顯示與縣市平均之差距 (pp)；點擊科目卡可切換下方分布圖
            </span>
          </div>

          <!-- 3 科目卡片 (點擊切換 Treemap 焦點科目) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              v-for="sub in gaotongSchoolStats.subjects"
              :key="sub.id"
              type="button"
              @click="chooseTreemapSubject(sub.id)"
              class="p-4 rounded-xl border text-left transition-all cursor-pointer relative"
              :class="treemapSubjectKey === sub.id
                ? 'border-[#52796f] ring-2 ring-[#52796f]/20 bg-slate-50/60 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 bg-white'"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2 font-bold text-sm text-slate-800">
                  <span class="w-2.5 h-2.5 rounded-full" :style="{ background: sub.color }"></span>
                  {{ sub.name }}
                </div>
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  :class="sub.delta < 0 ? 'bg-rose-100 text-rose-800' : sub.delta === 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'"
                >
                  {{ sub.delta < 0 ? '需要檢視' : sub.delta === 0 ? '基準線' : '高於縣均' }}
                </span>
              </div>

              <!-- 指針儀表盤 -->
              <NeedleGauge :value="sub.delta" :label="'與縣市差距'" :color="sub.color" :height="145" :compact="true" />

              <div class="mt-2 pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-center text-[10px]">
                <div>
                  <span class="text-slate-400 block">全校</span>
                  <strong class="text-slate-700 font-mono text-xs">{{ sub.schoolAvg }}%</strong>
                </div>
                <div>
                  <span class="text-slate-400 block">縣市</span>
                  <strong class="text-slate-700 font-mono text-xs">{{ sub.countyAvg }}%</strong>
                </div>
                <div>
                  <span class="text-slate-400 block">待加強</span>
                  <strong class="text-rose-600 font-mono text-xs">{{ sub.supportCount }}人</strong>
                </div>
              </div>
              <p class="text-[11px] text-slate-500 m-0 mt-2 leading-relaxed">{{ sub.note }}</p>
            </button>
          </div>

          <!-- 各班待加強樹狀分布圖 (SupportTreemap) -->
          <div class="p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h4 class="text-xs font-bold text-slate-700 m-0 flex items-center gap-1.5">
                <span class="w-1.5 h-3 rounded-full" :style="{ background: treemapSubject.color }"></span>
                目前焦點：{{ treemapSubject.name }} · 501–509 各班待加強人數分布
              </h4>
              <span class="text-[11px] text-slate-500">
                點擊任一班級區塊直達班級向度診斷
              </span>
            </div>
            <SupportTreemap :subject-key="treemapSubjectKey" @select-class="drillToClass($event)" />
          </div>
        </div>

        <!-- 02 / 優先處理項目與行動建議抽屜 -->
        <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                02 / 後續支持行動
              </span>
              <h3 class="text-base font-bold text-slate-800 m-0 mt-1">
                學年優先處理項目 · 教學支持與備課建議
              </h3>
            </div>
            <span class="text-xs text-slate-400">點擊查看教務處觀課、教材與協同支援方案</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              v-for="(item, idx) in PRIORITY_ITEMS"
              :key="item.key"
              type="button"
              @click="openAction(item.key)"
              class="p-3.5 bg-slate-50/80 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-left transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="w-5 h-5 rounded-full bg-slate-200 group-hover:bg-[#52796f] group-hover:text-white font-mono text-xs font-bold flex items-center justify-center transition">
                    {{ idx + 1 }}
                  </span>
                  <span
                    class="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    :class="item.tone === 'danger' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'"
                  >
                    {{ item.tone === 'danger' ? '優先' : '關懷' }}
                  </span>
                </div>
                <strong class="text-sm font-bold text-slate-800 block">{{ item.title }}</strong>
                <p class="text-xs text-slate-500 m-0 mt-1">{{ item.reason }}</p>
              </div>
              <span class="text-[11px] text-[#52796f] font-bold mt-2.5 flex items-center gap-1">
                查看建議措施 ➔
              </span>
            </button>
          </div>
        </div>
      </section>

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

      <!-- 五年級專屬：班級支持結構與到考指標卡 (引用 gaotong-dashboard) -->
      <section v-if="isGaotongGrade(inquiryState.grade) && gaotongClassStats" class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-0.5">
          <span class="text-[11px] text-slate-400 font-medium">在籍學生</span>
          <div class="text-lg font-mono font-black text-slate-800">
            {{ gaotongClassStats.totalStudents }} <span class="text-xs font-normal text-slate-400">人</span>
          </div>
          <div class="text-[10px] text-slate-500">依座號順序</div>
        </div>
        <div class="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-0.5">
          <span class="text-[11px] text-slate-400 font-medium">到考率</span>
          <div class="text-lg font-mono font-black text-emerald-600">
            {{ gaotongClassStats.testedRate }}%
          </div>
          <div class="text-[10px] text-emerald-700/80">全數有效作答</div>
        </div>
        <div class="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-0.5">
          <span class="text-[11px] text-slate-400 font-medium">多科共同關注</span>
          <div class="text-lg font-mono font-black text-rose-600">
            {{ gaotongClassStats.multiSupportCount }} <span class="text-xs font-normal text-slate-400">人</span>
          </div>
          <div class="text-[10px] text-rose-700/80">2 科以上待加強</div>
        </div>
        <div class="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-0.5">
          <span class="text-[11px] text-slate-400 font-medium">跨科不一致</span>
          <div class="text-lg font-mono font-black text-amber-600">
            {{ gaotongClassStats.inconsistentCount }} <span class="text-xs font-normal text-slate-400">人</span>
          </div>
          <div class="text-[10px] text-amber-700/80">各科表現落差顯著</div>
        </div>
      </section>

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
            全班共 <strong class="text-slate-800">{{ allStudentsInClass.length }}</strong> 名學生
          </div>
        </div>

        <!-- 關注廣度與訊號篩選按鈕列 (引用自 gaotong-dashboard) -->
        <div v-if="isGaotongGrade(inquiryState.grade)" class="p-3 bg-slate-50/40 border-b border-slate-200/70 flex items-center gap-1.5 flex-wrap">
          <button
            v-for="flt in filterOptions"
            :key="flt.id"
            type="button"
            @click="currentFilter = flt.id"
            class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            :class="currentFilter === flt.id
              ? 'bg-[#52796f] text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'"
          >
            <span>{{ flt.label }}</span>
            <span
              class="px-1.5 py-0.2 rounded-full text-[10px] font-mono"
              :class="currentFilter === flt.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'"
            >
              {{ filterCounts[flt.id] }}
            </span>
          </button>
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
                <td class="py-3 px-4 text-center font-mono font-bold" :class="st.supportBreadth?.breadth >= 1 ? 'text-rose-700' : 'text-slate-800'">
                  {{ st.rate }}%
                </td>
                <td class="py-3 px-4 text-center font-mono text-slate-600">PR {{ st.prCounty }}</td>
                <td class="py-3 px-4 text-center font-mono text-slate-600">PR {{ st.prNation }}</td>
                <td class="py-3 px-4">
                  <template v-if="isGaotongGrade(inquiryState.grade)">
                    <span
                      v-if="st.supportBreadth?.breadth >= 2"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      多科關注 ({{ st.supportBreadth.breadth }}科)
                    </span>
                    <span
                      v-else-if="st.supportBreadth?.breadth === 1"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
                    >
                      單科關注 (1科)
                    </span>
                    <span
                      v-else-if="st.crossSubjectInconsistency?.isInconsistent"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
                    >
                      跨科不一致
                    </span>
                    <span
                      v-else-if="st.dataCompleteness?.status !== 'COMPLETE'"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500"
                    >
                      缺考待補
                    </span>
                    <span v-else class="text-[11px] text-emerald-600 font-medium">
                      未見關注訊號
                    </span>
                  </template>
                  <template v-else>
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
                  </template>
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
    <!-- 層級 3：個人成績統計報告（綜合成績單 Drawer 模組化元件）        -->
    <!-- ============================================================== -->
    <StudentReportDrawer
      v-model="studentDrawerVisible"
      :student="activeStudent"
      :student-list="studentList"
      :school-name="state.school"
      :grade="inquiryState.grade"
      :class-obj="inquiryState.classObj"
      @select-student="activeStudent = $event"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import StudentReportDrawer from './report/StudentReportDrawer.vue'
import NeedleGauge from './widgets/NeedleGauge.vue'
import SupportTreemap from './widgets/SupportTreemap.vue'
import ActionDrawer from './widgets/ActionDrawer.vue'
import {
  isGaotongGrade,
  GAOTONG_SUBJECTS,
  GAOTONG_CLASS_IDS,
  getGaotongClassStudents,
  getGaotongClassStats,
  getActionPreset,
  PRIORITY_ITEMS
} from '../../composables/useGaotongData'
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
  if (isGaotongGrade(g)) {
    return GAOTONG_CLASS_IDS.map(cId => ({ value: cId, label: `${cId} 班` }))
  }
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

// 各班學生名冊 (支援五年級真實數據庫 250 人與三年級示範)
const allStudentsInClass = computed(() => {
  if (isGaotongGrade(inquiryState.grade)) {
    return getGaotongClassStudents(inquiryState.classObj)
  }
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
      weak,
      filterTags: ['all', rate < 60 ? 'single_subject' : 'no_signal']
    }
  })
})

const filterCounts = computed(() => {
  const all = allStudentsInClass.value
  return Object.fromEntries(filterOptions.map(f => [
    f.id,
    f.id === 'all' ? all.length : all.filter(s => s.filterTags?.includes(f.id)).length
  ]))
})

const studentList = computed(() => {
  const all = allStudentsInClass.value
  if (currentFilter.value === 'all') return all
  return all.filter(s => s.filterTags?.includes(currentFilter.value))
})

// Drawer & Selection state
const studentDrawerVisible = ref(false)
const activeStudent = ref(null)

// 高通真實數據庫狀態
const treemapSubjectKey = ref('math')
const selectedAction = ref(null)
const currentFilter = ref('all')

const treemapSubject = computed(() =>
  GAOTONG_SUBJECTS.find(s => s.id === treemapSubjectKey.value) || GAOTONG_SUBJECTS[0]
)

const gaotongSchoolStats = computed(() => ({
  totalStudents: 250,
  completenessRate: 99.2,
  priorityClassCount: 3,
  testedRate: 98.8,
  subjects: GAOTONG_SUBJECTS
}))

const gaotongClassStats = computed(() => {
  if (!isGaotongGrade(inquiryState.grade)) return null
  return getGaotongClassStats(inquiryState.classObj)
})

const filterOptions = [
  { id: 'all', label: '全部學生' },
  { id: 'no_signal', label: '未見關注訊號' },
  { id: 'single_subject', label: '單科關注' },
  { id: 'multi_subject', label: '多科共同關注' },
  { id: 'inconsistent', label: '跨科不一致' },
  { id: 'incomplete', label: '有缺考／缺資料' }
]

function chooseTreemapSubject(sId) {
  treemapSubjectKey.value = sId
}

function openAction(key) {
  selectedAction.value = getActionPreset(key)
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
}
</script>

<style scoped>
</style>
