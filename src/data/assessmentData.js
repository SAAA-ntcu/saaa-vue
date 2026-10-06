export const assessmentYears = ['108', '109', '110', '111', '112', '113', '114', '115']

export const assessmentSubjects = [
  { name: '國語文', grades: ['三年級', '四年級', '五年級', '六年級', '七年級', '八年級'] },
  { name: '數學', grades: ['三年級', '四年級', '五年級', '六年級', '七年級', '八年級'] },
  { name: '英語文', grades: ['三年級', '四年級', '五年級', '六年級', '七年級', '八年級'] },
  { name: '自然科學', grades: ['三年級', '四年級', '五年級', '六年級', '七年級', '八年級'] }
]

export const gradesHeader = [
  { key: 'p3', label: '國小3年級', gradeName: '三年級' },
  { key: 'p4', label: '國小4年級', gradeName: '四年級' },
  { key: 'p5', label: '國小5年級', gradeName: '五年級' },
  { key: 'p6', label: '國小6年級', gradeName: '六年級' },
  { key: 'j7', label: '國中7年級', gradeName: '七年級' },
  { key: 'j8', label: '國中8年級', gradeName: '八年級' }
]

export function getAssessmentDownloadUrl(year, gradeName, subject) {
  return `http://172.16.113.103:8080/downioad/${year}/AF/${year}年度縣市學生學習能力檢測_${gradeName}${subject}.pdf`
}
