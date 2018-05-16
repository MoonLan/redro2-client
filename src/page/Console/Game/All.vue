<template>
  <v-content class="console-game-all">
    <v-container>
      <v-layout wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">所有遊戲</h3>
              </div>
            </v-card-title>
            <v-list three-line>
              <v-divider></v-divider>
              <template v-for="(item, key) in list">
                <v-list-tile :key="key" @click="" :to="'/console/game/' + item.id">
                  <v-list-tile-content>
                    <v-list-tile-title>
                      <span class="blue--text pr-1">{{item.stage}}</span>{{item.name}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{item.describe}}</v-list-tile-sub-title>
                    <v-list-tile-sub-title>{{item.id}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-avatar>
                    <v-icon>keyboard_arrow_right</v-icon>
                  </v-list-tile-avatar>
                </v-list-tile>
                <v-divider :key="key + '-divider'"></v-divider>
              </template>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="$router.push('/console/creategame')" flat>創建</v-btn>
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
    list: []
  }),
  methods: {},
  mounted() {
    api.server.getEnginesList().then(list => {
      this.list = list
    })
  }
}
</script>

<style lang="scss">
</style>
