import index from './pages/index';
import p404 from './pages/p404';
const detail = ()=> import('./pages/detail');

export default [{
    path: '/',
    component: index
  },
  {
    name: 'detail',
    path: '/detail/:id',
    component: detail,
    props: true
  },
  {
    name: '*',
    path: '*',
    component: p404
  }
]
