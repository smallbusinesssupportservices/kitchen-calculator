import { createRouter, createWebHistory } from 'vue-router'
import Calculator from '../views/CalculatorView.vue'
import Admin from '../views/AdminView.vue'
import Calendar from '../views/CalendarView.vue'

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
    path: '/cal',
    name: 'Calendar',
    component: Calendar
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router