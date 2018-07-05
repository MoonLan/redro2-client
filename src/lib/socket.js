import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketio from 'vue-socket.io'
import store from '@/store'
import { SERVER_BASE } from '@/api'

let socket = io(SERVER_BASE, { multiplex: false })
Vue.use(VueSocketio, socket, store)

socket.on('pong', latency => {
  store.commit('engine/SET_LATENCY', { latency: latency })
})

socket.on('disconnect', reason => {
  console.error(reason)
  switch (reason) {
    case 'io client disconnect':
      break

    default:
      store.commit('ui/OPEN_DIALOG', {
        title: '您斷線了',
        text: '請試著重新連線。'
      })
      break
  }
})

export function reconnect() {
  socket.close()
  socket.connect()
}

export default socket
