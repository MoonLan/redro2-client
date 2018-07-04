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
                    <div style="font-size: 18px;">{{name}}</div>
                    <div class="grey--text"
                         style="font-size: 14px;">{{level}}</div>
                  </v-flex>
                </v-layout>

              </v-card-text>
            </v-card>
            <v-card-text>
              <v-btn @click="notMe"
                     flat>不是</v-btn>
              <v-btn @click="isMe"
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
import { USER_LEVEL } from '@/lib/schema'

export default {
  data: () => ({
    engineId: null,
    teamIndex: null,
    role: null
  }),
  computed: {
    ...mapState('user', ['name', 'userId', 'level']),
    ...mapGetters('user', ['hasLogin'])
  },
  methods: {
    notMe() {
      this.$store.commit('user/SET_ID', {})
      this.$store.commit('user/SET_NAME', {})
      this.$store.commit('user/SET_LEVEL', {})

      this.$router.replace(
        this.engineId
          ? `/player/login/${this.engineId}/${this.teamIndex}/${this.role}`
          : '/player/login'
      )
    },
    isMe() {
      if (this.level === USER_LEVEL.ADMIN) {
        this.$router.push('/console')
      } else if (this.engineId) {
        this.$router.replace(
          `/player/ready/${this.engineId}/${this.teamIndex}/${this.role}`
        )
      } else {
        this.$router.push('/')
      }
    }
  },
  mounted() {
    this.engineId = this.$route.params.id
    this.teamIndex = this.$route.params.teamIndex
    this.role = this.$route.params.role

    if (!this.hasLogin) {
      this.$router.replace(
        this.engineId
          ? `/player/login/${this.engineId}/${this.teamIndex}/${this.role}`
          : '/player/login'
      )
    }
  }
}
</script>

<style lang="scss">
</style>
