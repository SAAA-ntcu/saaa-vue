import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/',
    name: 'News',
    component: () => import('../views/NewsView.vue'),
    meta: { title: '最新消息 - 縣市學生學習能力檢測' }
  },
  {
    path: '/AssessmentFrames',
    name: 'AssessmentFrames',
    component: () => import('../views/AssessmentFramesView.vue'),
    meta: { title: '評量架構 - 縣市學生學習能力檢測' }
  },
  {
    path: '/ExamReleases',
    name: 'ExamReleases',
    component: () => import('../views/ExamReleasesView.vue'),
    meta: { title: '試題公告 - 縣市學生學習能力檢測' }
  },
  {
    path: '/logins',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '系統登入 - 縣市學生學習能力檢測' }
  },
  {
    path: '/scores',
    name: 'Scores',
    component: () => import('../views/ScoresView.vue'),
    meta: { title: '成績專區 - 縣市學生學習能力檢測' }
  },
  {
    path: '/integrated',
    name: 'Integrated',
    component: () => import('../views/IntegratedView.vue'),
    meta: { title: '綜合專區 - 縣市學生學習能力檢測' }
  },
  {
    path: '/changepasss',
    name: 'ChangePassword',
    component: () => import('../views/ChangePasswordView.vue'),
    meta: { title: '更改密碼 - 縣市學生學習能力檢測' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPasswordView.vue'),
    meta: { title: '忘記密碼 - 縣市學生學習能力檢測' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const protectedPaths = ['/scores', '/integrated', '/changepasss']
  if (protectedPaths.includes(to.path)) {
    const { state } = useAuth()
    if (!state.isLoggedIn) {
      ElMessage.warning('此專區需登入驗證身分，請先登入系統')
      return next({ path: '/logins', query: { redirect: to.fullPath } })
    }
  }
  next()
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
