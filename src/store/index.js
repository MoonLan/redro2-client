import Vue from 'vue'
import Vuex from 'vuex'
import ui from './modules/ui'
import user from './modules/user'
import engine from './modules/engine'
import account from './modules/account'
import inventory from './modules/inventory'
import io from './modules/io'
import biddingmarket from './modules/biddingmarket'
import biddingmarketreceiver from './modules/biddingmarketreceiver'
import assemblydepartment from './modules/assemblydepartment'
import market from './modules/market'
import marketreceiver from './modules/marketreceiver'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ui,
    user,
    engine,
    account,
    inventory,
    io,
    biddingmarket,
    biddingmarketreceiver,
    assemblydepartment,
    market,
    marketreceiver
  }
})
