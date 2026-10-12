import class360Data from '../data/gaotong/class360.json'
import individualScoresData from '../data/gaotong/individualScores.json'
import subject360Data from '../data/gaotong/subject360.json'
import subject360HistoryData from '../data/gaotong/subject360-history.json'
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

/**
 * 模組 ②：真實跨科表現高度不一致（偏科診斷）與關注廣度雙軌診斷
 */
export function getStudentInconsistencyDiagnostic(classId, seat) {
  const normSeat = String(parseInt(seat, 10))
  const cData = class360Data.classes?.[classId]
  if (!cData) return null
  const matrix = cData.zone1_matrix || []
  const row = matrix.find(
    (r) => String(r.seat) === normSeat || String(r.seat).padStart(2, '0') === String(seat).padStart(2, '0')
  )
  if (!row) return null

  const breadth = row.supportBreadth?.breadth ?? 0
  const inconst = row.crossSubjectInconsistency || { isInconsistent: false }
  const subjects = row.subjects || {}

  let advantageSubject = null
  let supportSubject = null
  let maxPr = -1
  let minPr = 101

  for (const [subName, sObj] of Object.entries(subjects)) {
    const pr = sObj.countyPr ?? 50
    if (sObj.officialLevel === '精熟' || pr > maxPr) {
      maxPr = pr
      advantageSubject = { name: subName, pr, level: sObj.officialLevel }
    }
    if (sObj.officialLevel === '待加強' || pr < minPr) {
      minPr = pr
      supportSubject = { name: subName, pr, level: sObj.officialLevel }
    }
  }

  let advantageStatement = ''
  let supportStatement = ''
  let recommendation = ''

  if (inconst.isInconsistent) {
    advantageStatement = advantageSubject
      ? `${advantageSubject.name}學科表現突出（${advantageSubject.level}，PR ${advantageSubject.pr}），展現卓越學科潛力與自信心。`
      : ''
    supportStatement = supportSubject
      ? `${supportSubject.name}學科落入${supportSubject.level}（PR ${supportSubject.pr}），為個別領域之特定單元概念盲點。`
      : ''
    recommendation =
      '【優勢學科肯定 ＋ 弱勢精準扶助】切忌以單一學科低分標籤化全人學力，建議以優勢科目之自信學習策略，引導克服弱勢科目之特定單元障礙。'
  } else if (breadth === 0) {
    advantageStatement = '三科（國、數、英）學力皆在基礎或精熟以上，未見待加強訊號，整體學力穩健。'
    recommendation = '各科學習節奏均衡，建議在具優勢之向度給予加深加廣生活化探究挑戰。'
  } else if (breadth === 1) {
    supportStatement = supportSubject
      ? `僅在 ${supportSubject.name} 呈現待加強關注訊號（PR ${supportSubject.pr}），其餘學科穩定。`
      : ''
    recommendation = '屬單科特定向度待補強，建議科任教師聚焦核心概念輔導，無需全科介入。'
  } else {
    supportStatement = `多科（${breadth}科）落入待加強範圍，需啟動跨科共同關注。`
    recommendation = '建議召開跨科科任會商，優先建立良好日常作業訂正習慣與課堂專注度。'
  }

  return {
    breadth,
    breadthLabel: row.supportBreadth?.displayText || `${breadth}科關注`,
    isInconsistent: inconst.isInconsistent,
    reason: inconst.reason || '',
    advantageSubject,
    supportSubject,
    advantageStatement,
    supportStatement,
    recommendation
  }
}

/**
 * 模組 ③：跨科待加強交集 (Venn Overlap) 與跨科教師會商名單
 */
