import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignupView from '../views/signupView.vue'
import LoginView from '../views/LoginView.vue'
import MaPlaceView from '../views/MaPlaceView.vue'
import ValetView from '../views/ValetView.vue'
import ProfilView from '../views/ProfilView.vue'

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
      component: MaPlaceView
    },
    {
      path: "/valet",
      name: 'Valet',
      component: ValetView
    },
    {
      path: "/profil",
      name: 'Profil',
      component: ProfilView
    },
  ]
})

export default router
