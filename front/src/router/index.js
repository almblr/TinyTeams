import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/LoginView.vue';
import Home from '../views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/news',
    name: 'News',
    component: Home,
    beforeEnter: (to, from, next) => {
      window.localStorage.getItem('TokenUser') ? next() : next('/');
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
