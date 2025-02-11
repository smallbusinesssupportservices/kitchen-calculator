import { createRouter, createWebHistory } from 'vue-router'
import Calculator from '../views/CalculatorView.vue'
import Admin from '../views/AdminView.vue'
import Calendar from '../views/CalendarView.vue'
import Email from '../views/EmailView.vue'
import QBO from '../views/qboView.vue'
import CustomerPortal from '../views/CustomerPortalView.vue'
import Team from '../views/TeamView.vue'
import TeamBio from '../views/TeamBioView.vue'

const routes = [
  {
    path: '/',
    name: 'Calculator',
    component: Calculator
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/make-appointment',
    name: 'Calendar',
    component: Calendar
  },
  {
    path: '/email',
    name: 'Email',
    component: Email
  },
  {
    path: '/qbo',
    name: 'Connect',
    component: QBO
  },
  {
    path: '/portal',
    name: 'CustomerPortal',
    component: CustomerPortal
  },
  {
    path: '/team',
    name: 'Team',
    component: Team
  },
  {
    path: '/team/:role',
    name: 'TeamBio',
    component: TeamBio
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router