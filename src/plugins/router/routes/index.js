const Main = () => import('@/views/Main/Main.vue')

let routes = [
  // 欢迎页
  // {
  //   path: '/',
  //   component: Main,
  //   name: '',
  //   iconCls: 'fa fa-bookmark',
  //   leaf: true, // 只有一个节点
  //   redirect: {path: '/main'},
  //   children: [{
  //     path: '/main',
  //     component: () =>
  //       import ('@/views/Welcome/Welcome.vue'),
  //     name: '欢迎使用',
  //     meta: {requiresAuth: true}
  //   }]
  // },
  // 商铺列表
  {
    path: '/',
    component: Main,
    name: '',
    iconCls: 'fa fa-bookmark',
    leaf: true, // 只有一个节点
    redirect: {path: '/main'},
    children: [{
      path: '/main',
      component: () =>
        import('@/views/Config/Edit.vue'),
      name: '商铺信息',
      meta: {requiresAuth: true}
    }]
  },
  // 商品分类
  {
    path: '/',
    component: Main,
    name: '商品分类',
    iconCls: 'fa fa-leaf',
    leaf: false, // 只有一个节点
    children: [
      {
        path: '/category',
        component: () => import('@/views/Category/List.vue'),
        name: '商品分类列表',
        meta: {requiresAuth: true}
      },
      {
        path: '/category/edit/:id',
        component: () => import('@/views/Category/Edit.vue'),
        name: '商品分类编辑',
        hidden: true,
        meta: {requiresAuth: true}
      },
      {
        path: '/category/add',
        component: () => import('@/views/Category/Add.vue'),
        name: '商品分类新增',
        hidden: true,
        meta: {requiresAuth: true}
      }
      // {
      //   path: '/category/:category_id/categoryindex',
      //   component: () => import('@/views/Categoryindex/List.vue'),
      //   name: '商品关键词列表',
      //   hidden: true,
      //   meta: {requiresAuth: true}
      // },
      // {
      //   path: '/category/:category_id/categoryindex/edit/:id',
      //   component: () => import('@/views/Categoryindex/Edit.vue'),
      //   name: '商品关键词编辑',
      //   hidden: true,
      //   meta: {requiresAuth: true}
      // },
      // {
      //   path: '/category/:category_id/categoryindex/add',
      //   component: () => import('@/views/Categoryindex/Add.vue'),
      //   name: '商品关键词新增',
      //   hidden: true,
      //   meta: {requiresAuth: true}
      // }
    ]
  },
  // 商品关键词
  {
    path: '/',
    component: Main,
    name: '商品关键词',
    iconCls: 'fa fa-leaf',
    leaf: false, // 只有一个节点
    children: [
      {
        path: '/categoryindex',
        component: () => import('@/views/Categoryindex/List.vue'),
        name: '商品关键词列表',
        meta: {requiresAuth: true}
      },
      {
        path: '/categoryindex/edit/:id',
        component: () => import('@/views/Categoryindex/Edit.vue'),
        name: '商品关键词编辑',
        hidden: true,
        meta: {requiresAuth: true}
      },
      {
        path: '/categoryindex/add',
        component: () => import('@/views/Categoryindex/Add.vue'),
        name: '商品关键词新增',
        hidden: true,
        meta: {requiresAuth: true}
      }
    ]
  },
  // 商品列表
  {
    path: '/',
    component: Main,
    name: '商品列表',
    iconCls: 'fa fa-leaf',
    leaf: false, // 只有一个节点
    children: [
      {
        path: '/goods',
        component: () => import('@/views/Goods/List.vue'),
        name: '商品列表',
        meta: {requiresAuth: true}
      },
      {
        path: '/goods/edit/:id',
        component: () => import('@/views/Goods/Edit.vue'),
        name: '商品列表编辑',
        hidden: true,
        meta: {requiresAuth: true}
      },
      {
        path: '/goods/add',
        component: () => import('@/views/Goods/Add.vue'),
        name: '商品列表新增',
        hidden: true,
        meta: {requiresAuth: true}
      },
      {
        path: '/goods/:goods_id/spec',
        component: () => import('@/views/Spec/List.vue'),
        name: '商品规格列表',
        hidden: true,
        meta: {requiresAuth: true}
      },
      {
        path: '/goods/:goods_id/spec/edit/:id',
        component: () => import('@/views/Spec/Edit.vue'),
        name: '商品规格编辑',
        hidden: true,
        meta: {requiresAuth: true}
      },
      {
        path: '/goods/:goods_id/spec/add',
        component: () => import('@/views/Spec/Add.vue'),
        name: '商品规格新增',
        hidden: true,
        meta: {requiresAuth: true}
      }
    ]
  },
  // 商品规格
  // {
  //   path: '/',
  //   component: Main,
  //   name: '商品规格',
  //   iconCls: 'fa fa-leaf',
  //   leaf: false, // 只有一个节点
  //   children: [
  //     {
  //       path: '/spec',
  //       component: () => import('@/views/Spec/List.vue'),
  //       name: '商品规格列表',
  //       meta: {requiresAuth: true}
  //     },
  //     {
  //       path: '/spec/edit/:id',
  //       component: () => import('@/views/Spec/Edit.vue'),
  //       name: '商品规格编辑',
  //       hidden: true,
  //       meta: {requiresAuth: true}
  //     },
  //     {
  //       path: '/spec/add',
  //       component: () => import('@/views/Spec/Add.vue'),
  //       name: '商品规格新增',
  //       hidden: true,
  //       meta: {requiresAuth: true}
  //     }
  //   ]
  // },
  // 订单列表
  {
    path: '/',
    component: Main,
    name: '订单列表',
    iconCls: 'fa fa-leaf',
    leaf: false, // 只有一个节点
    children: [
      {
        path: '/order',
        component: () => import('@/views/Order/List.vue'),
        name: '订单列表',
        meta: {requiresAuth: true}
      },
      {
        path: '/order/edit/:id',
        component: () => import('@/views/Order/Edit.vue'),
        name: '订单编辑',
        hidden: true,
        meta: {requiresAuth: true}
      },
      {
        path: '/order/:order_id/ordergoods',
        component: () => import('@/views/Ordergoods/List.vue'),
        name: '订单商品',
        hidden: true,
        meta: {requiresAuth: true}
      },
      {
        path: '/order/:order_id/ordergoods/edit/:id',
        component: () => import('@/views/Ordergoods/Edit.vue'),
        name: '订单商品编辑',
        hidden: true,
        meta: {requiresAuth: true}
      }
    ]
  },
  // 订单商品
  // {
  //   path: '/',
  //   component: Main,
  //   name: '订单商品',
  //   iconCls: 'fa fa-leaf',
  //   leaf: false, // 只有一个节点
  //   children: [
  //     {
  //       path: '/ordergoods',
  //       component: () => import('@/views/Ordergoods/List.vue'),
  //       name: '订单商品',
  //       meta: {requiresAuth: true}
  //     },
  //     {
  //       path: '/ordergoods/edit/:id',
  //       component: () => import('@/views/Ordergoods/Edit.vue'),
  //       name: '订单商品编辑',
  //       hidden: true,
  //       meta: {requiresAuth: true}
  //     }
  //   ]
  // },
  // 广告位
  {
    path: '/',
    component: Main,
    name: '广告位',
    iconCls: 'fa fa-leaf',
    leaf: false, // 只有一个节点
    children: [
      {
        path: '/place',
        component: () => import('@/views/Place/List.vue'),
        name: '广告位列表',
        meta: {requiresAuth: true}
      },
      {
        path: '/place/edit/:id',
        component: () => import('@/views/Place/Edit.vue'),
        name: '广告位编辑',
        hidden: true,
        meta: {requiresAuth: true}
      },
      {
        path: '/place/add',
        component: () => import('@/views/Place/Add.vue'),
        name: '广告位新增',
        hidden: true,
        meta: {requiresAuth: true}
      }
    ]
  },
  // 广告
  {
    path: '/',
    component: Main,
    name: '广告',
    iconCls: 'fa fa-leaf',
    leaf: false, // 只有一个节点
    children: [
      {
        path: '/ads',
        component: () => import('@/views/Ads/List.vue'),
        name: '广告列表',
        meta: {requiresAuth: true}
      },
      {
        path: '/ads/edit/:id',
        component: () => import('@/views/Ads/Edit.vue'),
        name: '广告编辑',
        hidden: true,
        meta: {requiresAuth: true}
      },
      {
        path: '/ads/add',
        component: () => import('@/views/Ads/Add.vue'),
        name: '广告新增',
        hidden: true,
        meta: {requiresAuth: true}
      }
    ]
  },
  // 404 页面跳转
  {
    path: '*',
    hidden: true,
    redirect: {path: '/'}
  }
]

export default routes
