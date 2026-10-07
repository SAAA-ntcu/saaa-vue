/**
 * 教師帳號管理 Mock 資料
 */

export function getInitialTeachers(schoolName = '測試國小') {
  return [
    {
      id: 1,
      selected: false,
      year: '115',
      username: 'PAdmin_054628',
      name: `${schoolName}_校長`,
      adminCode: 'PAdmin_054628',
      role: '校長',
      grade: '',
      assignedClass: '',
      email: 'principal@ntcu.edu.tw',
      isActive: true
    },
    {
      id: 2,
      selected: false,
      year: '115',
      username: 'DAdmin_014628',
      name: '陳○廷',
      adminCode: 'DAdmin_014628',
      role: '學年主任',
      grade: '',
      assignedClass: '',
      email: 'grade1@ntcu.edu.tw',
      isActive: true
    },
    {
      id: 3,
      selected: false,
      year: '115',
      username: 'DAdmin_024628',
      name: '林○萱',
      adminCode: 'DAdmin_024628',
      role: '學年主任',
      grade: '',
      assignedClass: '',
      email: 'grade2@ntcu.edu.tw',
      isActive: false // 停用帳號 1
    },
    {
      id: 4,
      selected: false,
      year: '115',
      username: 'DAdmin_034628',
      name: '張○恩',
      adminCode: 'DAdmin_034628',
      role: '學年主任',
      grade: '',
      assignedClass: '',
      email: 'grade3@ntcu.edu.tw',
      isActive: true
    },
    {
      id: 5,
      selected: false,
      year: '115',
      username: 'TAdmin_301001',
      name: '王○晴',
      adminCode: 'TAdmin_301001',
      role: '班級導師',
      grade: '3',
      assignedClass: '三年 1 班',
      email: 'wang@ntcu.edu.tw',
      isActive: true
    },
    {
      id: 6,
      selected: false,
      year: '115',
      username: 'TAdmin_302002',
      name: '李○哲',
      adminCode: 'TAdmin_302002',
      role: '班級導師',
      grade: '3',
      assignedClass: '三年 2 班',
      email: 'lee@ntcu.edu.tw',
      isActive: false // 停用帳號 2
    },
    {
      id: 7,
      selected: false,
      year: '115',
      username: 'TAdmin_401003',
      name: '黃○宏',
      adminCode: 'TAdmin_401003',
      role: '班級導師',
      grade: '4',
      assignedClass: '四年 1 班',
      email: 'huang@ntcu.edu.tw',
      isActive: true
    },
    {
      id: 8,
      selected: false,
      year: '115',
      username: 'TAdmin_501004',
      name: '趙○芬',
      adminCode: 'TAdmin_501004',
      role: '班級導師',
      grade: '5',
      assignedClass: '五年 1 班',
      email: 'chao@ntcu.edu.tw',
      isActive: true
    },
    {
      id: 9,
      selected: false,
      year: '115',
      username: 'TAdmin_502005',
      name: '周○翔',
      adminCode: 'TAdmin_502005',
      role: '班級導師',
      grade: '5',
      assignedClass: '五年 2 班',
      email: 'chou@ntcu.edu.tw',
      isActive: false // 停用帳號 3
    },
    {
      id: 10,
      selected: false,
      year: '115',
      username: 'SAdmin_300006',
      name: '蔡○安',
      adminCode: 'SAdmin_300006',
      role: '科任教師',
      grade: '3',
      assignedClass: '三年級 (英語科任)',
      email: 'tsai@ntcu.edu.tw',
      isActive: true
    },
    {
      id: 11,
      selected: false,
      year: '115',
      username: 'SAdmin_400007',
      name: '吳○嘉',
      adminCode: 'SAdmin_400007',
      role: '科任教師',
      grade: '4',
      assignedClass: '四年級 (自然科任)',
      email: 'wu@ntcu.edu.tw',
      isActive: false // 停用帳號 4
    },
    {
      id: 12,
      selected: false,
      year: '115',
      username: 'TAdmin_602008',
      name: '郭○妤',
      adminCode: 'TAdmin_602008',
      role: '班級導師',
      grade: '6',
      assignedClass: '六年 2 班',
      email: 'kuo@ntcu.edu.tw',
      isActive: true
    }
  ]
}

export const defaultTeacherList = getInitialTeachers()
