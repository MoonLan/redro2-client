import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketio from 'vue-socket.io'
import store from '@/store'
import { SERVER_BASE } from '@/api'

let socket = io(SERVER_BASE, { multiplex: false })
Vue.use(VueSocketio, socket, store)

socket.on('pong', latency => {
  console.log(latency)
  store.commit('engine/SET_LATENCY', { latency: latency })
})

export function reconnect() {
  socket.close()
  socket.connect()
}

export default socket
