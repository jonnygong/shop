const Main = () => import('@/views/Main/Main.vue')

/**
 *  路由对象 meta 标签
 *  meta: {
 *  requiresAuth: true, // 用于权限的校验
 *  }
 */

let routes = [
  // 登录页
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: '用户登录'
  },
  // 欢迎页
  {
    path: '/',
    component: Main,
    name: '首页',
    redirect: '/main',
    children: [{
      path: '/main',
      component: () => import('@/views/Welcome/Welcome.vue'),
      name: '欢迎使用',
      meta: {requiresAuth: true}
    }]
  },
  // 菜单演示
  {
    path: '/demo',
    component: Main,
    name: '演示菜单',
    children: [
      {
        path: 'list',
        component: () => import('@/views/Model/List.vue'),
        name: '菜单列表',
        meta: {requiresAuth: true}
      },
      {
        path: 'list/edit/:id',
        component: () => import('@/views/Model/Edit.vue'),
        name: '菜单编辑',
        meta: {requiresAuth: true}
      },
      {
        path: 'list/add',
        component: () => import('@/views/Model/Add.vue'),
        name: '菜单新增',
        meta: {requiresAuth: true}
      }
    ]
  },
  // 菜单演示
  {
    path: '/demo1',
    component: Main,
    name: '演示菜单1',
    children: [
      {
        path: 'list',
        component: () => import('@/views/Model/List.vue'),
        name: '菜单列表1',
        meta: {requiresAuth: true}
      },
      {
        path: 'list/edit/:id',
        component: () => import('@/views/Model/Edit.vue'),
        name: '菜单1编辑',
        meta: {requiresAuth: true}
      },
      {
        path: 'list/add',
        component: () => import('@/views/Model/Add.vue'),
        name: '菜单1新增',
        meta: {requiresAuth: true}
      }
    ]
  },
  // 个人中心
  {
    path: '/personal',
    component: Main,
    name: '个人中心',
    redirect: '/personal/data',
    children: [{
      path: 'data',
      component: () => import('@/views/Personal/Data.vue'),
      name: '个人资料',
      meta: {requiresAuth: true}
    },
    {
      path: 'setting',
      component: () => import('@/views/Personal/Setting.vue'),
      name: '个人设置',
      meta: {requiresAuth: true}
    }
    ]
  },
  // 404 页面跳转
  {
    path: '*',
    redirect: {path: '/'}
  }
]

export default routes
