import { createRouter, createWebHistory } from 'vue-router'
import Calculator from '../views/CalculatorView.vue'
import Admin from '../views/AdminView.vue'
import Calendar from '../views/CalendarView.vue'
import Email from '../views/EmailView.vue'
import { componentsToColor } from 'pdf-lib'
import QBO from '../views/qboView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router