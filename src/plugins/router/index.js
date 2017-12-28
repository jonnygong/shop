import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import configs from '@/configs'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
  // mode: 'history'
})

router.beforeEach((to, from, next) => {
  document.title = `${configs.title} - ${to.name}`
  // 需要鉴权的路由地址
  if (to.meta.requiresAuth && to.path !== '/login') {
    // 如果未登录，跳转
    if (window.localStorage.getItem('IS_LOGIN') === null) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
        // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