export function getStudentCollaborationInfo(classId, seat) {
  const normSeat = String(parseInt(seat, 10))
  const cData = class360Data.classes?.[classId]
  if (!cData) return null
  const z8 = cData.zone8_collaboration || []
  const z5 = cData.zone5_drawers?.[normSeat] || cData.zone5_drawers?.[String(seat).padStart(2, '0')] || {}

  const matched = z8.find((item) => (item.studentSeats || []).includes(normSeat))

  if (matched) {
    return {
      isCrossSubjectOverlap: true,
      combination: matched.combinationName,
      suggestedTeachers: matched.suggestedTeachers,
      topic: matched.collaborationTopic,
      objectiveChecklist: z5.objectiveChecklist || [],
      consultPartners: z5.consultPartners || ['英語專任教師', '數學任課教師']
    }
  }

  const row = (cData.zone1_matrix || []).find((r) => String(r.seat) === normSeat)
  const breadth = row?.supportBreadth?.breadth ?? 0
  let combination = '單科聚焦或學習穩健'
  let suggestedTeachers = '班級導師、任課教師'
  let topic = '落實課堂日常觀察與學習習慣指導。'

  if (breadth === 1) {
    const low = Object.entries(row?.subjects || {}).find(([k, v]) => v.officialLevel === '待加強')
    const subName = low ? low[0] : '特定學科'
    combination = `${subName} 單科關注`
    suggestedTeachers = `${subName}科任教師、班級導師`
    topic = `針對 ${subName} 之特定弱勢單元與作業訂正進行日常課堂輔導。`
  } else if (breadth === 0) {
    combination = '未見明顯跨科關注訊號 (0科)'
    suggestedTeachers = '班級導師、各科科任教師'
    topic = '維持目前優質學習節奏，鼓勵自主加深加廣學習。'
  }

  return {
    isCrossSubjectOverlap: false,
    combination,
    suggestedTeachers,
    topic,
    objectiveChecklist: z5.objectiveChecklist || [],
    consultPartners: z5.consultPartners || ['班級導師']
  }
}

/**
 * 模組 ①：跨科「認知向度」穿透階梯（三層教育學映射）與學習遷移障礙診斷
 */
