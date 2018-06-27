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
      '[Store:AssemblyDepartment] Different Engine id or node name, current store is',
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

    receivers: null,
    bom: null
  },
  mutations: {
    SET_ENGINE_ID(state, payload) {
      state.engineId = payload.engineId
    },
    SET_NODE_NAME(state, payload) {
      state.nodeName = payload.nodeName
    },

    SET_RECEIVERS(state, payload) {
      state.receivers = payload.receivers
    },
    SET_BOM(state, payload) {
      state.bom = payload.bom
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ENGINE_ID', payload)
        context.commit('SET_NODE_NAME', payload)
        api.assemblydepartment
          .getInfo(payload.engineId, payload.nodeName)
          .then(assemblydepartment => {
            context.commit('SET_RECEIVERS', assemblydepartment)
            context.commit('SET_BOM', assemblydepartment)

            resolve(assemblydepartment)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    assemble(context, ioJournalItem) {
      return new Promise((resolve, reject) => {
        api.assemblydepartment
          .assemble(
            context.state.engineId,
            context.state.nodeName,
            ioJournalItem
          )
          .then(assemblydepartment => {
            resolve(assemblydepartment)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
