import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/Main';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import Servers from '@/components/Servers';
import Admin from '@/components/Admin';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/servers',
      name: 'Servers',
      component: Servers,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
    },
    { path: '*', redirect: '/' },
  ],
});
