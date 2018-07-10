import api from '@/api'
import {
  ACCOUNT_LEDGER_SIDE,
  INVENTORY_MODE,
  TRANSPORTATION_STATUS,
  BIDDING_ITEM_STAGE
} from '@/lib/schema'

function checkIdentity(state, marketEvent) {
  if (
    marketEvent.engineId !== state.engineId ||
    marketEvent.nodeName !== state.nodeName
  ) {
    console.warn(
      '[Store:Market] Different Engine id or node name, current store is',
      state.engineId,
      state.nodeName,
      'but the incoming event is',
      marketEvent.engineId,
      marketEvent.nodeName
    )
    return false
  }
  return true
}

export default {
  namespaced: true,
  state: {
    users: null,

    engineId: null,
    name: null,
    describe: null,
    nodes: [],
    stage: null,
    time: 0,
    gameTime: { day: 0, time: 0, isWorking: false },
    gameDays: 3,
    dayLength: 3,
    playerTeams: null,
    staffTeams: null,

    accounts: null,
    biddingMarkets: null
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
    isWorking(state) {
      return state.gameTime.isWorking
    }
  },
  mutations: {
    SET_USERS(state, payload) {
      state.users = payload.users
    },

    SET_ENGINE_ID(state, payload) {
      state.engineId = payload.engineId
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
    SET_ACCOUNTS(state, payload) {
      state.accounts = payload.accounts
    },
    SET_BIDDING_MARKETS(state, payload) {
      state.biddingMarkets = payload.biddingMarkets
    },
    SET_GAME_STAGE(state, payload) {
      state.stage = payload.stage
    },
    SET_GAME_TIME(state, payload) {
      state.gameTime.day = payload.gameTime.day
      state.gameTime.time = payload.gameTime.time
      state.gameTime.isWorking = payload.gameTime.isWorking
    },
    SET_PLAYER_TEAMS(state, payload) {
      state.playerTeams = payload.playerTeams
    },
    SET_STAFF_TEAMS(state, payload) {
      state.staffTeams = payload.staffTeams
    },

    SOCKET_GAME_STAGE_CHANGE(state, engineEvent) {
      if (engineEvent.id !== state.engineId) {
        console.warn('Different Engine id,', state.engineId, engineEvent.id)
        return
      }

      state.stage = engineEvent.stage
    },
    SOCKET_GAME_TIME_CHANGE(state, engineEvent) {
      if (engineEvent.id !== state.engineId) {
        console.warn('Different Engine id,', state.engineId, engineEvent.id)
        return
      }

      state.gameTime.day = engineEvent.gameTime.day
      state.gameTime.time = engineEvent.gameTime.time
      state.gameTime.isWorking = engineEvent.gameTime.isWorking
    },

    SOCKET_ACCOUNT_ADD(state, accountEvent) {
      if (accountEvent.engineId !== state.engineId) {
        console.warn(
          'Different Engine id,',
          state.engineId,
          accountEvent.engineId
        )
        return
      }

      let transaction = accountEvent.transaction

      for (let side of [
        ACCOUNT_LEDGER_SIDE.DEBIT,
        ACCOUNT_LEDGER_SIDE.CREDIT
      ]) {
        for (let item of transaction[side] || []) {
          if (item.classification === 'Cash') {
            let account = state.accounts.find(
              item => item.name === accountEvent.nodeName
            )
            account.cashBalance =
              side === ACCOUNT_LEDGER_SIDE.DEBIT
                ? parseFloat(account.cashBalance) + parseFloat(item.amount)
                : parseFloat(account.cashBalance) - parseFloat(item.amount)
          }
        }
      }
    },

    SOCKET_SERVER_USER_PERMISSION_CHANGE(state, serverEvent) {
      let user = state.users.find(user => user._id === serverEvent.user._id)
      if (!user) {
        state.users.push(serverEvent.user)
        return
      }
      user.permissions = serverEvent.permissions
      user.level = serverEvent.level
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ENGINE_ID', { engineId: payload.engineId })
        api.scoreboard.getInfo(payload.engineId).then(scoreboard => {
          context.commit('SET_USERS', scoreboard)
          context.commit('SET_NAME', scoreboard)
          context.commit('SET_DESCRIBE', scoreboard)
          context.commit('SET_NODES', scoreboard)
          context.commit('SET_GAME_DAYS', scoreboard)
          context.commit('SET_DAY_LENGTH', scoreboard)
          context.commit('SET_GAME_STAGE', scoreboard)
          context.commit('SET_GAME_TIME', scoreboard)
          context.commit('SET_PLAYER_TEAMS', scoreboard)
          context.commit('SET_STAFF_TEAMS', scoreboard)
          context.commit('SET_ACCOUNTS', scoreboard)
          context.commit('SET_BIDDING_MARKETS', scoreboard)
          resolve(scoreboard)
        })
      })
    }
  }
}
