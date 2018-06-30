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
            <v-form v-model="valid"
                    @submit.prevent="submit"
                    ref="form">
              <v-card-text>
                <h3 class="headline mb-0">輸入 MagicCode</h3>
              </v-card-text>
              <v-card>
                <v-card-text>
                  <v-text-field v-model="magiccode"
                                label="MagicCode"
                                required
                                :rules="[requiredRule]"></v-text-field>
                  <div>請輸入你剛剛得到的 MagicCode。</div>
                </v-card-text>
              </v-card>
              <v-card-text>
                <router-link :to="engineId ? `/player/regist/${engineId}/${teamIndex}/${role}` : '/player/regist'">
                  <a>我還沒有 MagicCode。</a>
                </router-link>
              </v-card-text>
              <v-card-text>
                <v-btn @click="$router.go(-1)"
                       flat>取消</v-btn>
                <v-btn type="submit"
                       :disabled="!valid"
                       flat
                       outline>登入</v-btn>
              </v-card-text>
            </v-form>
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
    valid: null,

    engineId: null,
    teamIndex: null,
    role: null,

    name: null,
    magiccode: null,

    requiredRule: v => !!v || '必需項',
    lessThanTenCharRule: v => (!!v && v.length <= 10) || '名字要少於10個字'
  }),
  computed: {
    ...mapGetters('user', ['hasLogin'])
  },
  methods: {
    submit() {
      if (!this.valid) {
        return
      }
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch('user/userLoginByMagicCode', {
          magiccode: this.magiccode
        })
        .then(user => {
          this.$store.commit('ui/STOP_LOADING')
          if (user.level === 'ADMIN') {
            this.$router.push('/console')
          } else {
            this.$router.push('/')
          }
          reconnect()
        })
        .catch(err => {
          this.$store.commit('ui/STOP_LOADING')
          console.error(err)
        })
    },
    clear() {
      this.$refs.form.reset()
    }
  },
  mounted() {
    this.engineId = this.$route.params.id
    this.teamIndex = this.$route.params.teamIndex
    this.role = this.$route.params.role

    if (this.hasLogin) {
      this.$router.replace(
        this.engineId
          ? `/player/confirm/${this.engineId}/${this.teamIndex}/${this.role}`
          : '/player/confirm'
      )
    }
  }
}
</script>

<style lang="scss">
</style>
