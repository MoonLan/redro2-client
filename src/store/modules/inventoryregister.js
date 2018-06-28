import api from '@/api'
import { ACCOUNT_LEDGER_SIDE, INVENTORY_MODE } from '@/lib/schema'

function checkIdentity(state, inventoryEvent) {
  if (
    inventoryEvent.engineId !== state.engineId ||
    inventoryEvent.nodeName !== state.nodeName
  ) {
    console.warn(
      '[Store:Inventory] Different Engine id or node name, current store is',
      state.engineId,
      state.nodeName,
      'but the incoming event is',
      inventoryEvent.engineId,
      inventoryEvent.nodeName
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
    journal: null
  },
  getters: {},
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
    SET_JOURNAL(state, payload) {
      state.journal = payload.journal
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ENGINE_ID', payload)
        context.commit('SET_NODE_NAME', payload)
        api.inventoryregister
          .getInfo(payload.engineId, payload.nodeName)
          .then(inventoryregister => {
            context.commit('SET_RECEIVERS', inventoryregister)
            context.commit('SET_JOURNAL', inventoryregister)
            resolve(inventoryregister)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    regist(context, ioJournalItem) {
      return new Promise((resolve, reject) => {
        api.inventoryregister
          .regist(context.state.engineId, context.state.nodeName, ioJournalItem)
          .then(inventoryregister => {
            resolve(inventoryregister)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
