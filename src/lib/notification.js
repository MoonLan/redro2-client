import Vue from 'vue'
import Vuex from 'vuex'
import store from '@/store'

class NotificationWrapper {
  constructor(options) {
    this.support = false
    this.granted = false
    this.backgroundOnly = (options && options.backgroundOnly) || true

    if (!('Notification' in window)) {
      console.error(
        '[Notification]',
        'This browser does not support system notifications.'
      )
    } else {
      this.support = true
      this.granted = Notification.permission === 'granted'
      console.log(
        '[Notification]',
        'Permission has set to',
        this.granted,
        'as default.'
      )
    }
  }

  requestPermission() {
    if (this.support && !this.granted) {
      Notification.requestPermission().then(permission => {
        console.log(
          '[Notification]',
          'User has',
          permission,
          'the system notifications.'
        )
        this.granted = permission === 'granted'
      })
    }
  }

  notify(title, options) {
    if (
      this.support &&
      this.granted &&
      (!this.backgroundOnly || document.hasFocus())
    ) {
      let tmpNotification = new Notification(title, options)
    }

    store.commit('ui/OPEN_SNACKBAR', {
      snackbarText: title
    })
  }
}

const $notification = new NotificationWrapper()

Vue.prototype.$notification = $notification
Vuex.Store.prototype.$notification = $notification

export default $notification
