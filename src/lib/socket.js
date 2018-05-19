import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketio from 'vue-socket.io'
import store from '@/store'

const SERVER = 'http://localhost'

let socket = io(SERVER, { multiplex: false })
Vue.use(VueSocketio, socket, store)

export function reconnect() {
  socket.close()
  socket.connect()
}

export default socket
