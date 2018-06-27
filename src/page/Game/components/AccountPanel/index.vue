<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-accountpanel">
    <v-tabs v-model="active"
            centered>
      <v-tab key="overview"
             ripple>概覽</v-tab>
      <v-tab-item key="overview">
        <v-card flat>
          <v-card-text>
            <v-layout wrap
                      class="labeled-list">
              <v-flex xs6
                      sm3>
                <span class="label">現金</span>
                {{$store.getters['account/getBalance']('Cash')}}
              </v-flex>
              <v-flex xs6
                      sm3>
                <span class="label">應收帳款</span>
                {{-1 * $store.getters['account/getBalance']('AccountsReceivable')}}
              </v-flex>
              <v-flex xs6
                      sm3>
                <span class="label">應付帳款</span>
                {{$store.getters['account/getBalance']('AccountsPayable')}}
              </v-flex>
              <v-flex xs6
                      sm3>
                <span class="label">銷貨收入</span>
                {{$store.getters['account/getBalance']('Sales')}}
              </v-flex>
              <v-flex xs6
                      sm3>
                <span class="label">存貨成本</span>
                {{$store.getters['account/getBalance']('Inventory')}}
              </v-flex>
              <v-flex xs6
                      sm3>
                <span class="label">倉儲成本</span>
                {{$store.getters['account/getBalance']('CostOfWarehousing')}}
              </v-flex>
              <v-flex xs6
                      sm3>
                <span class="label">銷貨成本</span>
                {{$store.getters['account/getBalance']('CostOfSales')}}
              </v-flex>
              <v-flex xs6
                      sm3>
                <span class="label">運輸成本</span>
                {{$store.getters['account/getBalance']('CostOfTranportation')}}
              </v-flex>
            </v-layout>
          </v-card-text>

          <template v-if="$store.getters['user/isStaffOrAdmin']">
            <v-divider />
            <v-subheader>工作人員用控制項</v-subheader>
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12>
                  <v-btn @click="dialog = true"
                         outline>
                    <v-icon>add</v-icon>增加會計項目
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>

            <account-add-dialog v-model="dialog" />
          </template>
        </v-card>
      </v-tab-item>

      <v-tab key="journal"
             ripple>日記簿</v-tab>
      <v-tab-item key="journal">
        <v-card flat>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12
                      sm2>時間</v-flex>
              <v-flex xs12
                      sm10>
                <v-layout wrap>
                  <v-flex xs7>項目</v-flex>
                  <v-flex xs5>金額</v-flex>
                </v-layout>
              </v-flex>
              <template v-for="transaction in $store.state.account.journal">
                <v-flex xs12
                        sm2
                        :key="transaction._id + '-gameTime'">
                  {{transaction.gameTime && $store.getters['engine/toReadableGameTime'](transaction.gameTime)}}
                </v-flex>
                <v-flex xs12
                        sm10
                        :key="transaction._id + '-items'">
                  <v-layout wrap>
                    <template v-for="debit in transaction.debit">
                      <v-flex xs7
                              :key="debit._id + '-classification'">
                        {{debit.classification}}
                      </v-flex>
                      <v-flex xs5
                              :key="debit._id + '-amount'">
                        {{debit.amount}}
                      </v-flex>
                    </template>
                    <template v-for="credit in transaction.credit">
                      <v-flex xs7
                              :key="credit._id + '-classification'">
                        <span class="pl-3"></span>{{credit.classification}}
                      </v-flex>
                      <v-flex xs5
                              :key="credit._id + '-amount'">
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

      <v-tab key="ledger"
             ripple>分類簿</v-tab>
      <v-tab-item key="ledger">
        <v-card flat>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12
                      sm2>時間</v-flex>
              <v-flex xs12
                      sm10>
                <v-layout wrap>
                  <v-flex xs7>項目</v-flex>
                  <v-flex xs5>金額</v-flex>
                </v-layout>
              </v-flex>
              <template v-for="transaction in $store.state.account.journal">
                <v-flex xs12
                        sm2
                        :key="transaction._id + '-gameTime'">
                  {{transaction.gameTime && $store.getters['engine/toReadableGameTime'](transaction.gameTime)}}
                </v-flex>
                <v-flex xs12
                        sm10
                        :key="transaction._id + '-items'">
                  <v-layout wrap>
                    <template v-for="debit in transaction.debit">
                      <v-flex xs7
                              :key="debit._id + '-classification'">
                        {{debit.classification}}
                      </v-flex>
                      <v-flex xs5
                              :key="debit._id + '-amount'">
                        {{debit.amount}}
                      </v-flex>
                    </template>
                    <template v-for="credit in transaction.credit">
                      <v-flex xs7
                              :key="credit._id + '-classification'">
                        <span class="pl-3"></span>{{credit.classification}}
                      </v-flex>
                      <v-flex xs5
                              :key="credit._id + '-amount'">
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
  </v-container>
</template>

<script>
import api from '@/api'
import AccountAddDialog from './AccountAddDialog'

export default {
  components: {
    AccountAddDialog
  },
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
    dialog: null
  }),
  watch: {
    nodeName(newVal) {
      this.load()
    }
  },
  computed: {
    node() {
      return (
        this.$store.state.engine.nodes.find(
          node => node.name === this.nodeName
        ) || {}
      )
    }
  },
  methods: {
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
