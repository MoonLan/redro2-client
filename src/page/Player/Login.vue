<template>
  <v-container class="player-login fill-height">
    <v-layout wrap  justify-center align-center>
      <v-flex xs12 sm6 md4 lg3 xl2>
        <v-form v-model="valid" ref="form">
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">登入</h3>
              </div>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="name" label="Name" required :rules="requiredRule"></v-text-field>
              <v-text-field v-model="password" label="Password" type="password" required :rules="requiredRule"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="clear" flat>清除</v-btn>
              <v-btn @click="submit" flat>登入</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '@/api'

export default {
  data: () => ({
    valid: null,
    name: null,
    password: null,
    requiredRule: [v => !!v || '必需項']
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
    clear() {
      this.$refs.form.reset()
    }
  },
  mounted() {}
}
</script>

<style lang="scss">
</style>
