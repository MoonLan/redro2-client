import api from '@/api'
import {
  ACCOUNT_LEDGER_SIDE,
  INVENTORY_MODE,
  TRANSPORTATION_STATUS,
  BIDDING_ITEM_STAGE
} from '@/lib/schema'

function checkIdentity(state, biddingMarketEvent) {
  if (biddingMarketEvent.engineId !== state.engineId) {
    console.warn(
      '[Store:BiddingMarketReceiver] Different Engine id, this is',
      state.engineId,
      'but the incoming event is',
      biddingMarketEvent.engineId
    )
    return false
  }

  if (state.upstream.enable && biddingMarketEvent.provider === state.upstream.provider) {
    return 'upstream'
  } else if (state.downstream.enable && biddingMarketEvent.provider === state.downstream.provider) {
    return 'downstream'
  } else {
    console.warn(
      'The incoming event is neither a upstream provider nor downstream provider.',
      'upstream provider:',
      state.upstream.provider,
      'downstream provider:',
      state.downstream.provider,
      'event provider:',
      biddingMarketEvent.provider
    )
    return false
  }
}

export default {
  namespaced: true,
  state: {
    engineId: null,
    nodeName: null,
    upstream: {
      enable: false,
      provider: null,
      biddings: [],
      breakoffPaneltyRatio: 1.2,
      breakoffCompensationRatio: 0.5,
      transportationTime: 300,
      transportationStatus: TRANSPORTATION_STATUS.DELIVERING
    },

    downstream: {
      enable: false,
      provider: null,
      biddings: [],
      breakoffPaneltyRatio: 1.2,
      breakoffCompensationRatio: 0.5,
      transportationTime: 300,
      transportationStatus: TRANSPORTATION_STATUS.DELIVERING
    }
  },
  getters: {},
  mutations: {
    SET_ENGINE_ID(state, payload) {
      state.engineId = payload.engineId
    },
    SET_NODE_NAME(state, payload) {
      state.nodeName = payload.nodeName
    },

    SET_ENABLE_UPSTREAM(state, payload) {
      state.upstream.enable = payload.enableUpstream
    },
    SET_UPSTREAM_PROVIDER(state, payload) {
      state.upstream.provider = payload.upstreamProvider
    },
    SET_UPSTREAM(state, payload) {
      state.upstream.biddings = payload.biddings
      state.upstream.breakoffPaneltyRatio = payload.breakoffPaneltyRatio
      state.upstream.breakoffCompensationRatio = payload.breakoffCompensationRatio
      state.upstream.transportationTime = payload.transportationTime
      state.upstream.transportationStatus = payload.transportationStatus
    },

    SET_ENABLE_DOWNSTREAM(state, payload) {
      state.downstream.enable = payload.enableDownstream
    },
    SET_DOWNSTREAM_PROVIDER(state, payload) {
      state.downstream.provider = payload.downstreamProvider
    },
    SET_DOWNSTREAM(state, payload) {
      state.downstream.biddings = payload.biddings
      state.downstream.breakoffPaneltyRatio = payload.breakoffPaneltyRatio
      state.downstream.breakoffCompensationRatio = payload.breakoffCompensationRatio
      state.downstream.transportationTime = payload.transportationTime
      state.downstream.transportationStatus = payload.transportationStatus
    },

    SOCKET_BIDDING_RELEASED(state, biddingMarketEvent) {
      let identity = checkIdentity(state, biddingMarketEvent)
      if (identity === false) {
        return
      }
      let biddings = identity === 'upstream' ? state.upstream.biddings : state.downstream.biddings
      biddings.push(biddingMarketEvent.item)
    },
    SOCKET_BIDDING_CANCELED(state, biddingMarketEvent) {
      let identity = checkIdentity(state, biddingMarketEvent)
      if (identity === false) {
        return
      }
      let biddings = identity === 'upstream' ? state.upstream.biddings : state.downstream.biddings
      biddings.push(biddingMarketEvent.item)
      let id = biddingMarketEvent.item._id
      let iji = biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.CANCELED
    },
    SOCKET_BIDDING_SIGNED(state, biddingMarketEvent) {
      let identity = checkIdentity(state, biddingMarketEvent)
      if (identity === false) {
        return
      }
      let biddings = identity === 'upstream' ? state.upstream.biddings : state.downstream.biddings
      biddings.push(biddingMarketEvent.item)
      let id = biddingMarketEvent.item._id
      let iji = biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.SIGNED
    },
    SOCKET_BIDDING_BREAKOFF(state, biddingMarketEvent) {
      let identity = checkIdentity(state, biddingMarketEvent)
      if (identity === false) {
        return
      }
      let biddings = identity === 'upstream' ? state.upstream.biddings : state.downstream.biddings
      biddings.push(biddingMarketEvent.item)
      let id = biddingMarketEvent.item._id
      let iji = biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.BREAKOFF
    },
    SOCKET_BIDDING_COMPLETED(state, biddingMarketEvent) {
      let identity = checkIdentity(state, biddingMarketEvent)
      if (identity === false) {
        return
      }
      let biddings = identity === 'upstream' ? state.upstream.biddings : state.downstream.biddings
      biddings.push(biddingMarketEvent.item)
      let id = biddingMarketEvent.item._id
      let iji = biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.COMPLETED
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ENGINE_ID', payload)
        context.commit('SET_NODE_NAME', payload)
        api.biddingmarketreciver
          .getInfo(payload.engineId, payload.nodeName)
          .then(io => {
            context.commit('SET_ENABLE_IMPORT', io)
            context.commit('SET_IMPORT_JOURNAL', io)
            context.commit('SET_AVAILABLE_IMPORT_GOODS', io)
            context.commit('SET_HAS_IMPORT_LIMIT', io)
            context.commit('SET_REJECT_NOT_AVAILABLE_IMPORT_GOODS', io)
            context.commit('SET_ENABLE_EXPORT', io)
            context.commit('SET_EXPORT_JOURNAL', io)
            context.commit('SET_AVAILABLE_EXPORT_GOODS', io)
            context.commit('SET_HAS_EXPORT_LIMIT', io)
            context.commit('SET_REJECT_NOT_AVAILABLE_EXPORT_GOODS', io)
            context.commit('SET_TRANSPORTATION_COST', io)
            context.commit('SET_BATCH_SIZE', io)
            resolve(io)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    realease(context, payload) {}
  }
}
