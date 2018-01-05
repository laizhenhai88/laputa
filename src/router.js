import p404 from './pages/p404';
const admin = ()=> import('./pages/admin');
const list = () => import('./pages/list');
const detail = ()=> import('./pages/detail');

export default [
  {
    name: 'list',
    path: '/',
    component: list
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
