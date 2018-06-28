<template>
  <v-container pa-0
               class="player-login fill-height">
    <v-card class="transparent elevation-0 text-xs-center">
      <v-form v-model="valid"
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
            <v-text-field v-model="password"
                          label="密碼"
                          required
                          type="password"
                          :rules="[requiredRule]"></v-text-field>
            <div>通常會進入這一頁的只有工作人員，如果有隊員看到這一頁，請和我們反應。</div>
          </v-card-text>
        </v-card>
        <v-card-text>
          <v-btn @click="submit"
                 :disabled="!valid"
                 flat
                 outline>確定</v-btn>
        </v-card-text>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/api'
import { reconnect } from '@/lib/socket'

export default {
  data: () => ({
    valid: null,

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
