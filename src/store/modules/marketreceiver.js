import api from '@/api'
import {
  ACCOUNT_LEDGER_SIDE,
  INVENTORY_MODE,
  TRANSPORTATION_STATUS,
  BIDDING_ITEM_STAGE
} from '@/lib/schema'

function checkIdentity(state, marketReceiverEvent) {
  if (
    marketReceiverEvent.engineId !== state.engineId ||
    marketReceiverEvent.provider !== state.provider
  ) {
    console.warn(
      '[Store:MarketReceiver] Different Engine id or node name, current store is',
      state.engineId,
      state.provider,
      'but the incoming event is',
      marketReceiverEvent.engineId,
      marketReceiverEvent.provider
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

    provider: null,
    news: null
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
    }
  },
  mutations: {
    SET_ENGINE_ID(state, payload) {
      state.engineId = payload.engineId
    },
    SET_NODE_NAME(state, payload) {
      state.nodeName = payload.nodeName
    },

    SET_PROVIDER(state, payload) {
      state.provider = payload.provider
    },
    SET_NEWS(state, payload) {
      state.news = payload.news
    },

    SOCKET_MARKET_NEWS_PUBLISHED(state, marketEvent) {
      if (!checkIdentity(state, marketEvent)) {
        return
      }
      this.$notification.notify(`新的新聞發布了！`)
      state.news = marketEvent.news
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ENGINE_ID', payload)
        context.commit('SET_NODE_NAME', payload)
        api.marketreceiver
          .getInfo(payload.engineId, payload.nodeName)
          .then(marketreceiver => {
            context.commit('SET_PROVIDER', marketreceiver)
            context.commit('SET_NEWS', marketreceiver)

            resolve(marketreceiver)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
