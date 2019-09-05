
const getters = {
  language: state => state.other.language,
  token: state => state.user.token,
  roles: state => state.user.roles,
  addRouters: state => state.permission.addRouters,
  permission_routers: state=> state.permission.routers
}

export default getters
