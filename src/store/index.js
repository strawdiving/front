import Vue from 'vue'
import Vuex from 'vuex'
import status from './modules/status'
import setValue from './modules/setValue'
import script from './modules/script'
import other from './modules/other'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'
import prog from './modules/prog'
import config from './modules/config'
import users from './modules/users'

import inner from './modules/inner'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        status,
        setValue,
        script,
        other,
        permission,
        user,
        prog,
        config,
        inner,
    },
  getters
})

export default store
