/**
 * 成績專區 Mock 資料與產生器
 */

export const defaultScoreSummaryList = [
  { id: 1, year: '115', gradeClass: '五年1班', subject: '國語文', expected: 28, actual: 28, average: '84.2', passRate: '89.3%' },
  { id: 2, year: '115', gradeClass: '五年1班', subject: '數學', expected: 28, actual: 27, average: '79.6', passRate: '82.1%' },
  { id: 3, year: '115', gradeClass: '五年1班', subject: '英語文', expected: 28, actual: 28, average: '88.5', passRate: '92.9%' },
  { id: 4, year: '115', gradeClass: '五年2班', subject: '國語文', expected: 27, actual: 27, average: '82.8', passRate: '85.2%' },
  { id: 5, year: '115', gradeClass: '五年2班', subject: '數學', expected: 27, actual: 27, average: '81.4', passRate: '85.2%' },
  { id: 6, year: '115', gradeClass: '五年2班', subject: '英語文', expected: 27, actual: 26, average: '86.1', passRate: '88.9%' },
  { id: 7, year: '115', gradeClass: '六年1班', subject: '國語文', expected: 29, actual: 29, average: '86.3', passRate: '93.1%' },
  { id: 8, year: '115', gradeClass: '六年1班', subject: '數學', expected: 29, actual: 29, average: '83.7', passRate: '89.7%' }
]

export function generateQuestionAnalysisData(count = 30) {
  return Array.from({ length: count }, (_, i) => {
    const qNum = i + 1
    const countyAcc = 50 + Math.random() * 40
    const overallAcc = countyAcc + (Math.random() * 10 - 5)
    const schoolAcc = countyAcc + (Math.random() * 20 - 10)

    if (i === 4 || i === 12 || i === 25) {
      return {
        qNum,
        overallAcc: overallAcc.toFixed(1),
        countyAcc: countyAcc.toFixed(1),
        schoolAcc: Math.max(0, countyAcc - 15 - Math.random() * 10).toFixed(1)
      }
    }

    return {
      qNum,
      overallAcc: Math.min(100, Math.max(0, overallAcc)).toFixed(1),
      countyAcc: Math.min(100, Math.max(0, countyAcc)).toFixed(1),
      schoolAcc: Math.min(100, Math.max(0, schoolAcc)).toFixed(1)
    }
  })
}
