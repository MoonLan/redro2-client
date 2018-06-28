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
        <v-tabs-items v-model="active">
          <v-tab-item id="magiccode">
            <v-container>
              <v-card class="transparent elevation-0 text-xs-center">
                <v-form v-model="validMagicCode"
                        ref="form">
                  <v-card-text>
                    <h3 class="headline mb-0">輸入 MagicCode</h3>
                  </v-card-text>
                  <v-card>
                    <v-card-text>
                      <v-text-field v-model="password"
                                    label="MagicCode"
                                    required
                                    :rules="[requiredRule]"></v-text-field>
                      <div>請輸入你剛剛得到的 MagicCode。</div>
                    </v-card-text>
                  </v-card>
                  <v-card-text>
                    <router-link :to="'/player/regist'">
                      <a>我還沒有 MagicCode。</a>
                    </router-link>
                  </v-card-text>
                  <v-card-text>
                    <v-btn @click="$router.go(-1)"
                           flat>取消</v-btn>
                    <v-btn @click="active = 'name'"
                           :disabled="!validMagicCode"
                           flat
                           outline>登入</v-btn>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-container>
          </v-tab-item>

          <v-tab-item id="name">
            <v-container>
              <v-card class="transparent elevation-0 text-xs-center">
                <v-form v-model="validName"
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
                                    :rules="[requiredRule, lessThanTenCharRule]"></v-text-field>
                      <div>通常會進入這一頁的只有工作人員，如果有隊員看到這一頁，請和我們反應。</div>
                    </v-card-text>
                  </v-card>
                  <v-card-text>
                    <v-btn @click=""
                           :disabled="!validName"
                           flat
                           outline>確定</v-btn>
                  </v-card-text>
                </v-form>
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

export default {
  data: () => ({
    active: 'magiccode',
    validMagicCode: null,
    validName: null,

    engineId: null,
    teamIndex: null,
    role: null,

    name: null,
    password: null,

    requiredRule: v => !!v || '必需項',
    lessThanTenCharRule: v => (!!v && v.length <= 10) || '名字要少於10個字'
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
