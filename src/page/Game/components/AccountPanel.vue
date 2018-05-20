<template>
  <v-container ma-0 pa-0 class="game-accountpanel">
    <v-tabs v-model="active">
      <v-tab key="overview" ripple>概覽</v-tab>
      <v-tab-item key="overview">
        <v-card flat>
          <v-card-text>
            <v-layout wrap class="labeled-list">
              <v-flex xs6 md3>
                <span class="label">現金</span>
                {{$store.getters['account/getBalance']('Cash')}}
              </v-flex>
              <v-flex xs6 md3>
                <span class="label">應收帳款</span>
                {{-1 * $store.getters['account/getBalance']('AccountsReceivable')}}
              </v-flex>
              <v-flex xs6 md3>
                <span class="label">應付帳款</span>
                {{$store.getters['account/getBalance']('AccountsPayable')}}
              </v-flex>
              <v-flex xs6 md3>
                <span class="label">存貨成本</span>
                {{$store.getters['account/getBalance']('Inventory')}}
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text v-if="['STAFF', 'ADMIN'].includes($store.state.user.level)">
            <v-btn @click="dialog = true">
              <v-icon>add</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab key="journal" ripple>日記簿</v-tab>
      <v-tab-item key="journal">
        <v-card flat>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12 md2>時間</v-flex>
              <v-flex xs12 md10>
                <v-layout wrap>
                  <v-flex xs7>項目</v-flex>
                  <v-flex xs5>金額</v-flex>
                </v-layout>
              </v-flex>
              <template v-for="transaction in $store.state.account.journal">
                <v-flex xs12 md2 :key="transaction._id + '-gameTime'">
                  {{$store.getters['engine/toReadableGameTime'](transaction.gameTime)}}
                </v-flex>
                <v-flex xs12 md10 :key="transaction._id + '-items'">
                  <v-layout wrap>
                    <template v-for="debit in transaction.debit">
                      <v-flex xs7 :key="debit._id + '-classification'">
                        {{debit.classification}}
                      </v-flex>
                      <v-flex xs5 :key="debit._id + '-amount'">
                        {{debit.amount}}
                      </v-flex>
                    </template>
                    <template v-for="credit in transaction.credit">
                      <v-flex xs7 :key="credit._id + '-classification'">
                        <span class="pl-3"></span>{{credit.classification}}
                      </v-flex>
                      <v-flex xs5 :key="credit._id + '-amount'">
                        {{credit.amount}}
                      </v-flex>
                    </template>
                  </v-layout>
                </v-flex>
              </template>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab key="ledger" ripple>分類簿</v-tab>
      <v-tab-item key="ledger">
        <v-card flat>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12 md2>時間</v-flex>
              <v-flex xs12 md10>
                <v-layout wrap>
                  <v-flex xs7>項目</v-flex>
                  <v-flex xs5>金額</v-flex>
                </v-layout>
              </v-flex>
              <template v-for="transaction in $store.state.account.journal">
                <v-flex xs12 md2 :key="transaction._id + '-gameTime'">
                  {{$store.getters['engine/toReadableGameTime'](transaction.gameTime)}}
                </v-flex>
                <v-flex xs12 md10 :key="transaction._id + '-items'">
                  <v-layout wrap>
                    <template v-for="debit in transaction.debit">
                      <v-flex xs7 :key="debit._id + '-classification'">
                        {{debit.classification}}
                      </v-flex>
                      <v-flex xs5 :key="debit._id + '-amount'">
                        {{debit.amount}}
                      </v-flex>
                    </template>
                    <template v-for="credit in transaction.credit">
                      <v-flex xs7 :key="credit._id + '-classification'">
                        <span class="pl-3"></span>{{credit.classification}}
                      </v-flex>
                      <v-flex xs5 :key="credit._id + '-amount'">
                        {{credit.amount}}
                      </v-flex>
                    </template>
                  </v-layout>
                </v-flex>
              </template>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>

    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="500px" v-model="dialog">
      <v-form v-model="valid" ref="form">
        <v-card>
          <v-card-title>
            <h3 class="headline">增加會計項目</h3>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="memo" label="備註"></v-text-field>
            <v-checkbox label="不平衡" v-model="unbalance" hide-details></v-checkbox>
          </v-card-text>
          <v-card-text>
            <h3>借方項目</h3>
            <v-layout wrap grid-list-xs>
              <template v-for="(item, index) in debit">
                <v-flex xs12 sm5 pr-3 :key="index + '-classification'">
                  <v-select :items="classifications" v-model="item.classification" label="科目" autocomplete required :rules="requiredRule" hide-details></v-select>
                </v-flex>
                <v-flex xs12 sm3 pr-3 :key="index + '-amount'">
                  <v-text-field v-model="item.amount" label="金額" type="number" required :rules="requiredRule" hide-details></v-text-field>
                </v-flex>
                <v-flex xs12 sm3 :key="index + '-counterObject'">
                  <v-text-field v-model="item.counterObject" label="對象" hide-details></v-text-field>
                </v-flex>
                <v-flex xs12 sm1 :key="index + '-close'">
                  <v-btn class="mt-3" icon flat @click="removeItem('debit', index)">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-flex>
              </template>
            </v-layout>
            <v-btn @click="addItem('debit')" block outline>增加借方項目</v-btn>
          </v-card-text>
          <v-card-text>
            <h3>貸方項目</h3>
            <v-layout wrap grid-list-xs>
              <template v-for="(item, index) in credit">
                <v-flex xs12 sm5 pr-3 :key="index + '-classification'">
                  <v-select :items="classifications" v-model="item.classification" label="科目" autocomplete required :rules="requiredRule" hide-details></v-select>
                </v-flex>
                <v-flex xs12 sm3 pr-3 :key="index + '-amount'">
                  <v-text-field v-model="item.amount" label="金額" type="number" required :rules="requiredRule" hide-details></v-text-field>
                </v-flex>
                <v-flex xs12 sm3 :key="index + '-counterObject'">
                  <v-text-field v-model="item.counterObject" label="對象" hide-details></v-text-field>
                </v-flex>
                <v-flex xs12 sm1 :key="index + '-close'">
                  <v-btn class="mt-3" icon flat @click="removeItem('credit', index)">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-flex>
              </template>
            </v-layout>
            <v-btn @click="addItem('credit')" block outline>增加貸方項目</v-btn>

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
            <v-btn flat @click="clear(), dialog = false">關閉</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat @click="clear">清除</v-btn>
            <v-btn flat :disabled="debitAmount !== creditAmount && !unbalance || !valid" @click="submit">登記</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import api from '@/api'

export default {
  props: {
    engineId: String,
    nodeName: String
  },
  data: () => ({
    active: null,
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

    dialog: false,
    memo: '',
    unbalance: false,
    debit: [],
    credit: [],
    valid: null,
    requiredRule: [v => !!v || '必需項']
  }),
  watch: {
    nodeName(newVal) {
      this.load()
    }
  },
  computed: {
    node() {
      return this.$store.state.engine.nodes.find(node => node.name === this.nodeName) || {}
    },
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
      let accountTransaction = {
        debit: this.debit,
        credit: this.credit,
        unbalance: this.unbalance,
        memo: this.memo,
        gameTime: this.$store.state.engine.gameTime
      }
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch('account/add', accountTransaction)
        .then(account => {
          this.dialog = false
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          this.dialog = false
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
    },
    load() {
      this.$store.dispatch('account/load', {
        engineId: this.engineId,
        nodeName: this.nodeName
      })
    }
  },
  mounted() {
    this.load()
  }
}
</script>

<style lang="scss">
</style>
