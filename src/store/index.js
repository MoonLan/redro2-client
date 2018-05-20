import Vue from 'vue'
import Vuex from 'vuex'
import ui from './modules/ui'
import user from './modules/user'
import game from './modules/game'
import engine from './modules/engine'
import account from './modules/account'
import inventory from './modules/inventory'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ui,
    user,
    game,
    account,
    inventory,
    engine
  }
})