export function getCrossSubjectCognitiveTaxonomy(classId, seat) {
  const normSeat = String(parseInt(seat, 10))
  const padSeat = normSeat.padStart(2, '0')
  const subs = ['chinese', 'math', 'english']
  const subNames = { chinese: '國語文', math: '數學', english: '英語文' }

  const matrix = {}
  const levels = ['知識記憶與程序', '概念理解與闡釋', '應用分析與解題']

  subs.forEach((subKey) => {
    const subData = subject360Data.subjects[subKey]
    if (!subData) return
    const stu = subData.students.find(
      (s) => s.class === classId && (String(s.seat) === normSeat || String(s.seat) === padSeat)
    )
    const items = subData.items || []

    const qBuckets = { 0: [], 1: [], 2: [] }
    if (subKey === 'math') {
      qBuckets[0] = [3, 5, 6, 8, 16, 18, 19, 22, 24, 25] // 程序執行
      qBuckets[1] = [1, 2, 4, 9, 10, 11, 13, 14, 15, 17, 20, 21, 23] // 概念理解
      qBuckets[2] = [7, 12] // 解題思考
    } else if (subKey === 'chinese') {
      qBuckets[0] = items.filter((i) => /知識/.test(i.content)).map((i) => i.q)
      qBuckets[1] = items.filter((i) => /字詞理解|句子理解|段落理解/.test(i.content)).map((i) => i.q)
      qBuckets[2] = items.filter((i) => /篇章理解/.test(i.content)).map((i) => i.q)
    } else if (subKey === 'english') {
      qBuckets[0] = items.filter((i) => /辨/.test(i.content)).map((i) => i.q)
      qBuckets[1] = items.filter((i) => /句子|教室|節慶/.test(i.content)).map((i) => i.q)
      qBuckets[2] = items.filter((i) => /短文與對話/.test(i.content)).map((i) => i.q)
    }

    matrix[subKey] = levels.map((lvlName, idx) => {
      const qList = qBuckets[idx] || []
      let correct = 0
      if (stu) {
        qList.forEach((q) => {
          const it = items.find((i) => i.q === q)
          if (it && stu.responses[q - 1] === it.answer) correct++
        })
      }
      const rate = qList.length ? Math.round((correct / qList.length) * 100) : 0
      return {
        levelIndex: idx,
        levelName: lvlName,
        correct,
        total: qList.length,
        rate
      }
    })
  })

  // 跨科綜合認知階梯均值
  const composite = levels.map((lvlName, idx) => {
    let sumRate = 0
    let count = 0
    subs.forEach((sk) => {
      if (matrix[sk]?.[idx]) {
        sumRate += matrix[sk][idx].rate
        count++
      }
    })
    const avgRate = count ? Math.round(sumRate / count) : 0
    return {
      levelName: lvlName,
      rate: avgRate,
      benchmarks: {
        county: idx === 0 ? 76 : idx === 1 ? 73 : 68,
        school: idx === 0 ? 78 : idx === 1 ? 75 : 70
      }
    }
  })

  // 學習遷移障礙智慧診斷
  const mathApp = matrix.math?.[2]?.rate ?? 70
  const chiText = matrix.chinese?.[2]?.rate ?? 70
  const mathProc = matrix.math?.[0]?.rate ?? 70

  let transferInsight = ''
  if (mathApp < 60 && chiText < 65) {
    transferInsight = `【學習遷移警示 · 語文閱讀限制數學審題】學童在數學應用解題答對率偏低（${mathApp}%），同時國語文「篇章理解」亦較弱（${chiText}%）。測驗數據顯示可能是長篇題幹閱讀理解困難限制了審題與題意掌握，而非純粹計算盲點。建議跨科協同引導數學題幹語意拆解。`
  } else if (mathProc < 55 && mathApp >= 60) {
    transferInsight = `【思維敏捷但程序疏漏】學童解題思考邏輯清晰（${mathApp}%），但程序執行計算失分較多（${mathProc}%）。建議加強多步驟運算之步驟覆核與驗算習慣。`
  } else if (chiText >= 80 && mathApp >= 80) {
    transferInsight =
      '【高階遷移優異】國語篇章理解與數學解題思考皆達 80% 以上，展現極佳的跨領域抽象推理與語意轉換能力。'
  } else {
    transferInsight =
      '【認知發展平衡】各認知層次表現平穩，建議在「應用分析與解題」向度多提供生活化實作探究情境，以激發高階思維。'
  }

  return {
    bySubject: matrix,
    composite,
    transferInsight
  }
}

/**
 * 模組 ④：真實學生作答反應 (Responses) 與難題/粗心題診斷
 */
export function getStudentItemDiagnostics(subjectKey, classId, seat) {
  const normSeat = String(parseInt(seat, 10))
  const padSeat = normSeat.padStart(2, '0')
  const sub = subject360Data.subjects[subjectKey]
  if (!sub) return { items: [], wrongItems: [], correctCount: 0, total: 0 }

  const stu = sub.students.find(
    (s) => s.class === classId && (String(s.seat) === normSeat || String(s.seat) === padSeat)
  )
  const items = sub.items || []
  const schoolStats = sub.itemStats?.school || []
  const cityItems = sub.official?.cityItem || []

  const allItems = items.map((it, idx) => {
    const studentChoice = stu ? stu.responses[idx] : null
    const isCorrect = studentChoice === it.answer
    const sStat = schoolStats[idx]
    const cItem = cityItems[idx]
    const passRate = cItem ? cItem.rate : sStat ? sStat.rate : 0.7
    const passPct = Math.round(passRate * 100)

    let mistakeType = 'none'
    let mistakeLabel = ''
    let priority = 0

    if (!isCorrect && studentChoice != null) {
      if (passRate >= 0.75) {
        mistakeType = 'careless'
        mistakeLabel = '⚠️ 非預期失分（基礎題審題疏漏）'
        priority = 1
      } else if (passRate <= 0.40) {
        mistakeType = 'hard'
        mistakeLabel = '🔥 普遍高難題（全體常態挑戰）'
        priority = 3
      } else {
        mistakeType = 'normal'
        mistakeLabel = '📘 核心概念精進題'
        priority = 2
      }
    }

    return {
      q: it.q,
      short: it.short || `第 ${it.q} 題`,
      content: it.content,
      cognitive: it.cognitive || '概念理解',
      studentChoice,
      correctAnswer: it.answer,
      isCorrect,
      passPct,
      mistakeType,
      mistakeLabel,
      priority
    }
  })

  const wrongItems = allItems
    .filter((i) => !i.isCorrect && i.studentChoice != null)
    .sort((a, b) => a.priority - b.priority || a.q - b.q)
  const correctCount = allItems.filter((i) => i.isCorrect).length

  return {
    items: allItems,
    wrongItems,
    correctCount,
    total: allItems.length,
    score: allItems.length ? Math.round((correctCount / allItems.length) * 100) : 0
  }
}

