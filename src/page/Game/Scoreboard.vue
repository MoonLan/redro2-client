<template>
  <v-container pa-0
               fluid
               fill-height
               class="game-scoreboard">
    <v-layout>
      <v-flex v-if="['CONSTRUCTED', 'PREPARE', 'READY'].includes(stage)"
              xs12>
        <v-layout class="text-xs-center">
          <v-flex xs4>
            <v-layout wrap>
              <v-flex v-for="(team, index) in usersForEachTeam.slice(0, 4)"
                      :key="index"
                      style="border: 1px solid #ccc; font-size: 20px; height: 50vh;"
                      xs6>
                <v-container>
                  <v-subheader style="display: block;  font-size: 30px;">第 {{index + 1}} 組</v-subheader>
                  <div v-for="(user) in team.ComponentsFactory"
                       xs12
                       class="lime--text text--darken-3"
                       :key="user._id">
                    {{user.name}}
                  </div>
                  <div v-for="(user) in team.AssemblyFactory"
                       xs12
                       class="teal--text text--darken-2"
                       :key="user._id">
                    {{user.name}}
                  </div>
                  <div v-for="(user) in team.Retailer"
                       xs12
                       class="purple--text text--darken-2"
                       :key="user._id">
                    {{user.name}}
                  </div>
                </v-container>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs4>
            <v-container style="margin-top: 20vh; max-height: 60vh; overflow: hidden; ">
              <v-subheader style="display: block; font-size: 20px;">新登入玩家</v-subheader>
              <div v-for="(user, index) in newComingUsers"
                   xs12
                   :key="user._id"
                   :class="index === 0 ? `red--text` : ''"
                   :style="`height: ${toFontSize(index + 1) * 1.5}px; font-size: ${toFontSize(index + 1)}px;`">
                {{user.name}}</div>
            </v-container>
          </v-flex>
          <v-flex xs4>
            <v-layout wrap>
              <v-flex v-for="(team, index) in usersForEachTeam.slice(5, 8)"
                      :key="index"
                      style="border: 1px solid #ccc; font-size: 20px; height: 50vh;"
                      xs6>
                <v-container>
                  <v-subheader style="display: block;  font-size: 30px;">第 {{index + 1}} 組</v-subheader>
                  <div v-for="(user) in team.ComponentsFactory"
                       xs12
                       class="lime--text text--darken-3"
                       :key="user._id">
                    {{user.name}}
                  </div>
                  <div v-for="(user) in team.AssemblyFactory"
                       xs12
                       class="teal--text text--darken-2"
                       :key="user._id">
                    {{user.name}}
                  </div>
                  <div v-for="(user) in team.Retailer"
                       xs12
                       class="purple--text text--darken-2"
                       :key="user._id">
                    {{user.name}}
                  </div>
                </v-container>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex v-if="['START', 'FINAL'].includes(stage)"
              xs12>
        <v-layout column
                  class="text-xs-center">
          <v-flex fill-height
                  style="height: 40vh;">
            <v-layout>
              <v-flex xs12
                      fill-height
                      justify-center>
                <v-container text-xs-center
                             fill-height
                             justify-center>
                  <v-card class="transparent elevation-0">
                    <v-card-text>
                      <v-layout column>
                        <v-flex class="mb-3">
                          <v-progress-circular :value="(1 - gameTime.time / dayLength) * 100"
                                               :rotate="270"
                                               :size="168"
                                               :width="16"></v-progress-circular>
                        </v-flex>
                        <v-flex style="font-size: 24px;">
                          {{readableGameTime}}
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-container>
              </v-flex>
              <!--
              <v-flex xs7
                      justify-center>
                Some Gragh
              </v-flex> -->
            </v-layout>
          </v-flex>
          <v-flex fill-height
                  style="height: 60vh;">
            <v-layout>
              <v-flex v-for="role in ['ComponentsFactory', 'AssemblyFactory', 'Retailer']"
                      :key="role"
                      justify-center
                      fill-height
                      xs4>
                <v-container text-xs-center
                             fill-height
                             justify-center>
                  <v-card class="transparent elevation-0">
                    <v-card-title class="d-block headline">{{$t(`role.${role}`)}}</v-card-title>
                    <v-card-text>
                      <div v-for="(rank, index) in cashBalanceRankingSet[role].slice(0, 3)"
                           :key="rank.name"
                           :style="index === 0 ? `font-size: 30px !important; line-height: 45px !important;` : ''"
                           class="d-block headline">
                        <span class="grey--text">#{{index + 1}}</span>
                        第 {{rank.name.split('-')[1]}} 組 ${{rank.cashBalance}}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-container>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <audio src="/static/sound/begin.mp3"
           id="sound-begin"
           class="audio d-none"></audio>
    <audio src="/static/sound/break.mp3"
           id="sound-break"
           class="audio d-none"></audio>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import { ROOM_EVENTS, USER_LEVEL, ENGINE_STAGE } from '@/lib/schema'

