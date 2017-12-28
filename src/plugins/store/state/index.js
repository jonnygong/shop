// 登录用户信息
const user = {
  name: '', // 用户名
  avatar: '' // 用户头像
}

const nav = [{
  name: '演示菜单',
  url: '',
  iconCls: 'fa fa-bookmark',
  children: [{
    name: '菜单列表',
    url: '/demo/list'
  }]
}, {
  name: '演示菜单1',
  iconCls: 'fa fa-archive',
  url: '',
  children: [{
    name: '菜单列表1',
    url: '/demo1/list'
  }]
}]

// 已打开页面的标签栏
const pageOpenedList = []
const currentTitle = ''

export default {
  user,
  pageOpenedList,
  currentTitle,
  nav
}
