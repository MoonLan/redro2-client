<template>
  <v-container pa-0
               class="player-login fill-height">
    <v-layout wrap
              justify-center
              align-center>
      <v-flex xs12
              sm6
              md4
              lg3
              xl2>
        <v-container>
          <v-card class="transparent elevation-0 text-xs-center">
            <v-card-text>
              <h3 class="headline mb-0">請問這是你嗎？</h3>
            </v-card-text>
            <v-card>
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-icon style="font-size: 128px;">face</v-icon>
                  </v-flex>
                  <v-flex xs12>
                    <span style="font-size: 18px;">{{name}}</span>
                  </v-flex>
                </v-layout>

              </v-card-text>
            </v-card>
            <v-card-text>
              <v-btn :to="'/player/login'"
                     flat>不是</v-btn>
              <v-btn @click=""
                     flat
                     outline>是的</v-btn>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '@/api'
import { reconnect } from '@/lib/socket'

export default {
  data: () => ({
    engineId: null,
    teamIndex: null,
    role: null,

    name: 'pp253',
    password: null
  }),
  methods: {
    submit() {
      this.$store.commit('ui/START_LOADING')
      if (this.valid) {
        this.$store
          .dispatch('user/userLogin', {
            name: this.name,
            password: this.password
          })
          .then(user => {
            this.$store.commit('ui/STOP_LOADING')
            if (user.level === 'ADMIN') {
              this.$router.push('/console')
            }
            reconnect()
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
