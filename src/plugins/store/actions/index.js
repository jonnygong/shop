// 异步操作，发 commit 给 mutation
// 登录成功
const login = ({commit}) => {
  commit('LOGIN_SUCCESS')
}
// 设置已登录用户信息
const setUserInfo = ({commit}, data) => {
  commit('SET_USER_INFO', data)
}
// 注销
const loginOut = ({commit}) => {
  // 登出
  commit('LOGIN_OUT')
}

export default {
  login,
  setUserInfo,
  loginOut
}
