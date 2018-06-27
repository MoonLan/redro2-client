<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-iopanel">
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
                      md3>
                <span class="label">銷貨收入</span>
                {{$store.getters['account/getBalance']('Sales')}}
              </v-flex>
              <v-flex xs6
                      md3>
                <span class="label">銷貨成本</span>
                {{$store.getters['account/getBalance']('CostOfSales')}}
              </v-flex>
              <v-flex xs6
                      md3>
                <span class="label">運輸成本</span>
                {{$store.getters['account/getBalance']('CostOfTranportation')}}
              </v-flex>
              <v-flex xs6
                      md3>
                <span class="label">預設運輸成本</span>
                {{$store.state.io.transportationCost}}
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
                    <v-icon>import_export</v-icon>輸入輸出
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </template>
        </v-card>
      </v-tab-item>

      <v-tab key="importJournal"
             ripple>輸入紀錄</v-tab>
      <v-tab-item key="importJournal">
        <v-card flat>
          <v-data-table :headers="headers"
                        :items="$store.state.io.importJournal"
                        hide-actions>
            <template slot="items"
                      slot-scope="props">
              <td>{{ toReadableGameTime(props.item.gameTime) }}</td>
              <td>
                <v-layout wrap>
                  <template v-for="item in props.item.list">
                    <v-flex xs8
                            :key="item.good">
                      {{item.good}}
                    </v-flex>
                    <v-flex xs4
                            :key="item.good + '-unit'">
                      {{item.unit}}
                    </v-flex>
                  </template>
                </v-layout>
              </td>
              <td class="text-xs-right">{{ props.item.price }}</td>
              <td class="text-xs-right">{{ props.item.transportationStatus === 'COMPLETED' ? '已送達' : toReadableGameTime(gameTimeAdd(props.item.gameTime, props.item.transportationTime)) + '送達' }}</td>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>

      <v-tab key="exportJournal"
             ripple>輸出紀錄</v-tab>
      <v-tab-item key="exportJournal">
        <v-card flat>
          <v-data-table :headers="headers"
                        :items="$store.state.io.exportJournal"
                        hide-actions>
            <template slot="items"
                      slot-scope="props">
              <td>{{ toReadableGameTime(props.item.gameTime) }}</td>
              <td>
                <v-layout wrap>
                  <template v-for="item in props.item.list">
                    <v-flex xs8
                            :key="item.good">
                      {{item.good}}
                    </v-flex>
                    <v-flex xs4
                            :key="item.good + '-unit'">
                      {{item.unit}}
                    </v-flex>
                  </template>
                </v-layout>
              </td>
              <td class="text-xs-right">{{ props.item.price }}</td>
              <td class="text-xs-right">{{ props.item.transportationStatus === 'COMPLETED' ? '已送達' : toReadableGameTime(gameTimeAdd(props.item.gameTime, props.item.transportationTime)) + '送達' }}</td>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
    </v-tabs>

    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
              max-width="500px"
              v-model="dialog">
      <v-form v-model="valid"
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
                <v-select :items="nodesNameList"
                          v-model="from"
                          label="輸出方"
                          :disabled="way === '1'"
                          autocomplete
                          required
                          :rules="requiredRule"></v-select>
              </v-flex>
              <v-flex xs12
                      sm6
                      :pl-2="!$vuetify.breakpoint.xsOnly">
                <v-select :items="nodesNameList"
                          v-model="to"
                          label="輸入方"
                          :disabled="way === '0'"
                          autocomplete
                          required
                          :rules="requiredRule"></v-select>
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
                  <v-select :items="goods"
                            v-model="item.good"
                            label="種類"
                            autocomplete
                            required
                            :rules="requiredRule"
                            hide-details></v-select>
                </v-flex>
                <v-flex xs12
                        sm3
                        :px-2="!$vuetify.breakpoint.xsOnly"
                        :key="index + '-unit'">
                  <v-text-field v-model="item.unit"
                                label="數量"
                                type="number"
                                required
                                :rules="requiredRule"
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
                {{0}}
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn flat
                   @click="clear(), dialog = false">關閉</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat
                   @click="clear">清除</v-btn>
            <v-btn flat
                   :disabled="!valid || loading"
                   @click="submit">登記</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/api'
import { TRANSPORTATION_STATUS } from '@/lib/schema'

export default {
  props: {
    engineId: String,
    nodeName: String
  },
  data: () => ({
    active: null,
    way: '1',
    goods: ['Car', 'Engine', 'Body', 'Wheel'],
    headers: [
      {
        text: '時間',
        align: 'left',
        sortable: false,
        value: 'gameTime'
      },
      {
        text: '商品',
        align: 'left',
        sortable: false,
        value: 'list'
      },
      { text: '價格', value: 'price', sortable: false },
      { text: '狀態', value: 'transportationStatus', sortable: false }
    ],

    dialog: false,
    loading: false,
    hasTransportationDelay: true,
    transportationTime: 10,
    transportationCost: 100,
    from: '',
    to: '',
    memo: '',
    list: [],

    valid: null,
    requiredRule: [v => !!v || '必需項']
  }),
  watch: {
    nodeName(newVal) {
      this.load()
    },
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
    node() {
      return (
        this.$store.state.engine.nodes.find(
          node => node.name === this.nodeName
        ) || {}
      )
    },
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
    },
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime'])
  },
  methods: {
    submit() {
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
    },
    load() {
      this.$store
        .dispatch('io/load', {
          engineId: this.engineId,
          nodeName: this.nodeName
        })
        .then(() => {
          switch (this.way) {
            case '0':
              this.to = this.nodeName
              break

            default:
            case '1':
              this.from = this.nodeName
              break
          }
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
