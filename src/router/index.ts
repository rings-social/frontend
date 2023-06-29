import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/createUser',
      name: 'create-user',
      component: () => import('../views/CreateUserView.vue'),
    },
    {
      path: '/r/:ringName',
      name: 'view-ring',
      component: () => import('../views/RingView.vue')
    },
    {
      path: '/r/:ringName/:postId',
      name: 'view-post',
      component: () => import('../views/PostView.vue')
    },
    {
      path: '/u/:username',
      name: 'view-user',
      component: () => import('../views/UserView.vue'),
    }
  ]
})

export default router
