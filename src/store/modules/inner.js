// 用来内部组件间交互
const state = {
  poseConfirm: false,
  jogShow: false,
}
const mutations = {
  showJog(state, show) {
    state.jogShow = show
  },
  confirmPose(state, on) {
    state.poseConfirm = on
  }
}
const actions = {

}
export default {
  // 使用全局命名空间
  namespaced: false,
  state,
  actions,
  mutations
}
