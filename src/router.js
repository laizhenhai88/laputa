import p404 from './pages/p404';
import admin from './pages/admin';
const post = ()=> import('./pages/post');

export default [
  {
    path: '/',
    name: 'admin',
    component: admin
  },
  {
    name: '*',
    path: '*',
    component: p404
  },
  {
    path: '/post',
    name: 'post',
    component: post
  },
]
