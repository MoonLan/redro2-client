import api from '@/api'

function checkIdentity(state, engineEvent) {
  if (engineEvent.id !== state.id) {
    console.warn(
      '[Store:Engine] Different Engine id,',
      state.id,
      'but the incoming event is',
      engineEvent.id
    )
    return false
  }
  return true
}

export default {
  namespaced: true,
  state: {
    id: '',
    name: '',
    describe: '',
    nodes: [],
    stage: '',
    time: 0,
    gameTime: { day: 0, time: 0, isWorking: false },
    gameDays: 3,
    dayLength: 3,
    permissions: []
  },
  getters: {
    readableGameTime(state, getters) {
      return `第${state.gameTime.day}天 ${
        state.gameTime.isWorking ? getters.readableGameTimeTime : '下班'
      }`
    },
    readableGameTimeTime(state) {
      let time = state.gameTime.time
      let sec = time % 60
      let min = parseInt(time / 60)
      return `${min}:${sec > 9 ? sec : '0' + sec}`
    },
    toReadableGameTime(state, getters) {
      return gameTime => {
        return `第${gameTime.day}天 ${
          gameTime.isWorking ? getters.toReadableGameTimeTime(gameTime) : '下班'
        }`
      }
    },
    toReadableGameTimeTime(state) {
      return gameTime => {
        let time = gameTime.time
        let sec = time % 60
        let min = parseInt(time / 60)
        return `${min}:${sec > 9 ? sec : '0' + sec}`
      }
    },
    gameTimeAdd(state) {
      return (gameTime, diff) => {
        if (typeof gameTime === 'number') {
          diff = gameTime
          gameTime = state.gameTime
        }

        let gameDays = state.gameDays
        let dayLength = state.dayLength

        let day = gameTime.day + parseInt((gameTime.time + diff) / dayLength)
        let time = (gameTime.time + diff) % dayLength

        if (day > gameDays || time > dayLength) {
          return { day: gameDays, time: dayLength, isWorking: false }
        } else {
          return { day: day, time: time, isWorking: true }
        }
      }
    }
  },
  mutations: {
    SET_ID(state, payload) {
      state.id = payload.id
    },
    SET_NAME(state, payload) {
      state.name = payload.name
    },
    SET_DESCRIBE(state, payload) {
      state.describe = payload.describe
    },
    SET_NODES(state, payload) {
      state.nodes = payload.nodes
    },
    SET_GAME_DAYS(state, payload) {
      state.gameDays = payload.gameDays
    },
    SET_DAY_LENGTH(state, payload) {
      state.dayLength = payload.dayLength
    },
    SET_PERMISSIONS(state, payload) {
      state.permissions = payload.permissions
    },
    SOCKET_GAME_STAGE_CHANGE(state, engineEvent) {
      if (engineEvent.id !== state.id) {
        console.warn('Different Engine id,', state.id, engineEvent.id)
        return
      }

      state.stage = engineEvent.stage
    },
    SOCKET_GAME_TIME_CHANGE(state, engineEvent) {
      if (engineEvent.id !== state.id) {
        console.warn('Different Engine id,', state.id, engineEvent.id)
        return
      }

      state.gameTime = engineEvent.gameTime
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ID', { id: payload.id })
        api.engine.getInfo(payload.id).then(engine => {
          context.commit('SET_NAME', engine)
          context.commit('SET_DESCRIBE', engine)
          context.commit('SET_NODES', engine)
          context.commit('SET_GAME_DAYS', engine)
          context.commit('SET_DAY_LENGTH', engine)
          context.commit('SET_PERMISSIONS', engine)
          context.commit('SOCKET_GAME_STAGE_CHANGE', engine)
          context.commit('SOCKET_GAME_TIME_CHANGE', engine)
          resolve(engine)
        })
      })
    },
    nextStage(context, payload) {
      return new Promise((resolve, reject) => {
        api.engine
          .nextStage(context.state.id)
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    nextDay(context, payload) {
      return new Promise((resolve, reject) => {
        api.engine
          .nextDay(context.state.id)
          .then(data => {
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
