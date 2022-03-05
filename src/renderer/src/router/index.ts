import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import Home from '../views/home.vue'
import Index from '../views/index.vue'
const Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: 'index',
          component: Index
        }
      ]
    }
  ]
})

export default Router