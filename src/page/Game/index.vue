<template>
  <v-container pa-0
               fluid
               class="game">
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp"
               color="blue darken-3"
               dark
               app
               fixed>
      <v-toolbar-title class="ml-0 pl-3">
        <span>#{{teamIndex}} {{$t('role.' + (role ? role.split('-')[0] : ''))}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="mr-3">
        <span v-if="!$store.getters['user/isStaffOrAdmin']">{{cashBalance}}</span>
        {{readableGameTime}}
      </div>
    </v-toolbar>
    <v-content class="fill-height">
      <v-container fluid
                   class="bg-wrapper">
        PING {{latency || '-'}}MS
      </v-container>
      <node-control-panel />
    </v-content>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import { ROOM_EVENTS, USER_LEVEL, ENGINE_STAGE } from '@/lib/schema'
import { reconnect } from '@/lib/socket'
import NodeControlPanel from './NodeControlPanel'

export default {
  components: {
    NodeControlPanel
  },
  data: () => ({
    engineId: null,
    teamIndex: null,
    role: null
  }),
  computed: {
    ...mapState('engine', [
      'name',
      'describe',
      'gameDays',
      'dayLength',
      'stage',
      'latency'
    ]),
    ...mapGetters('engine', [
      'gameTimeAdd',
      'toReadableGameTime',
      'readableGameTime',
      'isWorking'
    ]),
    ...mapGetters('user', ['hasLogin', 'isStaffOrAdmin']),
    ...mapState('user', ['level']),
    cashBalance() {
      let cash = this.$store.getters['account/getBalance']('Cash')
      return cash > 0 ? `$${cash}` : '破產'
    }
  },
  watch: {
    stage(newVal) {
      if (newVal === ENGINE_STAGE.END) {
        console.log('go to end page!')
        this.$router.replace(`/game/end/${this.engineId}`)
      }
    },
    isWorking(newVal) {
      this.$store.commit('ui/SET_DARK', { dark: !newVal })
    }
  },
  mounted() {
    this.engineId = this.$route.params.id
    this.teamIndex = this.$route.params.teamIndex
    this.role = this.$route.params.role

    let after = () => {
      if (!this.hasLogin || (this.teamIndex === 0 && !this.isStaffOrAdmin)) {
        this.$router.push(
          `/player/login/${this.engineId}/${this.teamIndex}/${this.role}`
        )
        return
      }

      reconnect()
      this.$store.dispatch('engine/load', { id: this.engineId }).then(() => {
        this.$socket.emit(ROOM_EVENTS.ROOM_JOIN, {
          engineId: this.engineId,
          teamIndex: this.teamIndex,
          role: this.role
        })
        console.log('socket:ROOM_JOIN')

        if (this.stage === ENGINE_STAGE.END) {
          console.log('go to end page!')
          this.$router.replace(`/game/end/${this.engineId}`)
        }

        this.$store.commit('ui/SET_DARK', { dark: !this.isWorking })
      })
    }

    if (!this.hasLogin) {
      this.$store.dispatch('user/checkUser').then(() => {
        after()
      })
    } else {
      after()
    }
  },
  beforeDestroy() {
    this.$socket.emit(ROOM_EVENTS.ROOM_JOIN, {
      engineId: this.engineId,
      teamIndex: this.teamIndex,
      role: this.role
    })
    console.log('socket:ROOM_LEAVE')

    this.$store.commit('ui/SET_DARK', { dark: false })
  },
  beforeRouteLeave(to, from, next) {
    if (this.stage === ENGINE_STAGE.END) {
      next()
      return
    }
    this.$store
      .dispatch('ui/openRequestDialog', {
        title: '你確定要離開這場遊戲嗎？',
        text: '以防你按錯，所以問一下'
      })
      .then(answer => {
        if (answer) {
          next()
        } else {
          next(false)
        }
      })
  }
}
</script>

<style lang="scss">
.game {
  .bg-wrapper {
    height: 20vh;
  }
}
</style>
