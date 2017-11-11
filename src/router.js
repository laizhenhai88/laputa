import index from './pages/index';
import detail from './pages/detail';

export default [{
    path: '/',
    component: index
  },
  {
    name: 'detail',
    path: '/detail/:id',
    component: detail,
    props: true
  }
]
