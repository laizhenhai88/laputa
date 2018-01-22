import index from './appPages/index';
import p404 from './appPages/p404';
const admin = ()=> import('./appPages/admin');

export default [
  {
    name: 'index',
    path: '/',
    component: index
  },
  {
    name: '*',
    path: '*',
    component: p404
  },
  {
    path: '/admin',
    name: 'admin',
    component: admin
  },
]
