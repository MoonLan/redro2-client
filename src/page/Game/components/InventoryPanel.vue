<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-inventorypanel">
    <v-card flat>
      <template v-if="$store.getters['user/isStaffOrAdmin']">
        <v-subheader>工作人員用控制項</v-subheader>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12>
              <v-btn @click="dialog = true"
                     outline>
                <v-icon>import_export</v-icon>輸入輸出倉儲
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider />

        <v-card-text>
          <v-layout wrap
                    class="labeled-list">
            <v-flex xs6
                    md3>
              <span class="label">模式</span>
              {{$store.state.inventory.mode}}
            </v-flex>
            <v-flex xs6
                    md3>
              <span class="label">存貨成本</span>
              {{$store.getters['account/getBalance']('Inventory')}}
            </v-flex>
            <v-flex xs6
                    md3>
              <span class="label">倉儲成本</span>
              {{$store.getters['account/getBalance']('CostOfWarehousing')}}
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-divider />
      </template>

      <v-data-table :headers="headers"
                    :items="$store.state.inventory.storage"
                    hide-actions>
        <template slot="items"
                  slot-scope="props">
          <td>{{ props.item.good }}</td>
          <td class="text-xs-right">{{ props.item.unit }}</td>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
              max-width="500px"
              v-model="dialog">
      <v-form v-model="valid"
              @submit.prevent="submit"
              ref="form">
        <v-card>
          <v-card-title>
            <h3 class="headline">輸入輸出倉儲</h3>
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
                          :rules="requiredRule"
                          hide-details></v-select>
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
                          :rules="requiredRule"
                          hide-details></v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <h3>項目</h3>
            <v-layout wrap
                      grid-list-xs>
              <template v-for="(item, index) in list">
                <v-flex xs12
                        sm5
                        pr-3
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
                        pr-3
                        :key="index + '-unit'">
                  <v-text-field v-model="item.unit"
                                label="數量"
                                type="number"
                                required
                                :rules="requiredRule"
                                hide-details></v-text-field>
                </v-flex>
                <v-flex xs12
                        sm3
                        :key="index + '-unitPirce'">
                  <v-text-field v-model="item.unitPrice"
                                label="單價"
                                type="number"
                                hide-details></v-text-field>
                </v-flex>
                <v-flex xs12
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
              <v-flex>
                <span class="label">總金額</span>
                {{price}}
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
    loading: false,
    from: '',
    to: '',
    memo: '',
    list: [],

    valid: null,
    requiredRule: [v => !!v || '必需項']
  }),
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
    }
  },
  methods: {
    submit() {
      if (!this.valid) {
        return
      }
      let ioJournalItem = {
        from: this.from,
        to: this.to,
        list: this.list,
        price: this.price,
        memo: this.memo,
        gameTime: this.$store.state.engine.gameTime
      }
      this.loading = true
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch(
          `inventory/${this.way === '0' ? 'import' : 'export'}`,
          ioJournalItem
        )
        .then(inventory => {
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
