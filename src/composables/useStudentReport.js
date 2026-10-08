import { paperGrades } from '../data/reportsMatrixData'

/**
 * 綜合成績單資料組裝
 *
 * - 受測科目依 paperGrades 判斷（例：3 年級只有國語文、數學；5 年級加考英語文）
 * - 跨科比較一律使用「個人 − 縣市平均」(delta) 或 PR，不直接比較各科答對率
 * - 不設固定及格線，也不產生任何等第標籤
 *
 * 目前學生作答為示範資料（依座號/班級產生固定亂數），之後串接 API 時
 * 只要回傳相同結構的 subjects 陣列即可，畫面元件不需修改。
 */

// 科目識別色採莫蘭迪低彩度，刻意避開常模三色（學校 #f59e0b / 縣市 #2563eb / 全體 #9333ea）
export const SUBJECT_CATALOG = [
  {
    key: 'chinese',
    name: '國語文',
    short: '國',
    chipColor: '#b5575f',
    bandColor: '#fde2e4',
    bench: { school: 77, county: 72, national: 70 },
    dims: [
      { name: '形音知識', short: '形音', totalQ: 3, bench: { school: 93, county: 86, national: 84 } },
      { name: '字詞知識', short: '字詞', totalQ: 2, bench: { school: 68, county: 63, national: 62 } },
      { name: '語法知識', short: '語法', totalQ: 4, bench: { school: 83, county: 79, national: 78 } },
      { name: '修辭知識', short: '修辭', totalQ: 2, bench: { school: 67, county: 65, national: 65 } },
      { name: '標點知識', short: '標點', totalQ: 1, bench: { school: 54, county: 48, national: 49 } },
      { name: '文體知識', short: '文體', totalQ: 1, bench: { school: 72, county: 65, national: 65 } },
      { name: '字詞理解', short: '字詞理解', totalQ: 4, bench: { school: 80, county: 74, national: 73 } },
      { name: '句子理解', short: '句子理解', totalQ: 2, bench: { school: 89, county: 84, national: 83 } },
      { name: '段落理解', short: '段落理解', totalQ: 2, bench: { school: 77, county: 73, national: 71 } },
      { name: '篇章理解', short: '篇章理解', totalQ: 3, bench: { school: 73, county: 66, national: 63 } }
    ]
  },
  {
    key: 'math',
    name: '數學',
    short: '數',
    chipColor: '#3f7d6e',
    bandColor: '#e2ece9',
    bench: { school: 74, county: 70, national: 68 },
    dims: [
      { name: '數與計算', short: '數與計算', totalQ: 8, bench: { school: 78, county: 74, national: 72 } },
      { name: '量與實測', short: '量與實測', totalQ: 6, bench: { school: 70, county: 66, national: 64 } },
      { name: '空間與形狀', short: '空間形狀', totalQ: 5, bench: { school: 75, county: 71, national: 70 } },
      { name: '關係', short: '關係', totalQ: 5, bench: { school: 62, county: 58, national: 57 } }
    ]
  },
  {
    key: 'english',
    name: '英語文',
    short: '英',
    chipColor: '#6c6aa8',
    bandColor: '#e8e8f4',
    bench: { school: 76, county: 73, national: 71 },
    dims: [
      { name: '聽力－語音聽辨', short: '語音聽辨', totalQ: 6, bench: { school: 85, county: 82, national: 80 } },
      { name: '聽力－辭彙聽辨', short: '辭彙聽辨', totalQ: 6, bench: { school: 80, county: 76, national: 75 } },
      { name: '聽力－教室生活群句理解與回應', short: '生活群句', totalQ: 8, bench: { school: 72, county: 68, national: 66 } },
      { name: '聽力－文化節慶理解', short: '文化節慶', totalQ: 4, bench: { school: 76, county: 72, national: 70 } }
    ]
  }
]

/** 依年級取得受測科目定義（資料來源：paperGrades） */
export function getSubjectsForGrade(grade) {
  const gradeLabel = `${grade}年級`
  const testedNames = paperGrades.filter(p => p.grade === gradeLabel).map(p => p.subject)
  return SUBJECT_CATALOG.filter(s => testedNames.includes(s.name))
}

// 固定種子亂數（同一位學生每次開啟結果相同）
function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seededRandom(seed) {
  let t = seed
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/** 以「與常模的差距」粗估 PR（示範用；正式版由 API 提供） */
function estimatePr(rate, benchmark) {
  return clamp(Math.round(50 + (rate - benchmark) * 2.2), 1, 99)
}

/**
 * 組出單一學生的綜合成績單
 * @param {Object} student  { seat, name, rate }
 * @param {Object} ctx      { grade, classObj }
 */
export function buildStudentReport(student, ctx) {
  if (!student) return null
  const subjectDefs = getSubjectsForGrade(ctx.grade)

  const subjects = subjectDefs.map(def => {
    const rand = seededRandom(hashString(`${ctx.classObj}-${student.seat}-${def.key}`))
    // 每位學生、每科有一個整體能力傾向，再加上各向度的個別差異
    const subjectAbility = clamp((student.rate || 75) / 100 + (rand() - 0.5) * 0.24, 0.2, 0.97)

    let qNo = 1
    let totalCorrect = 0
    let totalQ = 0

    const dims = def.dims.map((d, i) => {
      const dimAbility = clamp(subjectAbility + (rand() - 0.5) * 0.36, 0.05, 0.98)
      const correctQs = []
      const wrongQs = []
      for (let q = 0; q < d.totalQ; q++) {
        if (rand() < dimAbility) correctQs.push(qNo)
        else wrongQs.push(qNo)
        qNo++
      }
      totalCorrect += correctQs.length
      totalQ += d.totalQ
      const rate = Math.round((correctQs.length / d.totalQ) * 100)
      return {
        key: `${def.key}-${i}`,
        name: d.name,
        short: d.short,
        totalQ: d.totalQ,
        rate,
        bench: d.bench,
        delta: rate - d.bench.county,
        correctQs,
        wrongQs
      }
    })

    const rate = Math.round((totalCorrect / totalQ) * 100)
    return {
      key: def.key,
      name: def.name,
      short: def.short,
      chipColor: def.chipColor,
      bandColor: def.bandColor,
      bench: def.bench,
      rate,
      pr: {
        county: estimatePr(rate, def.bench.county),
        national: estimatePr(rate, def.bench.national)
      },
      dims
    }
  })

  return {
    student: { ...student, grade: ctx.grade, classObj: ctx.classObj },
    subjects
  }
}

/** 跨科相對強弱：所有科目的向度攤平後依 delta 排序 */
export function rankCrossSubjectDims(subjects, limit = 3) {
  const all = subjects.flatMap(s => s.dims.map(d => ({ ...d, subject: s })))
  return {
    strengths: all.filter(d => d.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, limit),
    focus: all.filter(d => d.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, limit)
  }
}
