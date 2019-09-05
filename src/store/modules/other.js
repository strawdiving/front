import Cookies from 'js-cookie'

const state = {
    language: Cookies.get('language') || 'zh',
    limitPos: [180, 110 ,180, 180, 180, 180, 180],
    // 0: base; 1: tool; 2: user
    coordType: 0,
    wall: {
        h1: {
            enable: false,
            dist: 0,
        },
        h2: {
            enable: false,
            dist: 0,
        },
        v1: {
            enable: false,
            dist: 0,
            angle: 0
        },
        v2: {
            enable: false,
            dist: 0,
            angle: 0
        },
        v3: {
            enable: false,
            dist: 0,
            angle: 0
        },
        v4: {
            enable: false,
            dist: 0,
            angle: 0
        },
    }
}

const mutations = {
    changeLanguage(state) {
        if (state.language === 'en') {
            state.language = 'zh'
        } else if (state.language === 'zh') {
            state.language = 'en'
        }
        Cookies.set('language', state.language)
    },

    updateLimitPos(state, val) {
        for (let i = 0; i < 7; i++) {
            state.limitPos[i] = val[i];
        }
    },
    updateCoordType(state, val) {
        state.coordType = val
    },
    updateWall(state, val) {
        function deepCopy(newobj, obj) {
            if (typeof obj != 'object') {
                return
            }
            for (var attr in obj) {
                if (typeof attr != 'object') {
                    newobj[attr] = obj[attr]
                } else {
                    deepCopy(newobj[attr], obj[attr])
                }
    
            }
        }
        deepCopy(state.wall, val)
    }
}

const actions = {

}

export default {
    namespaced: false,
    state,
    actions,
    mutations
}
