<template>
  <v-container pa-0
               fluid
               class="game-end">
    <v-toolbar fixed
               tabs
               app
               color="cyan">
      <v-toolbar-title v-if="result"
                       class="ml-0 pl-3">
        <span>{{result.name}} 結果</span>
      </v-toolbar-title>
      <v-tabs slot="extension"
              v-model="active"
              centered
              color="cyan"
              slider-color="yellow">
        <v-tab key="all"
               href="#tab-all">
          整體表現
        </v-tab>
        <v-tab key="team"
               href="#tab-team">
          各組表現
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items v-model="active"
                  style="padding-top: 112px;">
      <v-tab-item id="tab-all"
                  key="all">
        <v-card flat>
          <v-card-text>
            <v-list>
              <v-list-tile v-for="(team, idx) of rankingTeam"
                           :key="team.teamIndex">
                #{{idx + 1}} 第{{team.teamIndex}}組 ${{team.cashBalance}}
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item id="tab-team"
                  key="team">
        <v-card flat>
          <v-card-text>
            <v-select :items="teamList"
                      label="小隊"
                      v-model="teamIndex"></v-select>
          </v-card-text>
          <v-card-text v-if="ledger"
                       v-for="role in ['Retailer', 'AssemblyFactory', 'ComponentsFactory']"
                       :key="role">
            {{role}}
            <table style="width: 100%;">
              <tbody>
                <tr>
                  <td>營業收入合計</td>
                  <td>{{ledger[role]['Cash'] + ledger[role]['NonOperatingIncome']}}</td>
                </tr>
                <tr>
                  <td>營業成本合計</td>
                  <td>{{ledger[role]['Cash']}}</td>
                </tr>
                <tr>
                  <td>營業毛利</td>
                  <td>{{ledger[role]['Cash'] + ledger[role]['NonOperatingIncome'] - (ledger[role]['SalaryAndWages'] + ledger[role]['CostOfWarehousing'] + ledger[role]['Inventory'] + ledger[role]['CostOfTransportation'] + ledger[role]['IncomeFromCounterPartyDefault'] + ledger[role]['NonOperatingExpenses'] + ledger[role]['CounterPartyDefault'])}}</td>
                </tr>
                <tr>
                  <td>人事費用</td>
                  <td>{{ledger[role]['SalaryAndWages']}}</td>
                </tr>
                <tr>
                  <td>倉儲費用</td>
                  <td>{{ledger[role]['CostOfWarehousing']}}</td>
                </tr>
                <tr>
                  <td>存貨費用</td>
                  <td>{{ledger[role]['Inventory']}}</td>
                </tr>
                <tr>
                  <td>運輸費用</td>
                  <td>{{ledger[role]['CostOfTransportation']}}</td>
                </tr>
                <tr>
                  <td>違約金</td>
                  <td>{{ledger[role]['IncomeFromCounterPartyDefault']}}</td>
                </tr>
                <tr>
                  <td>營業費用合計</td>
                  <td>{{ledger[role]['SalaryAndWages'] + ledger[role]['CostOfWarehousing'] + ledger[role]['Inventory'] + ledger[role]['CostOfTransportation'] + ledger[role]['IncomeFromCounterPartyDefault']}}</td>
                </tr>
                <tr>
                  <td>營業外收入</td>
                  <td>{{ledger[role]['NonOperatingIncome']}}</td>
                </tr>
                <tr>
                  <td>營業外支出合計</td>
                  <td>{{ledger[role]['NonOperatingExpenses'] + ledger[role]['CounterPartyDefault']}}</td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import { ROOM_EVENTS, USER_LEVEL } from '@/lib/schema'

export default {
  data: () => ({
    active: null,
    engineId: null,
    teamIndex: null,
    role: null,

    teamList: [
      1,2,3,4,5,6,7,8
    ],

    result: null
  }),
  computed: {
    rankingCashBalanceList() {
      if (!this.result) {
        return
      }
      let list = []
      for (let role of ['Retailer', 'AssemblyFactory', 'ComponentsFactory']) {
        for (let teamIndex in this.result[role]) {
          let teamRole = this.result[role][teamIndex]
          let cashBalance = teamRole.Account.ledger.find(i => i.classification === 'Cash').balance
          list[teamIndex] = list[teamIndex] ? list[teamIndex] + parseInt(cashBalance) : parseInt(cashBalance)
        }
      }
      return list
    },
    rankingTeam() {
      if (!this.rankingCashBalanceList) {
        return
      }
      let list = []
      for(let teamIndex in this.rankingCashBalanceList) {
        let teamCashBalance = this.rankingCashBalanceList[teamIndex]
        list.push({
          teamIndex: parseInt(teamIndex) + 1,
          cashBalance: teamCashBalance
        })
      }
      return list.sort((a,b) => b.cashBalance - a.cashBalance)
    },
    ledger() {
      if (!this.result || !this.teamIndex) {
        return
      }
      let obj = {Retailer: {}, AssemblyFactory: {}, ComponentsFactory:{} }
      for (let role of ['Retailer', 'AssemblyFactory', 'ComponentsFactory']) {
        let teamRole = this.result[role][this.teamIndex - 1]
        let getBalance = cls => {
          if (teamRole.Account.ledger.find(i => i.classification === cls)) {
            return teamRole.Account.ledger.find(i => i.classification === cls).balance
          } else {
            return 0
          }
        }
        obj[role]['Cash'] = getBalance('Cash')
        obj[role]['Inventory'] = getBalance('Inventory')
        obj[role]['CostOfSales'] = getBalance('CostOfSales')
        obj[role]['CostOfTransportation'] = getBalance('CostOfTransportation')
        obj[role]['CostOfWarehousing'] = getBalance('CostOfWarehousing')
        obj[role]['SalaryAndWages'] = getBalance('SalaryAndWages')
        obj[role]['NonOperatingIncome'] = getBalance('NonOperatingIncome')
        obj[role]['NonOperatingExpenses'] = getBalance('NonOperatingExpenses')
        obj[role]['IncomeFromCounterPartyDefault'] = getBalance('IncomeFromCounterPartyDefault')
        obj[role]['CounterPartyDefault'] = getBalance('CounterPartyDefault')
      }
      return obj
    }
  },
  methods: {
    loadEngine(engineId) {
      api.engine.toResultObject(engineId).then(result => {
        this.engineId = engineId
        this.result = result
      })
    }
  },
  mounted() {
    this.engineId = this.$route.params.id

    this.loadEngine(this.engineId)
  }
}
</script>

<style lang="scss">
</style>
