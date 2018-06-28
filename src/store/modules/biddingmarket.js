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

    upstreams: [],
    downstreams: [],
    biddings: [],
    breakoffPaneltyRatio: 1.2,
    breakoffCompensationRatio: 0.5,
    transportationTime: 300,
    transportationStatus: TRANSPORTATION_STATUS.DELIVERING
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

    SET_UPSTREAMS(state, payload) {
      state.upstreams = payload.upstreams
    },
    SET_DOWNSTREAMS(state, payload) {
      state.downstreams = payload.downstreams
    },
    SET_BIDDINGS(state, payload) {
      state.biddings = payload.biddings
    },
    SET_BREAKOFF_PANELTY_RATIO(state, payload) {
      state.breakoffPaneltyRatio = payload.breakoffPaneltyRatio
    },
    SET_BREAKOFF_COMPENSATION_RATIO(state, payload) {
      state.breakoffCompensationRatio = payload.breakoffCompensationRatio
    },
    SET_TRANSPORTATION_TIME(state, payload) {
      state.transportationTime = payload.transportationTime
    },
    SET_TRANSPORTATION_STATUS(state, payload) {
      state.transportationStatus = payload.transportationStatus
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
    },
    SOCKET_BIDDING_CANCELED(state, biddingMarketEvent) {
      if (!checkIdentity(state, biddingMarketEvent)) {
        return
      }
      let id = biddingMarketEvent.item._id
      let iji = state.biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.CANCELED
    },
    SOCKET_BIDDING_SIGNED(state, biddingMarketEvent) {
      if (!checkIdentity(state, biddingMarketEvent)) {
        return
      }
      let id = biddingMarketEvent.item._id
      let signer = biddingMarketEvent.item.signer
      let iji = state.biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.SIGNED
      iji.signer = signer
    },
    SOCKET_BIDDING_BREAKOFF(state, biddingMarketEvent) {
      if (!checkIdentity(state, biddingMarketEvent)) {
        return
      }
      let id = biddingMarketEvent.item._id
      let iji = state.biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.BREAKOFF
    },
    SOCKET_BIDDING_COMPLETED(state, biddingMarketEvent) {
      if (!checkIdentity(state, biddingMarketEvent)) {
        return
      }
      let id = biddingMarketEvent.item._id
      let iji = state.biddings.find(item => item._id === id)
      iji.stage = BIDDING_ITEM_STAGE.COMPLETED
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ENGINE_ID', payload)
        context.commit('SET_NODE_NAME', payload)
        api.biddingmarket
          .getInfo(payload.engineId, payload.nodeName)
          .then(biddingmarket => {
            context.commit('SET_UPSTREAMS', biddingmarket)
            context.commit('SET_DOWNSTREAMS', biddingmarket)
            context.commit('SET_BIDDINGS', biddingmarket)
            context.commit('SET_BREAKOFF_PANELTY_RATIO', biddingmarket)
            context.commit('SET_BREAKOFF_COMPENSATION_RATIO', biddingmarket)
            context.commit('SET_TRANSPORTATION_TIME', biddingmarket)
            context.commit('SET_TRANSPORTATION_STATUS', biddingmarket)

            resolve(biddingmarket)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    release(context, biddingMarketItem) {
      return new Promise((resolve, reject) => {
        api.biddingmarket
          .release(
            context.state.engineId,
            context.state.nodeName,
            biddingMarketItem
          )
          .then(biddingmarket => {
            resolve(biddingmarket)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    cancel(context, biddingStageChange) {
      return new Promise((resolve, reject) => {
        api.biddingmarket
          .cancel(
            context.state.engineId,
            context.state.nodeName,
            biddingStageChange
          )
          .then(biddingmarket => {
            resolve(biddingmarket)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    sign(context, biddingStageChange) {
      return new Promise((resolve, reject) => {
        api.biddingmarket
          .sign(
            context.state.engineId,
            context.state.nodeName,
            biddingStageChange
          )
          .then(biddingmarket => {
            resolve(biddingmarket)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    breakoff(context, biddingStageChange) {
      return new Promise((resolve, reject) => {
        api.biddingmarket
          .breakoff(
            context.state.engineId,
            context.state.nodeName,
            biddingStageChange
          )
          .then(biddingmarket => {
            resolve(biddingmarket)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    deliver(context, biddingStageChange) {
      return new Promise((resolve, reject) => {
        api.biddingmarket
          .deliver(
            context.state.engineId,
            context.state.nodeName,
            biddingStageChange
          )
          .then(biddingmarket => {
            resolve(biddingmarket)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
