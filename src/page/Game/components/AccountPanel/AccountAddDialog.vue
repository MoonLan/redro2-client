<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
            max-width="500px"
            :value="value"
            @input="value = $event.target.value">
    <v-form v-model="valid"
            @submit.prevent="submit"
            ref="form">
      <v-card>
        <v-card-title>
          <h3 class="headline">增加會計項目</h3>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="memo"
                        label="備註"></v-text-field>
          <v-checkbox label="不平衡"
                      v-model="unbalance"
                      hide-details></v-checkbox>
        </v-card-text>

        <v-card-text>
          <h3>借方項目</h3>
          <v-layout wrap
                    grid-list-xs>
            <template v-for="(item, index) in debit">
              <v-flex xs12
                      sm5
                      pr-3
                      :key="index + '-classification'">
                <v-autocomplete :items="classifications"
                          v-model="item.classification"
                          label="科目"
                          required
                          :rules="requiredRule"
                          hide-details></v-autocomplete>
              </v-flex>
              <v-flex xs12
                      sm3
                      pr-3
                      :key="index + '-amount'">
                <v-text-field v-model="item.amount"
                              label="金額"
                              type="number"
                              required
                              :rules="requiredRule"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs12
                      sm3
                      :key="index + '-counterObject'">
                <v-text-field v-model="item.counterObject"
                              label="對象"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs12
                      sm1
                      :key="index + '-close'">
                <v-btn class="mt-3"
                       icon
                       flat
                       @click="removeItem('debit', index)">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>
            </template>
          </v-layout>
          <v-btn @click="addItem('debit')"
                 block
                 outline>增加借方項目</v-btn>
        </v-card-text>

        <v-card-text>
          <h3>貸方項目</h3>
          <v-layout wrap
                    grid-list-xs>
            <template v-for="(item, index) in credit">
              <v-flex xs12
                      sm5
                      pr-3
                      :key="index + '-classification'">
                <v-autocomplete :items="classifications"
                          v-model="item.classification"
                          label="科目"
                          required
                          :rules="requiredRule"
                          hide-details></v-autocomplete>
              </v-flex>
              <v-flex xs12
                      sm3
                      pr-3
                      :key="index + '-amount'">
                <v-text-field v-model="item.amount"
                              label="金額"
                              type="number"
                              required
                              :rules="requiredRule"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs12
                      sm3
                      :key="index + '-counterObject'">
                <v-text-field v-model="item.counterObject"
                              label="對象"
                              hide-details></v-text-field>
              </v-flex>
              <v-flex xs12
                      sm1
                      :key="index + '-close'">
                <v-btn class="mt-3"
                       icon
                       flat
                       @click="removeItem('credit', index)">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-flex>
            </template>
          </v-layout>
          <v-btn @click="addItem('credit')"
                 block
                 outline>增加貸方項目</v-btn>
        </v-card-text>

        <v-card-text>
          <v-layout class="labeled-list">
            <v-flex>
              <span class="label">借方金額</span>
              {{debitAmount}}
            </v-flex>
            <v-flex>
              <span class="label">貸方金額</span>
              {{creditAmount}}
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn flat
                 @click="clear(), $emit('input', false)">關閉</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat
                 @click="clear">清除</v-btn>
          <v-btn flat
                 :disabled="debitAmount !== creditAmount && !unbalance || !valid || loading"
                 type="submit">登記</v-btn>
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
      classifications: [
        'Cash',
        'Inventory',
        'AccountsReceivable',
        'AccountsPayable',
        'Sales',
        'CostOfSales',
        'CostOfTransportation',
        'CostOfWarehousing',
        'SalaryAndWages',
        'NonOperatingIncome',
        'NonOperatingExpenses',
        'IncomeFromCounterPartyDefault',
        'CounterPartyDefault'
      ],
      loading: false,
      memo: '',
      unbalance: false,
      debit: [],
      credit: [],
      valid: null,
      requiredRule: [v => !!v || '必需項']
    }
  },
  computed: {
    debitAmount() {
      let sum = 0
      for (let item of this.debit) {
        sum += parseFloat(item.amount ? item.amount : 0)
      }
      return sum
    },
    creditAmount() {
      let sum = 0
      for (let item of this.credit) {
        sum += parseFloat(item.amount ? item.amount : 0)
      }
      return sum
    }
  },
  methods: {
    submit() {
      if (!this.valid) {
        return
      }
      let accountTransaction = {
        debit: this.debit,
        credit: this.credit,
        unbalance: this.unbalance,
        memo: this.memo,
        gameTime: this.$store.state.engine.gameTime
      }

      this.loading = true
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch('account/add', accountTransaction)
        .then(account => {
          this.loading = false
          this.$emit('input', false)
          this.$store.commit('ui/OPEN_DIALOG', {
            title: '成功新增',
            text: ''
          })
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          this.loading = false
          this.$emit('input', false)
          this.$store.commit('ui/STOP_LOADING')
          console.error(err)
        })
    },
    clear() {
      this.$refs.form.reset()
    },
    addItem(side) {
      this[side].push({
        classification: '',
        amount: 0,
        counterObject: ''
      })
    },
    removeItem(side, index) {
      this[side].splice(index, 1)
    }
  }
}
</script>

<style>
</style>
