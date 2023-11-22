import { createRouter, createWebHistory } from 'vue-router'
import SignupView from '../views/signupView.vue'
import LoginView from '../views/LoginView.vue'
import MaPlaceView from '../views/MaPlaceView.vue'
import ValetView from '../views/ValetView.vue'
import ProfilView from '../views/ProfilView.vue'
import MoveCarView from '../views/MoveCarView.vue'
import TransactView from '../views/TransactView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      path: "/movecar/:userId",
      name: 'Déplacer',
      component: MoveCarView
    },
    {
      path: "/transaction",
      name: 'transaction',
      component: TransactView
    },
  ]
})

export default router
