import api from '@/api'

export default {
  namespaced: true,
  state: {
    id: '',
    name: '',
    describe: '',
    nodes: '',
    stage: '',
    time: '',
    gameTime: { day: 0, time: 0, isWorking: false },
    gameDays: 3,
    dayLength: 3,
    hasTeams: true,
    teams: []
  },
  mutations: {
    SET_ID(state, payload) {
      state.id = payload.id
    },
    SET_NAME(state, payload) {
      state.name = payload.name
    }
  },
  actions: {
    loadId(context, payload) {
      return new Promise((resolve, reject) => {})
    }
  }
}
