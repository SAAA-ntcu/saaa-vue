import class360Data from '../data/gaotong/class360.json'
import individualScoresData from '../data/gaotong/individualScores.json'
import { ACTION_PRESETS, getActionPreset, PRIORITY_ITEMS } from '../data/gaotong/actionPresets'

export { ACTION_PRESETS, getActionPreset, PRIORITY_ITEMS }

export const GAOTONG_SUBJECTS = [
  {
    id: 'math',
    key: 'math',
    name: '數學',
    shortName: '數學',
    color: '#3f7d6e', // 莫蘭迪綠 (避免與常模衝突)
    schoolAvg: 54,
    countyAvg: 54,
    delta: 0.0,
    supportCount: 48,
    tested: 247,
    note: '目前需優先查看；6 / 9 班待加強偏高。'
  },
  {
    id: 'english',
    key: 'english',
    name: '英語文',
    shortName: '英語',
    color: '#6c6aa8', // 莫蘭迪紫
    schoolAvg: 84,
    countyAvg: 81,
    delta: 3.0,
    supportCount: 19,
    tested: 247,
    note: '整體答對率較高，但 503、508 班有明顯落差。'
  },
  {
    id: 'chinese',
    key: 'chinese',
    name: '國語文',
    shortName: '國語',
    color: '#b5575f', // 莫蘭迪紅棕
    schoolAvg: 77,
    countyAvg: 72,
    delta: 5.0,
    supportCount: 22,
    tested: 250,
    note: '整體答對率較高，維持目前教學安排。'
  }
]

export const GAOTONG_CLASS_IDS = Object.keys(class360Data.classes || {}).sort()

// 學生命名種子庫（賦予真實親和的學生姓名）
const lastNames = ['陳', '林', '黃', '張', '李', '王', '吳', '劉', '蔡', '楊', '許', '鄭', '謝', '洪', '郭']
const firstNames = ['小明', '志豪', '雅晴', '佳穎', '宗憲', '冠宇', '子涵', '佩珊', '柏翰', '承恩', '詩涵', '宇軒', '欣怡', '品睿', '家豪', '詠晴']

function getStudentName(classId, seat) {
  const cNum = parseInt(classId.slice(-2), 10) || 1
  const sNum = parseInt(seat, 10) || 1
  const last = lastNames[(cNum * 7 + sNum) % lastNames.length]
  const first = firstNames[(cNum * 11 + sNum * 13) % firstNames.length]
  return `${last}${first}`
}

/** 判斷是否為高通真實資料年級（5 年級） */
export function isGaotongGrade(grade) {
  return String(grade) === '5'
}

/** 取得單班完整學生名冊（融合 class360 與 individualScores 雙重 PR） */
export function getGaotongClassStudents(classId) {
  const cData = class360Data.classes?.[classId]
  if (!cData) return []

  const matrix = cData.zone1_matrix || []
  const scoresBySeat = individualScoresData.classes?.[classId] || {}
  const drawers = cData.zone5_drawers || {}

  return matrix.map((row) => {
    const seat = String(row.seat).padStart(2, '0')
    const seatScores = scoresBySeat[seat] || {}
    const drawer = drawers[row.seat] || {}

    // 整合三科細節
    const subjectsMap = {}
    const subjectList = ['國語文', '數學', '英語文']
    let totalAcc = 0
    let validCount = 0

    subjectList.forEach((subName) => {
      const orig = row.subjects?.[subName] || {}
      const prs = seatScores[subName] || {}
      const countyPr = prs.countyPr ?? orig.countyPr ?? Math.round(orig.studentAccuracy || 70)
      const allParticipantsPr = prs.allParticipantsPr ?? Math.min(99, countyPr + 3)

      subjectsMap[subName] = {
        ...orig,
        countyPr,
        allParticipantsPr
      }

      if (orig.status === 'VALID' && Number.isFinite(orig.studentAccuracy)) {
        totalAcc += orig.studentAccuracy
        validCount++
      }
    })

    const avgRate = validCount > 0 ? Math.round(totalAcc / validCount) : 0
    const chiPr = subjectsMap['國語文']?.countyPr || 70
    const matPr = subjectsMap['數學']?.countyPr || 70
    const engPr = subjectsMap['英語文']?.countyPr || 70
    const prCounty = Math.round((chiPr + matPr + engPr) / 3)
    const prNation = Math.min(99, Math.round(prCounty + 2))

    return {
      studentUid: row.studentUid,
      seat,
      classId,
      name: getStudentName(classId, seat),
      rate: avgRate,
      prCounty,
      prNation,
      subjects: subjectsMap,
      supportBreadth: row.supportBreadth || { breadth: 0 },
      crossSubjectInconsistency: row.crossSubjectInconsistency || { isInconsistent: false },
      dataCompleteness: row.dataCompleteness || { status: 'COMPLETE' },
      filterTags: row.filterTags || ['all'],
      objectiveChecklist: drawer.objectiveChecklist || [
        { id: 'chk_quiz', title: '平時評量與單元小考表現', description: '比對各單元隨堂小考，觀察是屬於特定單元概念尚未熟悉，或整體題型理解困難。' },
        { id: 'chk_homework', title: '課堂作業與習作訂正紀錄', description: '檢視解題計算過程、文字題閱讀理解細緻度及訂正習慣，掌握日常學習態度與實務操作。' },
        { id: 'chk_engagement', title: '課堂專注度與互動反應', description: '觀察學童課堂聽講專注時長、分組合作參與度與動手解題自信心。' },
        { id: 'chk_consultation', title: '與科任教師跨科會商觀察', description: '與相關科任教師對焦課堂表現，探討不同學科間學習策略之遷移與適應。' }
      ],
      consultPartners: drawer.consultPartners || ['英語專任教師', '數學任課教師'],
      disclaimer: drawer.disclaimer || '本觀察卡資料僅供校內教學診斷與學習支持對話使用，非正式等第評定。'
    }
  })
}

