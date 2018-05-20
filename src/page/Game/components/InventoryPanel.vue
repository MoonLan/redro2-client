<template>
  <v-container ma-0 pa-0 class="game-inventorypanel">
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
                <span class="label">模式</span>
                {{$store.state.inventory.mode}}
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

      <v-tab key="storage" ripple>倉儲</v-tab>
      <v-tab-item key="storage">
        <v-card flat>
          <v-card-text>
            <v-data-table :headers="headers" :items="$store.state.inventory.storage" hide-actions>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.good }}</td>
                <td class="text-xs-right">{{ props.item.unit }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>

    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly" max-width="500px" v-model="dialog">
      <v-form v-model="valid" ref="form">
        <v-card>
          <v-card-title>
            <h3 class="headline">輸入輸出倉儲</h3>
          </v-card-title>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="memo" label="備註"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn-toggle v-model="way">
                  <v-btn flat>輸入</v-btn>
                  <v-btn flat>輸出</v-btn>
                </v-btn-toggle>
              </v-flex>
              <v-flex xs12 sm6 :pr-2="!$vuetify.breakpoint.xsOnly">
                <v-text-field v-model="from" label="輸出方"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 :pl-2="!$vuetify.breakpoint.xsOnly">
                <v-text-field v-model="to" label="輸入方"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <h3>項目</h3>
            <v-layout wrap grid-list-xs>
              <template v-for="(item, index) in list">
                <v-flex xs12 sm5 pr-3 :key="index + '-good'">
                  <v-select :items="goods" v-model="item.good" label="種類" autocomplete required :rules="requiredRule" hide-details></v-select>
                </v-flex>
                <v-flex xs12 sm3 pr-3 :key="index + '-unit'">
                  <v-text-field v-model="item.unit" label="數量" type="number" required :rules="requiredRule" hide-details></v-text-field>
                </v-flex>
                <v-flex xs12 sm3 :key="index + '-unitPirce'">
                  <v-text-field v-model="item.unitPrice" label="單價" type="number" hide-details></v-text-field>
                </v-flex>
                <v-flex xs12 sm1 :key="index + '-close'">
                  <v-btn class="mt-3" icon flat @click="removeItem(index)">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-flex>
              </template>
            </v-layout>
            <v-btn @click="addItem('debit')" block outline>增加項目</v-btn>
          </v-card-text>
          <v-card-text>
            <v-layout class="labeled-list">
              <v-flex>
                <span class="label">總金額</span>
                {{price}}
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn flat @click="clear(), dialog = false">關閉</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat @click="clear">清除</v-btn>
            <v-btn flat :disabled="!valid" @click="submit">登記</v-btn>
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
    way: 0,
    goods: ['Car', 'Engine', 'Body', 'Wheel'],
    headers: [
      {
        text: 'Good',
        align: 'left',
        sortable: true,
        value: 'good'
      },
      { text: 'Unit', value: 'unit' }
    ],

    dialog: false,
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
      let tmp
      switch (newVal) {
        case 0:
          tmp = this.to
          this.to = this.from || this.nodeName
          this.from = tmp
          break

        default:
        case 1:
          tmp = this.from
          this.from = this.to || this.nodeName
          this.to = this.from
          break
      }
    }
  },
  computed: {
    node() {
      return this.$store.state.engine.nodes.find(node => node.name === this.nodeName) || {}
    },
    price() {
      let sum = 0
      for (let item of this.list) {
        sum += parseInt(item.unit ? item.unit : 0) * parseFloat(item.unitPrice ? item.unitPrice : 0)
      }
      return sum
    }
  },
  methods: {
    submit() {
      let ioJournalItem = {
        from: this.from,
        to: this.to,
        list: this.list,
        price: this.price,
        memo: this.memo,
        gameTime: this.$store.state.engine.gameTime
      }
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch(`inventory/${this.way ? 'export' : 'import'}`, ioJournalItem)
        .then(inventory => {
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
        .dispatch('inventory/load', {
          engineId: this.engineId,
          nodeName: this.nodeName
        })
        .then(() => {
          switch (this.way) {
            case 0:
              this.to = this.from || this.nodeName
              break

            default:
            case 1:
              this.from = this.to || this.nodeName
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