export default {
  data: () => ({
    engineId: null,
    teamIndex: null,
    role: null,

    engine: null,
    _stage: null,
    _isWorking: null
  }),
  computed: {
    ...mapState('scoreboard', [
      'users',
      'gameTime',
      'stage',
      'playerTeams',
      'dayLength',
      'accounts'
    ]),
    ...mapGetters('scoreboard', ['readableGameTime', 'isWorking']),
    belongingUsers() {
      if (!this.engineId || !this.users) {
        return
      }

      return this.users.filter(
        user =>
          user.permissions.find(per => per.engineId === this.engineId) !==
          undefined
      )
    },
    newComingUsers() {
      if (!this.belongingUsers) {
        return
      }

      return this.belongingUsers.slice().reverse()
    },
    usersForEachTeam() {
      if (!this.playerTeams || !this.belongingUsers) {
        return
      }
      let list = []
      for (let i = 0; i < this.playerTeams.length; i++) {
        list.push({
          ComponentsFactory: [],
          AssemblyFactory: [],
          Retailer: []
        })
      }
      for (let user of this.belongingUsers) {
        let per = user.permissions.find(p => p.engineId === this.engineId)
        if (
          !list[parseInt(per.teamIndex) - 1] ||
          !list[parseInt(per.teamIndex) - 1][per.role.split('-')[0]]
        ) {
          return
        }
        list[parseInt(per.teamIndex) - 1][per.role.split('-')[0]].push(user)
      }
      return list
    },
    cashBalanceRankingSet() {
      if (!this.playerTeams || !this.accounts) {
        return
      }
      let set = {
        ComponentsFactory: [],
        AssemblyFactory: [],
        Retailer: []
      }
      for (let account of this.accounts) {
        let role = account.name.split('-')[0]
        set[role].push(account)
      }
      let sorting = (a, b) => b.cashBalance - a.cashBalance
      set.ComponentsFactory.sort(sorting)
      set.AssemblyFactory.sort(sorting)
      set.Retailer.sort(sorting)
      return set
    }
  },
  watch: {
    isWorking(newVal) {
      if (newVal === this._isWorking) {
        return
      }
      this._isWorking = newVal
      if (newVal === true) {
        this.playBeginSound()
      } else {
        this.playBreakSound()
      }
    }
  },
  methods: {
    toFontSize(index) {
      if (index > 5) {
        return 20
      }
      return 70 / Math.pow(index, 0.7)
    },
    playBeginSound() {
      document.getElementById('sound-begin').play()
      document.getElementById('sound-break').pause()
      document.getElementById('sound-break').currentTime = 0
    },
    playBreakSound() {
      document.getElementById('sound-break').play()
      document.getElementById('sound-begin').pause()
      document.getElementById('sound-begin').currentTime = 0
    }
  },
  mounted() {
    this.engineId = this.$route.params.id

    this.$store
      .dispatch('scoreboard/load', {
        engineId: this.engineId
      })
      .then(() => {
        this.$socket.emit(ROOM_EVENTS.ROOM_JOIN, {
          engineId: this.engineId,
          teamIndex: 0,
          role: 'Scoreboard'
        })
        console.log('[Socket] ROOM_JOIN')
      })
  },
  beforeDestroy() {
    this.$socket.emit(ROOM_EVENTS.ROOM_LEAVE, {
      engineId: this.engineId,
      teamIndex: 0,
      role: 'Scoreboard'
    })
    console.log('[Socket] ROOM_JOIN')
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
