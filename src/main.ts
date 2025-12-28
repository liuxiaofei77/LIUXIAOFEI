import { createApp } from 'vue'
import App from './App' // 改用 TSX 作为根组件
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import router from '@/router/index'
import 'dayjs/locale/zh-cn'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import CommonModal from '@/components/CommonModal'
import Table from '@/components/CommonTable'

const app = createApp(App)
app.component('CommonModal', CommonModal)
app.component('CommonTable', Table)

app.use(Antd, {
  locale: zhCN, // 全局配置antd为中文
}).use(router).mount('#app')
