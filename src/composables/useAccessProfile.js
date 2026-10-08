import { ref, computed } from 'vue';

export const ALL_SUBJECT_IDS = Object.freeze(['math', 'chinese', 'english']);
export const ALL_CLASS_IDS = Object.freeze(['501', '502', '503', '504', '505', '506', '507', '508', '509']);

const SUBJECT_LABELS = Object.freeze({
  math: '數學',
  chinese: '國語文',
  english: '英語文'
});

function classScopeLabel(classIds) {
  if (classIds.length === ALL_CLASS_IDS.length) return '全校 501–509 班';
  return `${classIds.join('、')} 班`;
}

function makeProfile({ id, label, kind, classIds, subjectIds, canViewSchool = false, canViewClass = false }) {
  const profile = {
    id,
    label,
    kind,
    classIds: Object.freeze([...classIds]),
    subjectIds: Object.freeze([...subjectIds]),
    canViewSchool,
    canViewClass
  };
  return Object.freeze({
    ...profile,
    scopeLabel: `${classScopeLabel(profile.classIds)}｜${profile.subjectIds.map((subjectId) => SUBJECT_LABELS[subjectId]).join('・')}`
  });
}

export const ACCESS_PROFILES = Object.freeze([
  makeProfile({
    id: 'principal',
    label: '校長視角',
    kind: 'school_leader',
    classIds: ALL_CLASS_IDS,
    subjectIds: ALL_SUBJECT_IDS,
    canViewSchool: true,
    canViewClass: true
  }),
  makeProfile({
    id: 'academic_director',
    label: '教務主任視角',
    kind: 'school_leader',
    classIds: ALL_CLASS_IDS,
    subjectIds: ALL_SUBJECT_IDS,
    canViewSchool: true,
    canViewClass: true
  }),
  ...ALL_CLASS_IDS.map((classId) => makeProfile({
    id: `homeroom_${classId}`,
    label: `${classId} 班導師視角`,
    kind: 'homeroom_teacher',
    classIds: [classId],
    subjectIds: ALL_SUBJECT_IDS,
    canViewClass: true
  })),
  makeProfile({
    id: 'english_teacher_1',
    label: '英語科任 1 (501–503)',
    kind: 'subject_teacher',
    classIds: ['501', '502', '503'],
    subjectIds: ['english']
  }),
  makeProfile({
    id: 'english_teacher_2',
    label: '英語科任 2 (504–506)',
    kind: 'subject_teacher',
    classIds: ['504', '505', '506'],
    subjectIds: ['english']
  }),
  makeProfile({
    id: 'english_teacher_3',
    label: '英語科任 3 (507–509)',
    kind: 'subject_teacher',
    classIds: ['507', '508', '509'],
    subjectIds: ['english']
  })
]);

const PROFILE_BY_ID = new Map(ACCESS_PROFILES.map((profile) => [profile.id, profile]));

const activeProfileId = ref('principal');

export function useAccessProfile() {
  const currentProfile = computed(() => PROFILE_BY_ID.get(activeProfileId.value) || ACCESS_PROFILES[0]);

  function setProfile(profileId) {
    if (PROFILE_BY_ID.has(profileId)) {
      activeProfileId.value = profileId;
    }
  }

  function canAccessSubject(subjectId) {
    return currentProfile.value.subjectIds.includes(String(subjectId));
  }

  function canAccessClass(classId) {
    return currentProfile.value.classIds.includes(String(classId));
  }

  function getAllowedSubjectIds() {
    return [...currentProfile.value.subjectIds];
  }

  function getAllowedClassIds(subject = null) {
    if (subject?.classIds) {
      return currentProfile.value.classIds.filter((classId) => subject.classIds.includes(classId));
    }
    return [...currentProfile.value.classIds];
  }

  return {
    ACCESS_PROFILES,
    activeProfileId,
    currentProfile,
    setProfile,
    canAccessSubject,
    canAccessClass,
    getAllowedSubjectIds,
    getAllowedClassIds,
    getSubjectLabel: (id) => SUBJECT_LABELS[id] || id
  };
}
