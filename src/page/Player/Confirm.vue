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
                     @click="notMe"
                     flat>不是</v-btn>
              <v-btn @click="$router.push('/')"
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
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import { reconnect } from '@/lib/socket'

export default {
  data: () => ({
    engineId: null,
    teamIndex: null,
    role: null
  }),
  computed: {
    ...mapState('user', ['name', 'userId']),
    ...mapGetters('user', ['hasLogin'])
  },
  methods: {
    notMe() {
      this.$store.commit('user/SET_ID', {})
      this.$store.commit('user/SET_NAME', {})
      this.$store.commit('user/SET_LEVEL', {})
    }
  },
  mounted() {
    if (!this.hasLogin) {
      this.$router.push('/player/login')
    }
  }
}
</script>

<style lang="scss">
</style>
