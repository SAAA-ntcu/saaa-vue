<script setup>
import { computed } from 'vue';
import { formatCount, formatPercent, getStudentGroups } from '../../../composables/useSubject360';

const props = defineProps({
  subject: { type: Object, required: true },
  selectedClasses: { type: Array, required: true },
  scopeLabel: { type: String, required: true }
});

const emit = defineEmits(['select-student', 'open-item']);
const groups = computed(() => getStudentGroups(props.subject, props.selectedClasses));

const descriptions = {
  '特定概念待確認': '作答模式與某一特定誘答選項反覆出現，需回到試題確認概念認知。',
  '作答表現不穩定／需進一步診斷': '缺答或向度間落差較大，建議先補充短題組或口頭問答診斷證據。',
  '多題共同待支持': '多題共同偏低，弱點向度重疊，適合安排小組概念重構與實作支持。'
};

const guidance = {
  '特定概念待確認': {
    criteria: '至少兩題出現相同錯誤選項，且集中在同一內容向度。',
    action: '先進行錯誤選項迷思比較，再回到代表題拆解步驟。'
  },
  '作答表現不穩定／需進一步診斷': {
    criteria: '整體表現、缺答比例或不同向度之間出現明顯落差。',
    action: '先補做短題組或口頭診斷，確認是概念卡關、閱讀速度或作答狀態問題。'
  },
  '多題共同待支持': {
    criteria: '兩題以上共同偏低，且弱點向度有重疊學生。',
    action: '安排小組概念重構與具體物操作，完成後以原題或平行題確認是否改善。'
  }
};
</script>

<template>
  <div class="space-y-4">
    <!-- 頂部標題 -->
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div>
        <h3 class="text-base font-bold text-slate-800 m-0">以作答證據為本的教學分組指引</h3>
        <p class="text-xs text-slate-500 m-0">依本次作答證據形成暫時性教學需求群組，不把學生固定貼上高、中、低分等第標籤</p>
      </div>
      <span class="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
        {{ scopeLabel }}
      </span>
    </div>

    <div class="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-800 leading-relaxed">
      分組依據為整體作答、向度差異、缺答比例與重複錯誤選項模式。這些群組是教學討論與彈性分組的起點，非固定能力判定。
    </div>

    <!-- 群組卡片列表 -->
    <div class="space-y-3">
      <article
        v-for="group in groups"
        :key="group.name"
        class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <header class="flex items-center justify-between p-4 bg-slate-50/70 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <h4 class="text-sm font-bold text-slate-800 m-0 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#3f7d6e]"></span>
              {{ group.name }}
            </h4>
            <p class="text-xs text-slate-500 m-0 mt-0.5">{{ descriptions[group.name] }}</p>
          </div>
          <div class="text-right">
            <span class="text-xl font-black font-mono text-emerald-700">{{ group.members.length }}</span>
            <span class="text-xs text-slate-500 ml-1">人</span>
          </div>
        </header>

        <div class="p-4 space-y-3">
          <!-- 共同弱點向度 -->
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-400 block">共同待關注向度：</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="weak in group.commonWeak"
                :key="weak.key"
                class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium"
              >
                {{ weak.key }} <small class="text-slate-400 font-mono ml-1">({{ weak.count }}人)</small>
              </span>
              <span v-if="!group.commonWeak.length" class="text-xs text-slate-400">目前無共同向度訊號</span>
            </div>
          </div>

          <!-- 共同錯題 -->
          <div class="space-y-1">
            <span class="text-[11px] font-bold text-slate-400 block">共同錯題（點擊檢視試題）：</span>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="wrong in group.commonWrong"
                :key="wrong.q"
                type="button"
                class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md text-xs font-bold transition-colors"
                @click="emit('open-item', wrong.q)"
              >
                Q{{ wrong.q }} <span class="font-normal font-mono">({{ wrong.count }}人錯)</span>
              </button>
              <span v-if="!group.commonWrong.length" class="text-xs text-slate-400">目前無共同錯題</span>
            </div>
          </div>

          <!-- 形成條件與建議行動 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div>
              <b class="text-slate-700 block mb-1">分組形成條件：</b>
              <p class="text-slate-500 m-0 leading-relaxed">{{ guidance[group.name]?.criteria }}</p>
            </div>
            <div>
              <b class="text-emerald-800 block mb-1">建議教學行動：</b>
              <p class="text-slate-600 m-0 leading-relaxed">{{ guidance[group.name]?.action }}</p>
            </div>
          </div>

          <!-- 展開學生名單細項 -->
          <details class="text-xs border-t border-slate-100 pt-2">
            <summary class="cursor-pointer text-emerald-700 font-bold hover:underline py-1">
              查看學生名單與作答摘要（{{ group.members.length }} 位）
            </summary>
            <div class="overflow-x-auto mt-2">
              <table class="w-full text-left">
                <thead class="bg-slate-50 text-slate-500 text-[11px]">
                  <tr>
                    <th class="p-2">學生座號</th>
                    <th class="p-2 text-right">整體答對率</th>
                    <th class="p-2 text-right">錯題數</th>
                    <th class="p-2">待確認向度</th>
                    <th class="p-2 text-right">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="member in group.members" :key="member.student.id" class="hover:bg-slate-50">
                    <td class="p-2 font-bold text-slate-800">
                      {{ member.student.class }}班 {{ member.student.seat }}號
                      <span class="text-[10px] text-slate-400 font-mono ml-1">({{ member.student.id }})</span>
                    </td>
                    <td class="p-2 text-right font-mono font-bold text-slate-700">
                      {{ formatPercent(member.student.score) }}
                    </td>
                    <td class="p-2 text-right font-mono text-rose-600 font-bold">
                      {{ formatCount(member.profile.wrongItems.length) }}
                    </td>
                    <td class="p-2 text-slate-600 text-[11px]">
                      {{ member.profile.weak.slice(0, 2).map((row) => row.key).join('、') || '—' }}
                    </td>
                    <td class="p-2 text-right">
                      <button
                        type="button"
                        class="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline"
                        @click="emit('select-student', member.student.id)"
                      >
                        個別診斷卡
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </article>

      <div v-if="!groups.length" class="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        目前所選班級範圍內，作答表現皆落在穩健區間，未形成待支持之教學分組。
      </div>
    </div>
  </div>
</template>
