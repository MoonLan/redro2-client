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
      state.id = payload._id
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
    },
    hasLogin(state) {
      return !!state.name
    }
  },
  actions: {
    userRegist(context, payload) {
      return new Promise((resolve, reject) => {
        api.server
          .userRegist(payload.name)
          .then(user => {
            resolve(user)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    userLoginByMagicCode(context, payload) {
      return new Promise((resolve, reject) => {
        api.server
          .userLoginByMagicCode(payload.magiccode)
          .then(user => {
            context.commit('SET_ID', user)
            context.commit('SET_NAME', user)
            context.commit('SET_LEVEL', user)
            resolve(user)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    addUserRole(context, payload) {
      return new Promise((resolve, reject) => {
        if (context.getters.isStaffOrAdmin) {
          resolve()
          return
        }
        api.server
          .addUserRole(
            context.state.id,
            payload.engineId,
            payload.teamIndex,
            payload.role
          )
          .then(user => {
            resolve(user)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    userLogout(context, payload) {
      return new Promise((resolve, reject) => {
        api.server
          .userLogout()
          .then(() => {
            context.commit('SET_ID', {})
            context.commit('SET_NAME', {})
            context.commit('SET_LEVEL', {})
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    checkUser(context) {
      return new Promise((resolve, reject) => {
        api.server
          .checkUser()
          .then(user => {
            context.commit('SET_ID', user || {})
            context.commit('SET_NAME', user || {})
            context.commit('SET_LEVEL', user || {})
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
