<template>
  <v-container pa-0
               class="player-regist fill-height">
    <v-layout wrap
              justify-center
              align-center>
      <v-flex xs12
              sm6
              md4
              lg3
              xl2>
        <v-tabs-items v-model="active">
          <v-tab-item id="name">
            <v-container>
              <v-card class="transparent elevation-0 text-xs-center">
                <v-form v-model="valid"
                        @submit.prevent="submit"
                        ref="form">
                  <v-card-text>
                    <h3 class="headline mb-0">輸入你的名字</h3>
                  </v-card-text>
                  <v-card>
                    <v-card-text>
                      <v-text-field v-model="name"
                                    label="名字"
                                    required
                                    :counter="10"
                                    :rules="[requiredRule, lessThanTenWordRule]"></v-text-field>
                      <div>你也可以輸入你的暱稱、藝名等。</div>
                      <div class="red--text">工人不要打名字，直接按下方連結！</div>
                    </v-card-text>
                  </v-card>
                  <v-card-text>
                    <router-link :to="this.engineId ? `/player/login/${this.engineId}/${this.teamIndex}/${this.role}` : '/player/login'"
                                 replace>
                      <a>我是工作人員，或我已經有 MagicCode 了。</a>
                    </router-link>
                  </v-card-text>
                  <v-card-text>
                    <v-btn @click="$router.push('/')"
                           flat>取消</v-btn>
                    <v-btn type="submit"
                           :disabled="!valid"
                           flat
                           outline>創建</v-btn>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-container>
          </v-tab-item>

          <v-tab-item id="magiccode">
            <v-container>
              <v-card class="transparent elevation-0 text-xs-center">
                <v-card-text>
                  <h3 class="headline mb-0">你的專屬 MagicCode</h3>
                </v-card-text>
                <v-card>
                  <v-card-text>
                    <v-text-field v-model="magiccode"
                                  label="MagicCode"
                                  readonly></v-text-field>
                    <div>MagicCode 將會用來驗證你的身分，建議將 MagicCode 保存在你的手機裡。</div>
                  </v-card-text>
                </v-card>
                <v-card-text>
                  <v-btn @click="$router.go(-1)"
                         flat
                         outline>我已經記住了</v-btn>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '@/api'
import { reconnect } from '@/lib/socket'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    active: 'name',
    valid: null,

    engineId: null,
    teamIndex: null,
    role: null,

    name: null,
    magiccode: null,

    requiredRule: v => !!v || '必需項',
    lessThanTenWordRule: v => (!!v && v.length <= 10) || '名字要少於10個字'
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
        .dispatch('user/userRegist', {
          name: this.name
        })
        .then(user => {
          this.magiccode = user.password

          return this.$store.dispatch('user/userLoginByMagicCode', {
            magiccode: this.magiccode
          })
        })
        .then(user => {
          this.active = 'magiccode'
          this.$store.commit('ui/STOP_LOADING')
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
