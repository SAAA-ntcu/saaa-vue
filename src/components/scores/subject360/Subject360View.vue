<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import SubjectScopePicker from './SubjectScopePicker.vue';
import SubjectOverview from './SubjectOverview.vue';
import SubjectClasses from './SubjectClasses.vue';
import SubjectAbility from './SubjectAbility.vue';
import SubjectItems from './SubjectItems.vue';
import SubjectGroups from './SubjectGroups.vue';
import SubjectStudentDrawer from './SubjectStudentDrawer.vue';
import {
  SUBJECT360_META,
  getClassIds,
  getClassStudents,
  getScopeLabel,
  loadSubject360
} from '../../../composables/useSubject360';
import { useAccessProfile } from '../../../composables/useAccessProfile';

const props = defineProps({
  initialSubjectId: { type: String, default: 'math' },
  initialClassId: { type: String, default: '' }
});

const data = ref(null);
const error = ref('');
const activeTab = ref('overview');
const selectedSubjectId = ref(props.initialSubjectId || 'math');
const selectedClasses = ref([]);
const focusedItem = ref(null);
const focusedStudent = ref('');
const studentLookup = ref('');
const focusedAbility = ref('');

const tabs = [
  { id: 'overview', label: '資料總覽' },
  { id: 'classes', label: '班級 × 能力' },
  { id: 'ability', label: '能力診斷' },
  { id: 'items', label: '試題資料' },
  { id: 'groups', label: '教學分組' }
];

const { currentProfile, getAllowedClassIds, getAllowedSubjectIds } = useAccessProfile();

const accessibleSubjectMeta = computed(() => {
  const allowed = getAllowedSubjectIds();
  return SUBJECT360_META.filter((meta) => allowed.includes(meta.id));
});

const subject = computed(() => data.value?.subjects?.[selectedSubjectId.value] || null);
const classIds = computed(() => getAllowedClassIds(subject.value));

const scopeLabel = computed(() => {
  if (!subject.value) return '載入中';
  const fullClassIds = getClassIds(subject.value);
  if (classIds.value.length < fullClassIds.length && selectedClasses.value.length === classIds.value.length) {
    return `${currentProfile.value.label}｜${selectedClasses.value.join('、')}班`;
  }
  return getScopeLabel(subject.value, selectedClasses.value);
});

const selectAllLabel = computed(() => classIds.value.length === getClassIds(subject.value).length ? '全校' : '可見範圍');
const studentCandidates = computed(() => subject.value ? getClassStudents(subject.value, selectedClasses.value) : []);

const activeComponent = computed(() => {
  const map = {
    overview: SubjectOverview,
    classes: SubjectClasses,
    ability: SubjectAbility,
    items: SubjectItems,
    groups: SubjectGroups
  };
  return map[activeTab.value] || SubjectOverview;
});

function setTab(tab) {
  activeTab.value = tab;
  focusedItem.value = null;
  focusedStudent.value = '';
  focusedAbility.value = '';
}

function setSubject(subjectId) {
  if (!accessibleSubjectMeta.value.some((meta) => meta.id === subjectId)) return;
  selectedSubjectId.value = subjectId;
  selectedClasses.value = getAllowedClassIds(data.value?.subjects?.[subjectId]);
  focusedItem.value = null;
  focusedStudent.value = '';
  focusedAbility.value = '';
}

function toggleClass(classId) {
  if (!classIds.value.includes(classId)) return;
  const next = selectedClasses.value.includes(classId)
    ? selectedClasses.value.filter((id) => id !== classId)
    : [...selectedClasses.value, classId];
  selectedClasses.value = next.length ? next.sort() : [...classIds.value];
}

function selectAllClasses() {
  selectedClasses.value = [...classIds.value];
}

function selectClass(classId) {
  if (!classIds.value.includes(classId)) return;
  selectedClasses.value = [classId];
  activeTab.value = 'classes';
  focusedItem.value = null;
  focusedStudent.value = '';
  focusedAbility.value = '';
}

function openAbility(dimension) {
  focusedAbility.value = dimension?.dimension?.key || dimension?.key || '';
  activeTab.value = 'ability';
  focusedItem.value = null;
  focusedStudent.value = '';
}

function openItem(question) {
  focusedItem.value = question;
  focusedStudent.value = '';
  focusedAbility.value = '';
  activeTab.value = 'items';
}

function selectStudentLookup(value) {
  const candidate = studentCandidates.value.find((student) => student.id === value);
  if (candidate) selectStudent(candidate.id);
  else studentLookup.value = '';
}

