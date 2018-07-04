<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-iopanel">
    <v-tabs v-model="active"
            centered>
      <v-tab v-if="isAdmin"
             key="overview"
             ripple>概覽</v-tab>
      <v-tab-item v-if="isAdmin"
                  key="overview">
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
                {{$store.getters['account/getBalance']('CostOfTransportation')}}
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
    ]
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
    },
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime']),
    ...mapGetters('user', ['isAdmin'])
  },
  methods: {
    load() {
      this.$store.dispatch('io/load', {
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
