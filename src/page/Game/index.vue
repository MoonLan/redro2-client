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
        {{readableGameTime}}
      </div>
    </v-toolbar>
    <v-content class="fill-height">
      <v-container fluid
                   class="bg-wrapper">
        <marquee>Some Beautiful Background Image!!</marquee>
      </v-container>
      <node-control-panel />
    </v-content>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import { ROOM_EVENTS } from '@/lib/schema'
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
      'stage'
    ]),
    ...mapGetters('engine', [
      'gameTimeAdd',
      'toReadableGameTime',
      'readableGameTime'
    ])
  },
  watch: {
    stage(newVal) {
      if (newVal === 'END') {
        console.log('go to end page!')
      }
    }
  },
  mounted() {
    this.engineId = this.$route.params.id
    this.teamIndex = this.$route.params.teamIndex
    this.role = this.$route.params.role

    reconnect()
    this.$store.dispatch('engine/load', { id: this.engineId }).then(() => {
      this.$socket.emit(ROOM_EVENTS.ROOM_JOIN, {
        engineId: this.engineId,
        teamIndex: this.teamIndex,
        role: this.role
      })
      console.log('socket:ROOM_JOIN')
    })
  },
  beforeDestroy() {
    this.$socket.emit(ROOM_EVENTS.ROOM_JOIN, {
      engineId: this.engineId,
      teamIndex: this.teamIndex,
      role: this.role
    })
    console.log('socket:ROOM_LEAVE')
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