function selectStudent(studentId) {
  const candidate = studentCandidates.value.find((student) => student.id === studentId);
  if (!candidate) {
    focusedStudent.value = '';
    studentLookup.value = '';
    return;
  }
  focusedStudent.value = String(candidate.id);
  studentLookup.value = focusedStudent.value;
  focusedItem.value = null;
  focusedAbility.value = '';
}

onMounted(async () => {
  try {
    data.value = await loadSubject360();
    if (props.initialClassId && classIds.value.includes(props.initialClassId)) {
      selectedClasses.value = [props.initialClassId];
    } else {
      selectedClasses.value = [...classIds.value];
    }
  } catch (loadError) {
    error.value = loadError instanceof Error ? loadError.message : '領域資料載入失敗';
  }
});

watch(currentProfile, () => {
  if (data.value) {
    if (!accessibleSubjectMeta.value.some((meta) => meta.id === selectedSubjectId.value)) {
      selectedSubjectId.value = accessibleSubjectMeta.value[0]?.id || 'math';
    }
    selectedClasses.value = getAllowedClassIds(data.value?.subjects?.[selectedSubjectId.value]);
  }
});
</script>

<template>
  <div class="space-y-4">
    <!-- 載入中 -->
    <div v-if="!data && !error" class="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
      <div class="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p class="text-sm font-medium">正在載入領域 360 度學力資料…</p>
    </div>

    <!-- 載入失敗 -->
    <div v-else-if="error" class="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
      <strong class="font-bold block mb-1">領域資料載入失敗</strong>
      <p class="m-0">{{ error }}</p>
    </div>

    <!-- 成功載入主畫面 -->
    <template v-else-if="subject">
      <!-- 頂部 Hero 區塊 -->
      <section class="p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-slate-100/70 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <span class="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">領域 360 度學力分析</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-800 m-0 mt-0.5">
            {{ subject.label }}領域評量數據
          </h2>
          <p class="text-xs text-slate-500 m-0 mt-1">跨班級向度熱圖、試題選項誘答力診斷與暫時性教學分組支持。</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- 科目選擇膠囊 -->
          <div class="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs gap-1">
            <button
              v-for="meta in accessibleSubjectMeta"
              :key="meta.id"
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              :class="selectedSubjectId === meta.id ? 'bg-[#3f7d6e] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'"
              @click="setSubject(meta.id)"
            >
              {{ meta.label }}
            </button>
          </div>

          <!-- 快速查詢學生 -->
          <div class="relative">
            <input
              v-model="studentLookup"
              list="student-lookup-options"
              placeholder="快速查詢學生代碼…"
              class="text-xs font-medium px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 w-44 shadow-2xs"
              @change="selectStudentLookup(studentLookup)"
              @keydown.enter.prevent="selectStudentLookup(studentLookup)"
            />
            <datalist id="student-lookup-options">
              <option
                v-for="c in studentCandidates"
                :key="c.id"
                :value="c.id"
                :label="`${c.class}班 ${c.seat}號`"
              />
            </datalist>
          </div>
        </div>
      </section>

      <!-- 班級範圍篩選器 -->
      <SubjectScopePicker
        :class-ids="classIds"
        :selected-classes="selectedClasses"
        :scope-label="scopeLabel"
        :select-all-label="selectAllLabel"
        @toggle-class="toggleClass"
        @select-all="selectAllClasses"
      />

      <!-- 分頁導覽列 -->
      <nav class="flex gap-1 border-b border-slate-200 overflow-x-auto pb-0.5" aria-label="領域資料導覽">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer"
          :class="activeTab === tab.id ? 'bg-white text-slate-800 border-t-2 border-t-[#3f7d6e] border-x border-slate-200 shadow-2xs -mb-px' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'"
          @click="setTab(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <!-- 動態子分頁內容 -->
      <div class="pt-2">
        <component
          :is="activeComponent"
          v-bind="activeTab === 'ability' ? { initialDimension: focusedAbility } : {}"
          :subject="subject"
          :selected-classes="selectedClasses"
          :visible-class-ids="classIds"
          :scope-label="scopeLabel"
          :focus-question="focusedItem"
          @open-page="setTab"
          @open-ability="openAbility"
          @open-item="openItem"
          @select-class="selectClass"
          @select-student="selectStudent"
        />
      </div>

      <!-- 單科學生診斷抽屜 -->
      <SubjectStudentDrawer
        :subject="subject"
        :selected-classes="selectedClasses"
        :visible-class-ids="classIds"
        :initial-student-id="focusedStudent"
        :visible="Boolean(focusedStudent)"
        @close="selectStudent('')"
        @select-class="selectClass"
        @select-student="selectStudent"
      />
    </template>
  </div>
</template>
