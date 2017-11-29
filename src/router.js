import post from './pages/post';
import p404 from './pages/p404';
const list = ()=> import('./pages/list');
const detail = ()=> import('./pages/detail');

export default [{
    path: '/',
    name: 'post',
    component: post
  },
  {
    name: 'list',
    path: '/list',
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
  }
]
