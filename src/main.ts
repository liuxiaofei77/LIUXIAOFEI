import { createApp } from 'vue'
import App from './App' // 改用 TSX 作为根组件
import 'ant-design-vue/dist/reset.css'
import router from '@/router/index'

createApp(App).use(router).mount('#app')
