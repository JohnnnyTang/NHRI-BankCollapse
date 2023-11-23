import { createRouter, createWebHistory } from 'vue-router'
import index from '../views/Index.vue'
import homeView from '../views/HomeView.vue'
import statisticsView from '../views/StatisticsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      children: [
        {path: '', component: homeView},
        {path: '/home', name: 'home', component: homeView},
        {path: '/statistics', name:'statistics', component: statisticsView},
        {path: '/device', name:'device'}
      ]
    }
  ]
})

export default router
