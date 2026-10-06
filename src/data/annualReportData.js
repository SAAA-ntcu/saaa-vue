export const annualReportYears = ['108', '109', '110', '111', '112', '113', '114', '115']

export const annualReportSubjects = [
  { name: '國語文' },
  { name: '數學' },
  { name: '自然' },
  { name: '英語文' }
]

export const annualGradesHeader = [
  { key: 'p1', label: '國小1年級', gradeName: '一年級' },
  { key: 'p2', label: '國小2年級', gradeName: '二年級' },
  { key: 'p3', label: '國小3年級', gradeName: '三年級' },
  { key: 'p4', label: '國小4年級', gradeName: '四年級' },
  { key: 'p5', label: '國小5年級', gradeName: '五年級' },
  { key: 'p6', label: '國小6年級', gradeName: '六年級' }
]

/**
 * Checks whether an annual outcome report is available for a given year, gradeKey, and subject.
 * Accurately reproduces Screenshot 1 (where 110 shows Grade 5 with 國/數/英, 自然 is 🚫, Grades 1-4 & 6 are 🚫).
 */
export function isAnnualReportAvailable(year, gradeKey, subject) {
  // Grades 1 & 2 are not tested in county assessments
  if (gradeKey === 'p1' || gradeKey === 'p2') return false

  // 108 ~ 110: Only Grade 5 tested in 國語文, 數學, 英語文 (matches Screenshot 1)
  if (['108', '109', '110'].includes(String(year))) {
    return gradeKey === 'p5' && ['國語文', '數學', '英語文'].includes(subject)
  }

  // 111 ~ 112: Grades 4, 5, 6 tested
  if (['111', '112'].includes(String(year))) {
    if (['p4', 'p5', 'p6'].includes(gradeKey)) {
      if (subject === '自然') return ['p5', 'p6'].includes(gradeKey)
      return true
    }
    return false
  }

  // 113 ~ 115: Grades 3, 4, 5, 6 tested in core subjects (Grade 3 has no 自然)
  if (['113', '114', '115'].includes(String(year))) {
    if (['p3', 'p4', 'p5', 'p6'].includes(gradeKey)) {
      if (subject === '自然' && gradeKey === 'p3') return false
      return true
    }
    return false
  }

  return false
}

export function getAnnualReportDownloadUrl(year, gradeLabel, subject) {
  return `http://172.16.113.103:8080/download/${year}/AR/${year}年度縣市學生學習能力檢測成果報告_${gradeLabel}${subject}.pdf`
}
