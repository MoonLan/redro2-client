import api from '@/api'
import { ACCOUNT_LEDGER_SIDE, INVENTORY_MODE, TRANSPORTATION_STATUS } from '@/lib/schema'

export default {
  namespaced: true,
  state: {
    engineId: null,
    nodeName: null,

    enableImport: true,
    importJournal: [],
    availableImportGoods: [],
    hasImportLimit: false,
    rejectNotAvailableImportGoods: true,

    enableExport: true,
    exportJournal: [],
    availableExportGoods: [],
    hasExportLimit: false,
    rejectNotAvailableExportGoods: true,

    transportationCost: 100,
    batchSize: 4
  },
  getters: {},
  mutations: {
    SET_ENGINE_ID(state, payload) {
      state.engineId = payload.engineId
    },
    SET_NODE_NAME(state, payload) {
      state.nodeName = payload.nodeName
    },

    SET_ENABLE_IMPORT(state, payload) {
      state.enableImport = payload.enableImport
    },
    SET_IMPORT_JOURNAL(state, payload) {
      state.importJournal = payload.importJournal
    },
    SET_AVAILABLE_IMPORT_GOODS(state, payload) {
      state.availableImportGoods = payload.availableImportGoods
    },
    SET_HAS_IMPORT_LIMIT(state, payload) {
      state.hasImportLimit = payload.hasImportLimit
    },
    SET_REJECT_NOT_AVAILABLE_IMPORT_GOODS(state, payload) {
      state.rejectNotAvailableImportGoods = payload.rejectNotAvailableImportGoods
    },

    SET_ENABLE_EXPORT(state, payload) {
      state.enableExport = payload.enableExport
    },
    SET_EXPORT_JOURNAL(state, payload) {
      state.exportJournal = payload.exportJournal
    },
    SET_AVAILABLE_EXPORT_GOODS(state, payload) {
      state.availableExportGoods = payload.availableExportGoods
    },
    SET_HAS_EXPORT_LIMIT(state, payload) {
      state.hasExportLimit = payload.hasExportLimit
    },
    SET_REJECT_NOT_AVAILABLE_EXPORT_GOODS(state, payload) {
      state.rejectNotAvailableExportGoods = payload.rejectNotAvailableExportGoods
    },

    SET_TRANSPORTATION_COST(state, payload) {
      state.transportationCost = payload.transportationCost
    },
    SET_BATCH_SIZE(state, payload) {
      state.batchSize = payload.batchSize
    },

    SOCKET_IO_IMPORT(state, ioEvent) {
      if (ioEvent.engineId !== state.engineId || ioEvent.nodeName !== state.nodeName) {
        console.warn(
          'Different Engine id or node name, this is',
          state.engineId,
          state.nodeName,
          'but the incoming event is',
          ioEvent.engineId,
          ioEvent.nodeName
        )
        return
      }
      let ioJournalItem = ioEvent.ioJournalItem
      state.importJournal.push(ioJournalItem)
    },
    SOCKET_IO_EXPORT(state, ioEvent) {
      if (ioEvent.engineId !== state.engineId || ioEvent.nodeName !== state.nodeName) {
        console.warn(
          'Different Engine id or node name, this is',
          state.engineId,
          state.nodeName,
          'but the incoming event is',
          ioEvent.engineId,
          ioEvent.nodeName
        )
        return
      }
      let ioJournalItem = ioEvent.ioJournalItem
      state.exportJournal.push(ioJournalItem)
    },
    SOCKET_IO_IMPORT_COMPLETE(state, ioEvent) {
      if (ioEvent.engineId !== state.engineId || ioEvent.nodeName !== state.nodeName) {
        console.warn(
          'Different Engine id or node name, this is',
          state.engineId,
          state.nodeName,
          'but the incoming event is',
          ioEvent.engineId,
          ioEvent.nodeName
        )
        return
      }
      let id = ioEvent.ioJournalItem._id
      let iji = state.importJournal.find(iji => iji._id === id)
      iji.transportationStatus = TRANSPORTATION_STATUS.COMPLETED
    },
    SOCKET_IO_EXPORT_COMPLETE(state, ioEvent) {
      if (ioEvent.engineId !== state.engineId || ioEvent.nodeName !== state.nodeName) {
        console.warn(
          'Different Engine id or node name, this is',
          state.engineId,
          state.nodeName,
          'but the incoming event is',
          ioEvent.engineId,
          ioEvent.nodeName
        )
        return
      }
      let id = ioEvent.ioJournalItem._id
      let iji = state.exportJournal.find(iji => iji._id === id)
      iji.transportationStatus = TRANSPORTATION_STATUS.COMPLETED
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ENGINE_ID', payload)
        context.commit('SET_NODE_NAME', payload)
        api.io
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
    import(context, ioJournalItem) {
      return new Promise((resolve, reject) => {
        api.io
          .importIO(context.state.engineId, context.state.nodeName, ioJournalItem)
          .then(io => {
            resolve(io)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    export(context, ioJournalItem) {
      return new Promise((resolve, reject) => {
        api.io
          .exportIO(context.state.engineId, context.state.nodeName, ioJournalItem)
          .then(io => {
            resolve(io)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
