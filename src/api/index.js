import axios from 'axios'
import store from '@/store'
import { htmlEncode } from '@/lib/utils'
import * as server from './server'
import * as engine from './engine'
import * as account from './account'
import * as inventory from './inventory'
import * as io from './io'
import * as biddingmarket from './biddingmarket'
import * as biddingmarketreceiver from './biddingmarketreceiver'
import * as assemblydepartment from './assemblydepartment'
import * as inventoryregister from './inventoryregister'
import * as market from './market'
import * as marketreceiver from './marketreceiver'
import * as scoreboard from './scoreboard'

export default {
  server: server,
  engine: engine,
  account: account,
  inventory: inventory,
  io: io,
  biddingmarket: biddingmarket,
  biddingmarketreceiver: biddingmarketreceiver,
  assemblydepartment: assemblydepartment,
  inventoryregister: inventoryregister,
  market: market,
  marketreceiver: marketreceiver,
  scoreboard: scoreboard
}

export const SERVER_BASE = 'http://localhost' // 'https://redro2.2018ieemcamp.me'

export function legalRequest(apiPath, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(SERVER_BASE + apiPath, data, {
        // https://div.io/topic/1825
        withCredentials: true
      })
      .then(res => {
        if (res.data.error || res.data.err) {
          store.commit('ui/OPEN_ERROR_DIALOG', res.data)
          reject(res.data)
          return
        }
        resolve(res.data)
      })
      .catch(function(err) {
        store.commit('ui/OPEN_ERROR_DIALOG', err)
        reject(err)
      })
  })
}
