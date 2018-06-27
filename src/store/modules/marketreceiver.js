import api from '@/api'
import {
  ACCOUNT_LEDGER_SIDE,
  INVENTORY_MODE,
  TRANSPORTATION_STATUS,
  BIDDING_ITEM_STAGE
} from '@/lib/schema'

function checkIdentity(state, biddingMarketEvent) {
  if (
    biddingMarketEvent.engineId !== state.engineId ||
    biddingMarketEvent.nodeName !== state.nodeName
  ) {
    console.warn(
      '[Store:BiddingMarket] Different Engine id or node name, current store is',
      state.engineId,
      state.nodeName,
      'but the incoming event is',
      biddingMarketEvent.engineId,
      biddingMarketEvent.nodeName
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
    news: null,

    hasNoCamera: false
  },
  getters: {
    released(state) {
      return state.biddings.filter(b => b.stage === BIDDING_ITEM_STAGE.BIDDING)
    },
    signed(state) {
      return state.biddings.filter(b => b.stage === BIDDING_ITEM_STAGE.SIGNED)
    },
    completed(state) {
      return state.biddings.filter(
        b => b.stage === BIDDING_ITEM_STAGE.COMPLETED
      )
    },
    canceled(state) {
      return state.biddings.filter(b => b.stage === BIDDING_ITEM_STAGE.CANCELED)
    },
    breakoff(state) {
      return state.biddings.filter(b => b.stage === BIDDING_ITEM_STAGE.BREAKOFF)
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

    SOCKET_BIDDING_RELEASED(state, biddingMarketEvent) {
      if (!checkIdentity(state, biddingMarketEvent)) {
        return
      }
      if (
        state.biddings &&
        state.biddings.find(item => item._id === biddingMarketEvent.item._id)
      ) {
        return
      }
      if (!state.biddings) {
        state.biddings = []
      }
      state.biddings.push(biddingMarketEvent.item)
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

            resolve(marketreceiver)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
