import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {
  ElDialog,
  ElPagination,
  ElSwitch,
  ElPopover,
  ElDrawer
} from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-drawer.css'
import 'element-plus/theme-chalk/el-pagination.css'
import 'element-plus/theme-chalk/el-switch.css'
import 'element-plus/theme-chalk/el-popper.css'
import 'element-plus/theme-chalk/el-popover.css'
import 'element-plus/theme-chalk/el-message.css'
import './style.css'

const app = createApp(App)

const components = [ElDialog, ElPagination, ElSwitch, ElPopover, ElDrawer]
components.forEach(component => {
  app.use(component)
})

app.use(router)

app.mount('#app')
