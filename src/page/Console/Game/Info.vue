<template>
  <v-content class="console-game-info">
    <v-container>
      <v-layout wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <v-layout wrap>
                <v-flex xs12>
                  <h3 class="headline mb-0">
                    {{$store.state.engine.name}} 遊戲資訊
                  </h3>
                </v-flex>
                <v-flex xs12 sm9>
                  <h4>{{id}}</h4>
                </v-flex>
                <v-flex xs12 sm3 text-xs-right>
                  {{$store.state.engine.stage}} {{$store.getters[ 'engine/readableGameTime']}}
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-tabs v-model="active">
              <v-tab key="overview" ripple>總覽</v-tab>
              <v-tab-item key="overview">
                <v-card flat>
                  <v-card-text>
                    <v-layout wrap class="labeled-list">
                      <v-flex xs6 md4>
                        <span class="label">名稱</span>
                        {{$store.state.engine.name}}
                      </v-flex>
                      <v-flex xs12 md8>
                        <span class="label">ID</span>
                        {{$store.state.engine.id}}
                      </v-flex>
                      <v-flex xs12 md12>
                        <span class="label">簡介</span>
                        {{$store.state.engine.describe}}
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">階段</span>
                        {{$store.state.engine.stage}}
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">遊戲天數</span>
                        {{$store.state.engine.gameDays}}天
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">每日長度</span>
                        {{$store.state.engine.dayLength}}秒
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">當前時間</span>
                        {{$store.getters['engine/readableGameTime']}}
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">登入人數</span>
                        CONSTRUCTED
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab key="engine" ripple>引擎</v-tab>
              <v-tab-item key="engine">
                <v-card flat>
                  <v-card-text>
                    <v-layout wrap class="labeled-list">
                      <v-flex xs6 md3>
                        <span class="label">階段</span>
                        {{$store.state.engine.stage}}
                      </v-flex>
                      <v-flex xs6 md3>
                        <span class="label">當前時間</span>
                        {{$store.getters['engine/readableGameTime']}}
                      </v-flex>
                      <v-flex xs6 md3>
                        <span class="label">遊戲天數</span>
                        {{$store.state.engine.gameDays}}天
                      </v-flex>
                      <v-flex xs6 md3>
                        <span class="label">每日長度</span>
                        {{$store.state.engine.dayLength}}秒
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
                <v-divider></v-divider>
                <v-card flat>
                  <v-card-text>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-btn @click="$store.dispatch('engine/nextStage')" :disabled="$store.state.engine.gameTime.day !== $store.state.engine.dayLength && $store.state.engine.gameTime.isWorking === true" outline>下一階段</v-btn>
                        <v-btn @click="$store.dispatch('engine/nextDay')" :disabled="$store.state.engine.stage !== 'START' || $store.state.engine.gameTime.isWorking === true" outline>下一天</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab key="control" ripple>控制</v-tab>
              <v-tab-item key="control">
                <v-card flat>
                  <v-card-text>
                    <v-layout>
                      <v-flex xs4>
                        <v-list>
                          <v-list-tile v-for="node in $store.state.engine.nodes" :key="node.name" :to="`/console/game/${id}/${0}/${node.name}`">
                            {{node.name}}
                          </v-list-tile>
                        </v-list>
                      </v-flex>
                      <v-flex xs8>
                        <router-view />
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
            <v-card-actions>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import api from '@/api'
import { ROOM_EVENTS } from '@/lib/schema'
import { TEAMS, NODES } from './engine.config'
import NodeControlPanel from '@/page/Game/NodeControlPanel'
import { reconnect } from '@/lib/socket'

export default {
  components: {
    NodeControlPanel
  },
  data: () => ({
    id: null,
    active: null,
    teamIndex: null,
    nodeName: null
  }),
  methods: {
    submit() {
      this.$store.commit('ui/START_LOADING')
      if (this.valid) {
        api.server
          .createGame({
            name: this.name,
            describe: this.describe,
            gameDays: this.gameDays,
            dayLength: this.dayLength,
            nodes: JSON.parse(this.nodes),
            teams: JSON.parse(this.teams)
          })
          .then(data => {
            this.$store.commit('ui/STOP_LOADING')
            console.log(data)
          })
          .catch(err => {
            this.$store.commit('ui/STOP_LOADING')
            console.error(err)
          })
      }
    },
    nextStage() {},
    nextDay() {},
    addPlayer() {}
  },
  mounted() {
    this.id = this.$route.params.id

    reconnect()
    this.$store.dispatch('engine/load', { id: this.id }).then(() => {
      this.$socket.emit(ROOM_EVENTS.ROOM_JOIN, { engineId: this.id, teamIndex: 0, role: 'Console' })
      console.log('socket:ROOM_JOIN')
    })
  },
  beforeDestroy() {
    this.$socket.emit(ROOM_EVENTS.ROOM_LEAVE, { engineId: this.id, teamIndex: 0, role: 'Console' })
    console.log('socket:ROOM_LEAVE')
  }
}
</script>

<style lang="scss">
</style>
