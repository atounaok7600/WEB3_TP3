import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '../views/signupView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/signup",
      name: 'signup',
      component: SignupView
    },
    {
      path: "/login",
      name: 'login',
      component: LoginView
    },
    {
      path: "/maplace",
      name: 'Ma place',
      component: HomeView
    },
    {
      path: "/valet",
      name: 'Valet',
      component: HomeView
    },
  ]
})

export default router
