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

// 获取access_token
  let isLogin = sessionStorage.getItem('IS_LOGIN')
  // 判断是否已登录，未登录则跳转至登录页
  if (process.env.NODE_ENV === 'production') {
    if (!isLogin) {
      window.location.href = '/admin/'
      // next()
    } else {
      let openId = sessionStorage.getItem('shop_id')
      if (openId === undefined && to.path !== '/main') {
        // 错误提示
        Message.error({
          message: '请先配置商铺信息',
          showClose: true
        })
      } else {
        // 若已登录，则检查是否已选择公众号
        let wechatId = sessionStorage.getItem('WECHAT_ID')
        if (!wechatId && to.path !== '/') {
          // 错误提示
          Message.error({
            message: '请先选择公众号',
            showClose: true
          })
          window.location.href = '/admin/'
        } else {
          next()
        }
      }
    }
  } else {
    next()
  }
})
// // 若已登录，则检查是否已选择公众号
// let wechatId = sessionStorage.getItem('WECHAT_ID');
// if (!wechatId && to.path !== '/') {
//   // 错误提示
//   Message.error({
//     message: '请先选择公众号',
//     showClose: true,
//   });
//   window.location.href = '/admin/';
// } else {
//   next();
// }

export default router