/** 取得單班統計摘要（關注廣度分流數據、到考率等） */
export function getGaotongClassStats(classId) {
  const students = getGaotongClassStudents(classId)
  const total = students.length || 28

  const breadthCounts = { 0: 0, 1: 0, 2: 0, 3: 0 }
  let inconsistentCount = 0
  let completeCount = 0

  students.forEach((s) => {
    const b = s.supportBreadth?.breadth ?? 0
    if (b in breadthCounts) breadthCounts[b]++
    else if (b >= 3) breadthCounts[3]++

    if (s.crossSubjectInconsistency?.isInconsistent) inconsistentCount++
    if (s.dataCompleteness?.status === 'COMPLETE') completeCount++
  })

  return {
    classId,
    totalStudents: total,
    testedRate: 100.0,
    completenessRate: total ? Math.round((completeCount / total) * 100) : 100,
    inconsistentCount,
    breadthCounts,
    multiSupportCount: (breadthCounts[2] || 0) + (breadthCounts[3] || 0)
  }
}

/** 取得全校各班在指定科目的待加強統計（用於 Treemap 與矩陣） */
export function getGaotongClassSubjectStats(classId, subjectKey) {
  const students = getGaotongClassStudents(classId)
  const subName = subjectKey === 'chinese' ? '國語文' : subjectKey === 'english' ? '英語文' : '數學'

  const valid = students.filter((s) => s.subjects?.[subName]?.status === 'VALID')
  const support = valid.filter((s) => s.subjects?.[subName]?.officialLevel === '待加強')
  const totalTested = valid.length || 28

  const sumAcc = valid.reduce((sum, s) => sum + (s.subjects?.[subName]?.studentAccuracy || 0), 0)
  const avgAccuracy = totalTested ? Math.round((sumAcc / totalTested) * 10) / 10 : 70

  const subMeta = GAOTONG_SUBJECTS.find((s) => s.id === subjectKey) || GAOTONG_SUBJECTS[0]
  const delta = Math.round((avgAccuracy - subMeta.countyAvg) * 10) / 10

  return {
    classId,
    subjectKey,
    subjectName: subName,
    tested: totalTested,
    supportCount: support.length,
    supportRate: totalTested ? Math.round((support.length / totalTested) * 1000) / 10 : 0,
    avgAccuracy,
    delta
  }
}

/** 取得 Treemap 專用資料結構 */
export function buildGaotongTreemapData(subjectKey = 'math') {
  const subMeta = GAOTONG_SUBJECTS.find((s) => s.id === subjectKey) || GAOTONG_SUBJECTS[0]

  const children = GAOTONG_CLASS_IDS.map((classId) => {
    const stats = getGaotongClassSubjectStats(classId, subjectKey)
    return {
      name: `${classId} 班`,
      classId,
      subjectKey,
      value: stats.supportCount,
      supportCount: stats.supportCount,
      supportRate: stats.supportRate,
      tested: stats.tested,
      avgAccuracy: stats.avgAccuracy,
      delta: stats.delta,
      itemStyle: {
        color: hexToRgba(subMeta.color, 0.55),
        borderColor: '#ffffff',
        borderWidth: 2
      }
    }
  })

  return [
    {
      name: subMeta.name,
      subjectKey,
      value: children.reduce((sum, c) => sum + c.value, 0),
      children,
      itemStyle: {
        color: subMeta.color,
        borderColor: '#334155',
        borderWidth: 3
      }
    }
  ]
}

function hexToRgba(hex, alpha) {
  const val = hex.replace('#', '')
  const num = parseInt(val, 16)
  return `rgba(${num >> 16}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`
}
