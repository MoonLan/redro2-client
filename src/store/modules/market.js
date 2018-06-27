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
    engineId: null,
    nodeName: null,

    upstreams: null,
    news: null,
    needs: null
  },
  getters: {
    currentMarketCarPrice(state) {
      if (!state.news || state.news.length === 0) {
        return 0
      }
      return state.news[state.news.length - 1].marketNeeds[0].unitPrice
    },
    currentMarketCarNeeds(state) {
      if (!state.news || state.news.length === 0) {
        return 0
      }
      return state.news[state.news.length - 1].marketNeeds[0].unit
    },
    currentMarketCarLeftDemand(state) {
      if (!state.needs || state.needs.length === 0) {
        return 0
      }
      return state.needs[0].unit
    }
  },
  mutations: {
    SET_ENGINE_ID(state, payload) {
      state.engineId = payload.engineId
    },
    SET_NODE_NAME(state, payload) {
      state.nodeName = payload.nodeName
    },

    SET_UPSTREAMS(state, payload) {
      state.upstreams = payload.upstreams
    },
    SET_NEWS(state, payload) {
      state.news = payload.news
    },
    SET_NEEDS(state, payload) {
      state.needs = payload.needs
    },

    SOCKET_MARKET_NEWS_PUBLISHED(state, marketEvent) {
      if (!checkIdentity(state, marketEvent)) {
        return
      }
      state.news = marketEvent.news
      state.needs = marketEvent.needs
    },
    SOCKET_MARKET_NEEDS_CHANGE(state, marketEvent) {
      if (!checkIdentity(state, marketEvent)) {
        return
      }
      state.needs = marketEvent.needs
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ENGINE_ID', payload)
        context.commit('SET_NODE_NAME', payload)
        api.market
          .getInfo(payload.engineId, payload.nodeName)
          .then(market => {
            context.commit('SET_UPSTREAMS', market)
            context.commit('SET_NEWS', market)
            context.commit('SET_NEEDS', market)

            resolve(market)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    buy(context, marketJournalItem) {
      return new Promise((resolve, reject) => {
        api.market
          .buy(
            context.state.engineId,
            context.state.nodeName,
            marketJournalItem
          )
          .then(market => {
            resolve(market)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
