import index from './appPages/index';
import p404 from './appPages/p404';
const admin = ()=> import('./appPages/admin');
const detail = ()=> import('./appPages/detail');

export default [
  {
    name: 'index',
    path: '/',
    component: index
  },
  {
    name: 'detail',
    path: '/detail/:_id',
    component: detail,
    props: true
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
