<template>
  <v-content class="console-game-info">
    <v-container>
      <v-layout wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">遊戲資訊</h3>
                <h4>{{id}}</h4>
              </div>
            </v-card-title>
            <v-tabs v-model="active">
              <v-tab key="overview" ripple>總覽</v-tab>
              <v-tab-item key="overview">
                <v-card flat>
                  <v-card-text>
                    <v-layout wrap class="labeled-list">
                      <v-flex xs6 md4>
                        <span class="label">名稱</span>
                        CONSTRUCTED
                      </v-flex>
                      <v-flex xs12 md8>
                        <span class="label">ID</span>
                        {{id}}
                      </v-flex>
                      <v-flex xs12 md12>
                        <span class="label">簡介</span>
                        {{id}}
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">階段</span>
                        CONSTRUCTED
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">登入人數</span>
                        CONSTRUCTED
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">遊戲時間</span>
                        CONSTRUCTED
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">遊戲天數</span>
                        CONSTRUCTED
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">上下班</span>
                        CONSTRUCTED
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab key="control" ripple>控制</v-tab>
              <v-tab-item key="control">
                <v-card flat>
                  <v-card-text>
                    <v-layout wrap class="labeled-list">
                      <v-flex xs6 md4>
                        <span class="label">階段</span>
                        CONSTRUCTED
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">登入人數</span>
                        CONSTRUCTED
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">遊戲時間</span>
                        CONSTRUCTED
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">遊戲天數</span>
                        CONSTRUCTED
                      </v-flex>
                      <v-flex xs6 md4>
                        <span class="label">上下班</span>
                        CONSTRUCTED
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat>清除</v-btn>
              <v-btn flat>創建</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import api from '@/api'
import { TEAMS, NODES } from './engine.config'

export default {
  data: () => ({
    id: null,
    active: null
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
    this.$socket.emit('client_load_engine_id', { id: this.id })
    this.$store.dispatch('engine/loadId', { id: this.id })
  }
}
</script>

<style lang="scss">
.labeled-list {
  .flex {
    padding-bottom: 5px;
  }
  font-size: 14px;
  color: #000;

  .label {
    display: block;
    font-size: 10px;
    color: #666;
  }
}
</style>
