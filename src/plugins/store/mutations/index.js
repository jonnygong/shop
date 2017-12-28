// 同步操作

// 注销
const LOGIN_OUT = (state, payload) => {
  window.localStorage.removeItem('IS_LOGIN')
}
// 登录成功
const LOGIN_SUCCESS = (state) => {
  window.localStorage.setItem('IS_LOGIN', true)
}
// 设置用户信息
const SET_USER_INFO = (state, {
  user,
  avatar
}) => {
  state.user.name = user
  state.user.avatar = avatar
}

const INCREASE_TAG = (state, tagObj) => {
  state.pageOpenedList.splice(1, 0, tagObj)
}

const REMOVE_TAG = (state, name) => {
  state.pageOpenedList.map((item, index) => {
    if (item.path === name) {
      state.pageOpenedList.splice(index, 1)
    }
  })
}

const MOVE_TO_SECOND = (state, index) => {
  let openedPage = state.pageOpenedList[index]
  state.pageOpenedList.splice(index, 1)
  state.pageOpenedList.splice(1, 0, openedPage)
  sessionStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
}

const SET_OPENED_LIST = (state) => {
  state.pageOpenedList = sessionStorage.pageOpenedList ? JSON.parse(sessionStorage.pageOpenedList) : [{
    name: '欢迎使用',
    path: '/main'
  }]
}

const CLEAR_OPENED_LIST = (state) => {
  state.pageOpenedList = [{
    name: '欢迎使用',
    path: '/main'
  }]
  sessionStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList) // 本地存储已打开页面
}

const SET_CURRENT_TITLE = (state, title) => {
  state.currentTitle = title
}

export default {
  LOGIN_OUT,
  LOGIN_SUCCESS,
  SET_USER_INFO,

  INCREASE_TAG,
  REMOVE_TAG,
  MOVE_TO_SECOND,
  SET_OPENED_LIST,
  CLEAR_OPENED_LIST,
  SET_CURRENT_TITLE
}
