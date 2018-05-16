<template>
  <v-content class="console-game-info">
    <v-container>
      <v-layout wrap>
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">遊戲資訊</h3>
              </div>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="name" label="Name" required :rules="requiredRule"></v-text-field>
              <v-text-field v-model="describe" label="Describe"></v-text-field>
              <v-text-field v-model="gameDays" label="GameDays" type="number" required :rules="requiredRule"></v-text-field>
              <v-text-field v-model="dayLength" label="DayLength" type="number" required :rules="requiredRule"></v-text-field>
              <v-text-field v-model="nodes" label="Nodes" required :rules="requiredRule" multi-line></v-text-field>
              <v-text-field v-model="teams" label="Teams" required :rules="requiredRule" multi-line></v-text-field>

            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="clear" flat>清除</v-btn>
              <v-btn @click="submit" flat>創建</v-btn>
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
    id: null
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
    addPlayer() {},
  },
  mounted() {
    this.id = this.$route.params.id
  }
}
</script>

<style lang="scss">
</style>
