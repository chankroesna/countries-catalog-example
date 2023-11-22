import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    meta: {
      title: 'Countries'
    },
    path: '/',
    name: 'countries',
    component: () => import('@/pages/country/index.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
