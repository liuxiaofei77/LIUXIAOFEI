
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: () => import('@/views/index'),
      meta: {
        title: '待办事项清单'
      }
    },

  ]
})


export default router
