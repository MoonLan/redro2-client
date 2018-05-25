import api from '@/api'
import { ACCOUNT_LEDGER_SIDE } from '@/lib/schema'

function checkIdentity(state, accountEvent) {
  if (accountEvent.engineId !== state.engineId || accountEvent.nodeName !== state.nodeName) {
    console.warn(
      '[Store:Account] Different Engine id or node name, current store is',
      state.engineId,
      state.nodeName,
      'but the incoming event is',
      accountEvent.engineId,
      accountEvent.nodeName
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
    isBankrupt: null,
    journal: [],
    ledger: [],
    initialCash: null
  },
  getters: {
    cashAmount(state) {
      let ledger = state.ledger.find(ledger => ledger.classification === 'Cash')
      if (ledger === undefined) {
        return 0
      }
      return ledger.balance
    },
    getBalance(state) {
      return classification => {
        let ledger = state.ledger.find(ledger => ledger.classification === classification)
        if (ledger === undefined) {
          return 0
        }
        return ledger.balance
      }
    }
  },
  mutations: {
    SET_ENGINE_ID(state, payload) {
      state.engineId = payload.engineId
    },
    SET_NODE_NAME(state, payload) {
      state.nodeName = payload.nodeName
    },
    SET_JOURNAL(state, payload) {
      state.journal = payload.journal
    },
    SET_LEDGER(state, payload) {
      state.ledger = payload.ledger
    },
    SET_INITIAL_CASH(state, payload) {
      state.initialCash = payload.initialCash
    },
    SOCKET_ACCOUNT_ADD(state, accountEvent) {
      if (!checkIdentity(state, accountEvent)) {
        return
      }
      let transaction = accountEvent.transaction
      state.journal.push(transaction)

      for (let side of [ACCOUNT_LEDGER_SIDE.DEBIT, ACCOUNT_LEDGER_SIDE.CREDIT]) {
        for (let item of transaction[side] || []) {
          let ledgerItem = {
            amount: item.amount,
            classification: item.classification,
            side: side,
            counterObject: item.counterObject,
            memo: transaction.memo,
            time: transaction.time,
            gameTime: transaction.gameTime
          }

          let ledger = state.ledger.find(
            ledger => ledger.classification === ledgerItem.classification
          )
          if (ledger === undefined) {
            state.ledger.push({
              classification: ledgerItem.classification,
              items: [],
              balance: 0
            })
            ledger = state.ledger[state.ledger.length - 1]
          }

          ledger.items.push(ledgerItem)
          ledger.balance +=
            ledgerItem.side === ACCOUNT_LEDGER_SIDE.DEBIT
              ? parseFloat(ledgerItem.amount)
              : parseFloat(-ledgerItem.amount)
        }
      }
    },
    SOCKET_ACCOUNT_BANKRUPT(state, accountEvent) {
      if (!checkIdentity(state, accountEvent)) {
        return
      }
      state.isBankrupt = accountEvent.isBankrupt
    }
  },
  actions: {
    load(context, payload) {
      return new Promise((resolve, reject) => {
        context.commit('SET_ENGINE_ID', payload)
        context.commit('SET_NODE_NAME', payload)
        api.account
          .getInfo(payload.engineId, payload.nodeName)
          .then(account => {
            context.commit('SET_JOURNAL', account)
            context.commit('SET_LEDGER', account)
            context.commit('SOCKET_ACCOUNT_BANKRUPT', account)
            resolve(account)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    add(context, accountTransaction) {
      return new Promise((resolve, reject) => {
        api.account
          .add(context.state.engineId, context.state.nodeName, accountTransaction)
          .then(account => {
            resolve(account)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
