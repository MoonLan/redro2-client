<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
            max-width="500px"
            :value="value"
            @input="(val) => {$emit('input', val)}">
    <v-form v-model="valid"
            @submit.prevent="submit"
            ref="form">
      <v-card>
        <v-card-title>
          <h3 class="headline">輸入輸出</h3>
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12>
              <v-tabs v-model="way">
                <v-tab>輸入</v-tab>
                <v-tab>輸出</v-tab>
              </v-tabs>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="memo"
                            label="備註"></v-text-field>
            </v-flex>
            <v-flex xs12
                    sm6
                    :pr-2="!$vuetify.breakpoint.xsOnly">
              <v-autocomplete :items="nodesNameList"
                              v-model="from"
                              label="輸出方"
                              :disabled="way === '1'"
                              required
                              :rules="[requiredRule]"></v-autocomplete>
            </v-flex>
            <v-flex xs12
                    sm6
                    :pl-2="!$vuetify.breakpoint.xsOnly">
              <v-autocomplete :items="nodesNameList"
                              v-model="to"
                              label="輸入方"
                              :disabled="way === '0'"
                              required
                              :rules="[requiredRule]"></v-autocomplete>
            </v-flex>
            <v-flex xs12
                    sm4
                    pt-3
                    :pr-2="!$vuetify.breakpoint.xsOnly">
              <v-checkbox label="有物流延遲"
                          v-model="hasTransportationDelay"></v-checkbox>
            </v-flex>
            <v-flex xs12
                    sm4
                    :px-2="!$vuetify.breakpoint.xsOnly">
              <v-text-field label="物流延遲時間"
                            type="number"
                            suffix="秒"
                            :disabled="!hasTransportationDelay"
                            v-model="transportationTime"></v-text-field>
            </v-flex>
            <v-flex xs12
                    sm4
                    :pl-2="!$vuetify.breakpoint.xsOnly">
              <v-text-field label="物流成本"
                            type="number"
                            prefix="$"
                            v-model="transportationCost"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <h3>項目</h3>
          <v-layout wrap>
            <template v-for="(item, index) in list">
              <v-flex xs12
                      sm5
                      :pr-2="!$vuetify.breakpoint.xsOnly"
                      :key="index + '-good'">
                <v-autocomplete :items="goods"
                                v-model="item.good"
                                label="種類"
                                required
                                :rules="[requiredRule]"
                                hide-details></v-autocomplete>
              </v-flex>
              <v-flex xs12
                      sm3
                      :px-2="!$vuetify.breakpoint.xsOnly"
                      :key="index + '-unit'">
                <v-text-field v-model="item.unit"
                              label="數量"
                              type="number"
                              required
                              :rules="[requiredRule]"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs8
                      sm3
                      :px-2="!$vuetify.breakpoint.xsOnly"
                      :key="index + '-unitPirce'">
                <v-text-field v-model="item.unitPrice"
                              label="單價"
                              type="number"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs4
                      sm1
                      :key="index + '-close'">
                <v-btn class="mt-3"
                       icon
                       flat
                       @click="removeItem(index)">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>
            </template>
          </v-layout>
          <v-btn @click="addItem('debit')"
                 block
                 outline>增加項目</v-btn>
        </v-card-text>
        <v-card-text>
          <v-layout class="labeled-list">
            <v-flex xs6>
              <span class="label">總金額</span>
              {{price}}
            </v-flex>
            <v-flex xs6>
              <span class="label">運輸成本</span>
              {{transportationCost}}
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn flat
                 @click="clear(), dialog = false">關閉</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat
                 @click="clear">清除</v-btn>
          <v-btn type="submit"
                 :disabled="!valid || loading"
                 flat
                 outline>登記</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      way: '1',
      goods: ['Car', 'Engine', 'Body', 'Wheel'],

      dialog: false,
      loading: false,
      hasTransportationDelay: true,
      transportationTime: 10,
      transportationCost: 100,
      from: null,
      to: null,
      memo: null,
      list: [],

      valid: null,
      requiredRule: v => !!v || '必需項'
    }
  },
  watch: {
    way(newVal) {
      switch (newVal) {
        case '0':
          this.to = this.nodeName
          break

        default:
        case '1':
          this.from = this.nodeName
          break
      }
    }
  },
  computed: {
    price() {
      let sum = 0
      for (let item of this.list) {
        sum +=
          parseInt(item.unit ? item.unit : 0) *
          parseFloat(item.unitPrice ? item.unitPrice : 0)
      }
      return sum
    },
    nodesNameList() {
      let list = []
      for (let node of this.$store.state.engine.nodes) {
        list.push(node.name)
      }
      return list
    }
  },
  mathods: {
    submit() {
      if (!this.valid) {
        return
      }
      let ioJournalItem = {
        from: this.from,
        to: this.to,
        list: this.list,
        price: this.price,
        transportationCost: this.transportationCost,
        transportationTime: this.transportationTime,
        transportationStatus: this.hasTransportationDelay
          ? TRANSPORTATION_STATUS.DELIVERING
          : TRANSPORTATION_STATUS.COMPLETED,
        memo: this.memo,
        gameTime: this.$store.state.engine.gameTime
      }
      this.loading = true
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch(`io/${this.way === '0' ? 'import' : 'export'}`, ioJournalItem)
        .then(io => {
          this.loading = false
          this.dialog = false
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          this.loading = false
          this.dialog = false
          this.$store.commit('ui/STOP_LOADING')
          console.error(err)
        })
    },
    clear() {
      this.$refs.form.reset()
    },
    addItem() {
      this.list.push({
        good: '',
        unit: 0,
        unitPrice: 0
      })
    },
    removeItem(index) {
      this.list.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
</style>

