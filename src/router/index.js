import { createRouter, createWebHistory } from 'vue-router';
import Calculator from '../views/CalculatorView.vue';
import Admin from '../views/AdminView.vue';
import Calendar from '../views/CalendarView.vue';
import Email from '../views/EmailView.vue';
import QBO from '../views/qboView.vue';
import CustomerPortal from '../views/CustomerPortalView.vue';
import Team from '../views/TeamView.vue';
import TeamBio from '../views/TeamBioView.vue';
import TeamVCard from '../views/TeamVCardView.vue';
import TeamQR from '../views/TeamQRView.vue';
import Sales from '../views/SalesView.vue';
import Login from '../views/LoginView.vue';
import { isAuthenticated } from '../auth/authGuard';

const routes = [
  {
    path: '/',
    name: 'Calculator',
    component: Calculator
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
  },
  {
    path: '/make-appointment',
    name: 'Calendar',
    component: Calendar
  },
  {
    path: '/email',
    name: 'Email',
    component: Email,
    meta: { requiresAuth: true }
  },
  {
    path: '/qbo',
    name: 'Connect',
    component: QBO,
    meta: { requiresAuth: true }
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
  },
  {
    path: '/team/:role/vcf',
    name: 'TeamVCard',
    component: TeamVCard
  },
  {
    path: '/team/:role/qr',
    name: 'TeamQR',
    component: TeamQR
  },
  {
    path: '/sales',
    name: 'Sales',
    component: Sales,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated.value) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;