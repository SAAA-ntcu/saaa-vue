export const reportYears = ['115', '114', '113']

export const reportTypes = [
  {
    key: 'item_accuracy',
    name: '試卷答對率',
    desc: '全校各題平均答對率統計分析'
  },
  {
    key: 'item_response',
    name: '試卷作答反應',
    desc: '試題作答選項分佈與迷思診斷'
  },
  {
    key: 'class_accuracy',
    name: '各班答對率',
    desc: '各班級答對率比較與群模對照'
  },
  {
    key: 'school_level',
    name: '各校等級比例',
    desc: '精熟/基礎/待加強五標常模比例'
  },
  {
    key: 'individual_score',
    name: '個人成績',
    desc: '學生個人成績通知單與診斷報告'
  }
]

export const paperGrades = [
  { key: 'c3', label: '國語文 3年級', subject: '國語文', grade: '3年級' },
  { key: 'c5', label: '國語文 5年級', subject: '國語文', grade: '5年級' },
  { key: 'm3', label: '數學 3年級', subject: '數學', grade: '3年級' },
  { key: 'm5', label: '數學 5年級', subject: '數學', grade: '5年級' },
  { key: 'e5', label: '英語文 5年級', subject: '英語文', grade: '5年級' }
]

/**
 * Checks whether a report is available for a given paper and report type.
 * Exactly matches Screenshot 3 where "各校等級比例" only provides 5th grade papers.
 */
export function isReportTypeAvailable(paperKey, reportKey) {
  // 各校等級比例 (school_level) is only administered for 5th grade
  if (reportKey === 'school_level') {
    return ['c5', 'm5', 'e5'].includes(paperKey)
  }
  return true
}

export function getReportDownloadUrl(year, paperLabel, reportName) {
  return `http://172.16.113.103:8080/download/${year}/Reports/${year}年度_${paperLabel}_${reportName}.pdf`
}