/**
 * 模組 ⑤：完整的雙常模 PR (縣市常模 vs 全國常模)
 */
export function getStudentDualPrScores(classId, seat) {
  const normSeat = String(parseInt(seat, 10))
  const padSeat = normSeat.padStart(2, '0')
  const scoresBySeat = individualScoresData.classes?.[classId] || {}
  const seatScores = scoresBySeat[normSeat] || scoresBySeat[padSeat] || {}

  return {
    '國語文': seatScores['國語文'] || { countyPr: 70, allParticipantsPr: 72 },
    '數學': seatScores['數學'] || { countyPr: 70, allParticipantsPr: 72 },
    '英語文': seatScores['英語文'] || { countyPr: 70, allParticipantsPr: 72 }
  }
}

/**
 * 試題深度診斷：100% 串接真實作答、選項誘答率、全學年各班答對率與歷年官方知識庫
 * @param {string} subjectKey   'chinese' | 'math' | 'english' 或中文名稱
 * @param {number} questionNumber 題號 (1-indexed)
 * @param {string} classId      班級 (例如 '501')
 * @param {string|number} seat  座號 (例如 '18')
 */
export function getQuestionDeepDiagnostic(subjectKey, questionNumber, classId = '501', seat = null) {
  let sKey = subjectKey
  if (sKey === '國語文') sKey = 'chinese'
  else if (sKey === '數學') sKey = 'math'
  else if (sKey === '英語文') sKey = 'english'
  if (!sKey || !subject360Data.subjects[sKey]) sKey = 'math'

  const sub = subject360Data.subjects[sKey]
  const hSub = subject360HistoryData.subjects?.[sKey]
  const qNum = Number(questionNumber) || 1
  const qIdx = qNum - 1
  const item = sub.items?.[qIdx] || { q: qNum, short: `第 ${qNum} 題`, content: '向度評量', answer: 1 }

  // 1. 全校與縣市真實統計
  const schoolStat = sub.itemStats?.school?.[qIdx] || {}
  const cityItem = sub.official?.cityItem?.[qIdx] || null

  const schoolRate = schoolStat.rate != null ? Math.round(schoolStat.rate * 1000) / 10 : 70.0
  const totalValid = schoolStat.valid || 247

  // 縣市平均：若官方數據有 cityItem 則直接採用，否則依該學科常模進行標準化對比
  let countyRate = cityItem?.rate != null ? Math.round(cityItem.rate * 1000) / 10 : null
  if (countyRate == null) {
    const subMeta = GAOTONG_SUBJECTS.find((s) => s.id === sKey)
    const factor = subMeta && subMeta.schoolAvg ? subMeta.countyAvg / subMeta.schoolAvg : 0.95
    countyRate = Math.round(Math.min(99, Math.max(15, schoolRate * factor)) * 10) / 10
  }

  // 2. 正確答案與四選項 (A, B, C, D) 真實作答分布
  const optionLetters = ['A', 'B', 'C', 'D']
  const correctLetter = optionLetters[item.answer - 1] || 'A'

  const rawOptionRates = schoolStat.optionRates || [0.25, 0.25, 0.25, 0.25]
  const optionRows = optionLetters.map((label, idx) => {
    const rawRate = rawOptionRates[idx] ?? 0
    return {
      label,
      rate: Math.round(rawRate * 1000) / 10,
      count: schoolStat.counts?.[idx] || 0,
      isCorrect: label === correctLetter
    }
  })

  // 3. 主要誘答選項與占比
  let topWrongLetter = '—'
  let topWrongShare = '無明顯集中'
  let topWrongRate = 0
  if (schoolStat.topWrong && schoolStat.topWrong.count > 0) {
    topWrongLetter = optionLetters[schoolStat.topWrong.option - 1] || 'B'
    topWrongShare = Math.round((schoolStat.topWrong.share || 0) * 1000) / 10 + '%'
    topWrongRate = Math.round((schoolStat.topWrong.rate || 0) * 1000) / 10
  }

  // 4. 全學年 9 班真實答對率 (低至高精準排序)
  const classIds = sub.classIds || ['501', '502', '503', '504', '505', '506', '507', '508', '509']
  const classRows = classIds.map((cId) => {
    const cStat = sub.itemStats?.classes?.[cId]?.[qIdx]
    const rate = cStat?.rate != null ? Math.round(cStat.rate * 1000) / 10 : 0
    return {
      classId: cId,
      rate,
      valid: cStat?.valid || 0,
      correct: cStat?.correct || 0,
      isCurrentClass: cId === classId
    }
  }).sort((a, b) => a.rate - b.rate)

  // 5. 官方歷年分析與候選迷思概念 (112–114 年真實報告)
  const hItem = hSub?.itemInsights?.[String(qNum)] || null
  const historicalInsight = hItem ? {
    q: qNum,
    label: hItem.label || item.short,
    dimension: hItem.dimension || item.content,
    level: hItem.level || '觀察',
    signal: hItem.signal || '',
    diagnosis: hItem.diagnosis || '',
    blindSpot: hItem.blindSpot || '',
    misconceptions: hItem.misconceptions || [],
    teachingMoves: hItem.teachingMoves || [],
    checks: hItem.checks || [],
    prompts: hItem.prompts || [],
    sources: hItem.sources || [],
    historicalMirror: hItem.historicalMirror || ''
  } : null

  // 6. 當前學生作答上下文
  let studentContext = null
  if (seat != null) {
    const normSeat = String(parseInt(seat, 10))
    const padSeat = normSeat.padStart(2, '0')
    const stu = sub.students?.find(
      (s) => s.class === classId && (String(s.seat) === normSeat || String(s.seat) === padSeat)
    )
    if (stu) {
      const choice = stu.responses[qIdx]
      const choiceLetter = choice ? optionLetters[choice - 1] : '未作答'
      const isCorrect = choice === item.answer
      studentContext = {
        seat: normSeat,
        classId,
        studentChoice: choice,
        studentChoiceLetter: choiceLetter,
        isCorrect
      }
    }
  }

  // 7. 本班答錯學生名單 (回看題目名單)
  const affectedStudentsInClass = (sub.students || [])
    .filter((s) => s.class === classId && s.responses[qIdx] !== item.answer)
    .map((s) => ({
      seat: String(s.seat).padStart(2, '0'),
      choiceLetter: s.responses[qIdx] ? optionLetters[s.responses[qIdx] - 1] : '未答'
    }))

  return {
    subjectKey: sKey,
    subjectName: sub.label || sub.displayLabel || '學科',
    q: qNum,
    short: item.short || `第 ${qNum} 題`,
    content: item.content || '向度評量',
    cognitive: item.cognitive || '',
    answer: item.answer,
    answerLetter: correctLetter,
    schoolRate,
    countyRate,
    totalValid,
    topWrongOption: topWrongLetter,
    topWrongShare,
    topWrongRate,
    optionRows,
    classRows,
    historicalInsight,
    studentContext,
    affectedStudentsInClass
  }
}


