import { createRouter, createWebHistory } from 'vue-router'
import index from '../views/Index.vue'
import homeView from '../views/HomeView.vue'
// import statisticsView from '../views/StatisticsView.vue'
import waterForecastWrapper from '../views/WaterForecastWrapper.vue';
import deviceViewWrapper from '../views/DeviceViewWrapper.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: index,
      children: [
        {path: '', name: 'index', component: homeView},
        {path: '/home', name: 'home', component: homeView},
        {path: '/statistics', name:'statistics', component: waterForecastWrapper},
        {path: '/device', name:'device', component: deviceViewWrapper}
      ]
    }
  ]
})

export default router
