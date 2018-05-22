import api from '@/api'
import { USER_LEVEL } from '@/lib/schema'

export default {
  namespaced: true,
  state: {
    id: null,
    name: null,
    level: USER_LEVEL.GUEST
  },
  mutations: {
    SET_ID(state, payload) {
      state.id = payload.id
    },
    SET_NAME(state, payload) {
      state.name = payload.name
    },
    SET_LEVEL(state, payload) {
      state.level = payload.level
    }
  },
  getters: {
    isStaffOrAdmin(state) {
      return [USER_LEVEL.STAFF, USER_LEVEL.ADMIN].includes(state.level)
    }
  },
  actions: {
    userLogin(context, payload) {
      return new Promise((resolve, reject) => {
        api.server.userLogin(payload.name, payload.password).then(user => {
          context.commit('SET_ID', user)
          context.commit('SET_NAME', user)
          context.commit('SET_LEVEL', user)
          resolve(user)
        })
      })
    }
  }
}
