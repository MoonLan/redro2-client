<template>
  <v-content class="console-game-create">
    <v-container>
      <v-layout wrap>
        <v-flex xs12>
          <v-form v-model="valid" ref="form">
            <v-card>
              <v-card-title primary-title>
                <v-btn icon @click="$router.go(-1)">
                  <v-icon>arrow_back</v-icon>
                </v-btn>
                <h3 class="headline mb-0">創建新遊戲</h3>
              </v-card-title>
              <v-card-text>
                <v-text-field v-model="name" label="Name" required :rules="requiredRule"></v-text-field>
                <v-text-field v-model="describe" label="Describe"></v-text-field>
                <v-text-field v-model="gameDays" label="GameDays" type="number" required :rules="requiredRule"></v-text-field>
                <v-text-field v-model="dayLength" label="DayLength" type="number" required :rules="requiredRule"></v-text-field>
                <v-text-field v-model="nodes" label="Nodes" required :rules="requiredRule" multi-line></v-text-field>
                <v-text-field v-model="permissions" label="Permissions" required :rules="requiredRule" multi-line></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="clear" flat>清除</v-btn>
                <v-btn @click="submit" flat>創建</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import api from '@/api'
import { PERMISSIONS, NODES } from './engine.config'

export default {
  data: () => ({
    valid: null,
    name: 'UnknownEngineName',
    describe: 'Just a Game!',
    gameDays: 3,
    dayLength: 300,
    nodes: '',
    permissions: '',
    requiredRule: [v => !!v || '必需項']
  }),
  methods: {
    submit() {
      if (this.valid) {
        this.$store.commit('ui/START_LOADING')
        api.server
          .createGame({
            name: this.name,
            describe: this.describe,
            gameDays: this.gameDays,
            dayLength: this.dayLength,
            nodes: JSON.parse(this.nodes),
            permissions: JSON.parse(this.permissions)
          })
          .then(engine => {
            this.$store.commit('ui/STOP_LOADING')
            this.$router.push(`/console/game/${engine.id}`)
          })
          .catch(err => {
            this.$store.commit('ui/STOP_LOADING')
            console.error(err)
          })
      }
    },
    clear() {
      this.$refs.form.reset()
    }
  },
  mounted() {
    this.nodes = JSON.stringify(NODES)
    this.permissions = JSON.stringify(PERMISSIONS)
  }
}
</script>

<style lang="scss">
</style>
