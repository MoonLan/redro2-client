import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketio from 'vue-socket.io'
import store from '@/store'

const socket = io('http://localhost')
Vue.use(VueSocketio, socket, store)

export default socket
