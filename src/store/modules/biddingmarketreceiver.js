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

  if (
    state.upstream.enable &&
    biddingMarketEvent.provider === state.upstream.provider
  ) {
    return 'upstream'
  } else if (
    state.downstream.enable &&
    biddingMarketEvent.provider === state.downstream.provider
  ) {
    return 'downstream'
  } else {
    console.warn(
      '[Store:BiddingMarketReceiver] The incoming event is neither a upstream provider nor downstream provider.',
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
      name: null,
      biddings: [],
      breakoffPaneltyRatio: 1.2,
      breakoffCompensationRatio: 0.5,
      transportationTime: 300,
      transportationStatus: TRANSPORTATION_STATUS.DELIVERING
    },

    downstream: {
      enable: false,
      provider: null,
      name: null,
      biddings: [],
      breakoffPaneltyRatio: 1.2,
      breakoffCompensationRatio: 0.5,
      transportationTime: 300,
      transportationStatus: TRANSPORTATION_STATUS.DELIVERING
    }
  },
  getters: {
    upstreamReleased(state) {
      return state.upstream.biddings.filter(b => b.stage === 'BIDDING')
    },
    upstreamSelfReleased(state) {
      return state.upstream.biddings.filter(
        b =>
          b.stage === 'BIDDING' &&
          (b.publisher === state.nodeName || b.signer === state.nodeName)
      )
    },
    upstreamSelfSigned(state) {
      return state.upstream.biddings.filter(
        b =>
          b.stage === 'SIGNED' &&
          (b.publisher === state.nodeName || b.signer === state.nodeName)
      )
    },
    upstreamSelfCompleted(state) {
      return state.upstream.biddings.filter(
        b =>
          b.stage === 'COMPLETED' &&
          (b.publisher === state.nodeName || b.signer === state.nodeName)
      )
    },
    downstreamReleased(state) {
      return state.downstream.biddings.filter(b => b.stage === 'BIDDING')
    },
    downstreamSelfReleased(state) {
      return state.downstream.biddings.filter(
        b =>
          b.stage === 'BIDDING' &&
          (b.publisher === state.nodeName || b.signer === state.nodeName)
      )
    },
    downstreamSelfSigned(state) {
      return state.downstream.biddings.filter(
        b =>
          b.stage === 'SIGNED' &&
          (b.publisher === state.nodeName || b.signer === state.nodeName)
      )
    },
    downstreamSelfCompleted(state) {
      return state.downstream.biddings.filter(
        b =>
          b.stage === 'COMPLETED' &&
          (b.publisher === state.nodeName || b.signer === state.nodeName)
      )
    }
  },
  mutations: {
    SET_ENGINE_ID(state, payload) {
      state.engineId = payload.engineId
    },
    SET_NODE_NAME(state, payload) {
      state.nodeName = payload.nodeName
    },

    SET_ENABLE_UPSTREAM(state, payload) {
      state.upstream.enable = payload.enable
    },
    SET_UPSTREAM_PROVIDER(state, payload) {
      state.upstream.provider = payload.provider
    },
    SET_UPSTREAM_NAME(state, payload) {
      state.upstream.name = payload.name
    },
    SET_UPSTREAM(state, payload) {
      state.upstream.enable = payload.upstream.enable
      state.upstream.provider = payload.upstream.provider
      state.upstream.name = payload.upstream.name
      state.upstream.biddings = payload.upstream.biddings
      state.upstream.breakoffPaneltyRatio =
        payload.upstream.breakoffPaneltyRatio
      state.upstream.breakoffCompensationRatio =
        payload.upstream.breakoffCompensationRatio
      state.upstream.transportationTime = payload.upstream.transportationTime
      state.upstream.transportationStatus =
        payload.upstream.transportationStatus
    },

    SET_ENABLE_DOWNSTREAM(state, payload) {
      state.downstream.enable = payload.enable
    },
    SET_DOWNSTREAM_PROVIDER(state, payload) {
      state.downstream.provider = payload.provider
    },
    SET_DOWNSTREAM_NAME(state, payload) {
      state.downstream.name = payload.name
    },
    SET_DOWNSTREAM(state, payload) {
      state.downstream.enable = payload.downstream.enable
      state.downstream.provider = payload.downstream.provider
      state.downstream.name = payload.downstream.name
      state.downstream.biddings = payload.downstream.biddings
      state.downstream.breakoffPaneltyRatio =
        payload.downstream.breakoffPaneltyRatio
      state.downstream.breakoffCompensationRatio =
        payload.downstream.breakoffCompensationRatio
      state.downstream.transportationTime =
        payload.downstream.transportationTime
      state.downstream.transportationStatus =
        payload.downstream.transportationStatus
    },

    SOCKET_BIDDING_RELEASED(state, biddingMarketEvent) {
      let identity = checkIdentity(state, biddingMarketEvent)
      if (identity === false) {
        return
      }
      let biddings =
        identity === 'upstream'
          ? state.upstream.biddings
          : state.downstream.biddings
      if (biddings.find(item => item._id === biddingMarketEvent.item._id)) {
        return
      }
      biddings.push(biddingMarketEvent.item)
    },
    SOCKET_BIDDING_CANCELED(state, biddingMarketEvent) {
      let identity = checkIdentity(state, biddingMarketEvent)
      if (identity === false) {
        return
      }
      let biddings =
        identity === 'upstream'
          ? state.upstream.biddings
          : state.downstream.biddings
      let id = biddingMarketEvent.item._id
      let iji = biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.CANCELED
    },
    SOCKET_BIDDING_SIGNED(state, biddingMarketEvent) {
      let identity = checkIdentity(state, biddingMarketEvent)
      if (identity === false) {
        return
      }
      let biddings =
        identity === 'upstream'
          ? state.upstream.biddings
          : state.downstream.biddings
      let id = biddingMarketEvent.item._id
      let signer = biddingMarketEvent.item.signer
      let iji = biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.SIGNED
      iji.signer = signer
    },
    SOCKET_BIDDING_BREAKOFF(state, biddingMarketEvent) {
      let identity = checkIdentity(state, biddingMarketEvent)
      if (identity === false) {
        return
      }
      let biddings =
        identity === 'upstream'
          ? state.upstream.biddings
          : state.downstream.biddings
      let id = biddingMarketEvent.item._id
      let iji = biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.BREAKOFF
    },
    SOCKET_BIDDING_COMPLETED(state, biddingMarketEvent) {
      let identity = checkIdentity(state, biddingMarketEvent)
      if (identity === false) {
        return
      }
      let biddings =
        identity === 'upstream'
          ? state.upstream.biddings
          : state.downstream.biddings
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
        api.biddingmarketreceiver
          .getInfo(payload.engineId, payload.nodeName)
          .then(biddingMarketReciver => {
            if (biddingMarketReciver.upstream.enable) {
              context.commit('SET_UPSTREAM', biddingMarketReciver)
            } else {
              context.commit('SET_ENABLE_UPSTREAM', { enable: false })
            }

            if (biddingMarketReciver.downstream.enable) {
              context.commit('SET_DOWNSTREAM', biddingMarketReciver)
            } else {
              context.commit('SET_ENABLE_DOWNSTREAM', { enable: false })
            }

            resolve(biddingMarketReciver)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    releaseToUpstream(context, biddingMarketItem) {
      return new Promise((resolve, reject) => {
        api.biddingmarketreceiver
          .releaseToUpstream(
            context.state.engineId,
            context.state.nodeName,
            biddingMarketItem
          )
          .then(biddingmarketreceiver => {
            resolve(biddingmarketreceiver)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    cancelToUpstream(context, biddingStageChange) {
      return new Promise((resolve, reject) => {
        api.biddingmarketreceiver
          .cancelToUpstream(
            context.state.engineId,
            context.state.nodeName,
            biddingStageChange
          )
          .then(biddingmarketreceiver => {
            resolve(biddingmarketreceiver)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    signToUpstream(context, biddingStageChange) {
      return new Promise((resolve, reject) => {
        api.biddingmarketreceiver
          .signToUpstream(
            context.state.engineId,
            context.state.nodeName,
            biddingStageChange
          )
          .then(biddingmarketreceiver => {
            resolve(biddingmarketreceiver)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    breakoffToUpstream(context, biddingStageChange) {
      return new Promise((resolve, reject) => {
        api.biddingmarketreceiver
          .breakoffToUpstream(
            context.state.engineId,
            context.state.nodeName,
            biddingStageChange
          )
          .then(biddingmarketreceiver => {
            resolve(biddingmarketreceiver)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    releaseToDownstream(context, biddingMarketItem) {
      return new Promise((resolve, reject) => {
        api.biddingmarketreceiver
          .releaseToDownstream(
            context.state.engineId,
            context.state.nodeName,
            biddingMarketItem
          )
          .then(biddingmarketreceiver => {
            resolve(biddingmarketreceiver)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    cancelToDownstream(context, biddingStageChange) {
      return new Promise((resolve, reject) => {
        api.biddingmarketreceiver
          .cancelToDownstream(
            context.state.engineId,
            context.state.nodeName,
            biddingStageChange
          )
          .then(biddingmarketreceiver => {
            resolve(biddingmarketreceiver)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    signToDownstream(context, biddingStageChange) {
      return new Promise((resolve, reject) => {
        api.biddingmarketreceiver
          .signToDownstream(
            context.state.engineId,
            context.state.nodeName,
            biddingStageChange
          )
          .then(biddingmarketreceiver => {
            resolve(biddingmarketreceiver)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    breakoffToDownstream(context, biddingStageChange) {
      return new Promise((resolve, reject) => {
        api.biddingmarketreceiver
          .breakoffToDownstream(
            context.state.engineId,
            context.state.nodeName,
            biddingStageChange
          )
          .then(biddingmarketreceiver => {
            resolve(biddingmarketreceiver)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
