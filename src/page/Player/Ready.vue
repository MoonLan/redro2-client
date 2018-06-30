<template>
  <v-container class="player-ready fill-height">
    <v-layout wrap
              justify-center
              align-center>
      <v-flex xs12
              md10
              xl6>
        <v-card class="elevation-0 transparent text-xs-center">
          <v-card-text>
            <h3 class="headline mb-0 text-xs-center">你正準備進入 {{name}}</h3>
          </v-card-text>
          <v-card-text>
            {{name}}共有{{gameDays}}天，每天{{dayLength}}秒。你現在是第{{teamIndex}}組的{{role}}。
          </v-card-text>
          <v-progress-circular indeterminate></v-progress-circular>
          <v-card-text>
            {{describe}}
          </v-card-text>
          <v-btn :to="'/'"
                 flat
                 outline>取消</v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import { ROOM_EVENTS } from '@/lib/schema'
import { reconnect } from '@/lib/socket'

export default {
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
    ...mapGetters('user', ['hasLogin', 'isStaffOrAdmin']),
    ...mapState('user', [])
  },
  watch: {
    stage(newVal) {
      if (newVal === 'START' || newVal === 'FINAL') {
        console.log('go to game page!')
        this.$router.replace(
          `/game/${this.engineId}/${this.teamIndex}/${this.role}`
        )
      } else if (newVal === 'END') {
        console.log('go to end page!')
      }
    }
  },
  mounted() {
    this.engineId = this.$route.params.id
    this.teamIndex = this.$route.params.teamIndex
    this.role = this.$route.params.role

    if (!this.engineId) {
      this.$router.push('/player')
    }

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
      })

      if (this.stage === 'START' || this.stage === 'FINAL') {
        console.log('go to game page!')
        this.$router.replace(
          `/game/${this.engineId}/${this.teamIndex}/${this.role}`
        )
      } else if (this.stage === 'END') {
        console.log('go to end page!')
      }
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
  }
}
</script>

<style lang="scss">
</style>
