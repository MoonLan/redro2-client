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
    storage: [],
    storageCost: [],
    hasStorageCost: true,
    batchSize: 1,
    mode: INVENTORY_MODE.PERPETUAL
  },
  getters: {},
  mutations: {
    SET_ENGINE_ID(state, payload) {
      state.engineId = payload.engineId
    },
    SET_NODE_NAME(state, payload) {
      state.nodeName = payload.nodeName
    },
    SET_STORAGE(state, payload) {
      state.storage = payload.storage
    },
    SET_STORAGE_COST(state, payload) {
      state.storageCost = payload.storageCost
    },
    SET_HAS_STORAGE_COST(state, payload) {
      state.hasStorageCost = payload.hasStorageCost
    },
    SET_BATCH_SIZE(state, payload) {
      state.batchSize = payload.batchSize
    },
    SET_MODE(state, payload) {
      state.mode = payload.mode
    },
    SOCKET_INVENTORY_IMPORT(state, inventoryEvent) {
      let stocksItemList = inventoryEvent.ioJournalItem.list
      for (let stocksItem of stocksItemList) {
        let good = stocksItem.good
        if (!stocksItem.left) {
          stocksItem.left = stocksItem.unit
        }
        let it = state.storage.find(item => item.good === good)
        if (it === undefined) {
          state.storage.push({
            good: good,
            unit: 0,
            stocks: []
          })
          it = state.storage[state.storage.length - 1]
        }
        it.unit += parseInt(stocksItem.left)
        it.stocks.push(stocksItem)
      }
    },
    SOCKET_INVENTORY_EXPORT(state, inventoryEvent) {
      if (!checkIdentity(state, inventoryEvent)) {
        return
      }
      let stocksItemList = inventoryEvent.ioJournalItem.list
      for (let stocksItem of stocksItemList) {
        let good = stocksItem.good
        let it = state.storage.find(item => item.good === good)
        it.unit -= parseInt(stocksItem.unit)

        let left = stocksItem.unit
        for (
          let idx = it.stocks.findIndex(item => item.left > 0);
          idx >= 0 && idx < it.stocks.length;
          idx++
        ) {
          let lit = it.stocks[idx]
          if (left > lit.left) {
            left -= parseInt(lit.left)
            lit.left = 0
          } else {
            lit.left -= parseInt(left)
            left = 0
            break
          }
        }
      }
    },
    SOCKET_INVENTORY_COUNT_STORAGE_COST(state, inventoryEvent) {
      if (!checkIdentity(state, inventoryEvent)) {
        return
      }
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ENGINE_ID', payload)
        context.commit('SET_NODE_NAME', payload)
        api.inventory
          .getInfo(payload.engineId, payload.nodeName)
          .then(inventory => {
            context.commit('SET_STORAGE', inventory)
            context.commit('SET_STORAGE_COST', inventory)
            context.commit('SET_HAS_STORAGE_COST', inventory)
            context.commit('SET_BATCH_SIZE', inventory)
            context.commit('SET_MODE', inventory)
            resolve(inventory)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    import(context, ioJournalItem) {
      return new Promise((resolve, reject) => {
        api.inventory
          .importInventory(
            context.state.engineId,
            context.state.nodeName,
            ioJournalItem
          )
          .then(inventory => {
            resolve(inventory)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    export(context, ioJournalItem) {
      return new Promise((resolve, reject) => {
        api.inventory
          .exportInventory(
            context.state.engineId,
            context.state.nodeName,
            ioJournalItem
          )
          .then(inventory => {
            resolve(inventory)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    regist(context, stocksItemList) {
      return new Promise((resolve, reject) => {
        api.inventory
          .regist(
            context.state.engineId,
            context.state.nodeName,
            stocksItemList
          )
          .then(inventory => {
            resolve(inventory)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
