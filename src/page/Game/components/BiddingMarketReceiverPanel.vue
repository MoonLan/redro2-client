<template>
  <v-container ma-0 pa-0 class="game-biddingmarketreceiverpanel">
    <v-tabs v-model="active">
      <v-tab key="overview" ripple>概覽</v-tab>
      <v-tab-item key="overview">
        <v-card flat>
          <v-card-text>
            <v-layout wrap class="labeled-list">
              <v-flex xs6 md3>
                <span class="label">銷貨收入</span>
                {{$store.getters['account/getBalance']('Sales')}}
              </v-flex>
              <v-flex xs6 md3>
                <span class="label">銷貨成本</span>
                {{$store.getters['account/getBalance']('CostOfSales')}}
              </v-flex>
              <v-flex xs6 md3>
                <span class="label">運輸成本</span>
                {{$store.getters['account/getBalance']('CostOfTranportation')}}
              </v-flex>
              <v-flex xs6 md3>
                <span class="label">預設運輸成本</span>
                {{$store.state.io.transportationCost}}
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-divider v-if="$store.getters['user/isStaffOrAdmin']" />
          <v-card-text v-if="$store.getters['user/isStaffOrAdmin']">
            <v-layout wrap>
              <v-flex xs12>
                <v-subheader>工作人員用控制項</v-subheader>
              </v-flex>
              <v-flex xs12>
                <v-btn @click="dialog = true" outline>
                  <v-icon>import_export</v-icon>輸入輸出
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab key="upstream" ripple>零件競標市場</v-tab>
      <v-tab-item key="upstream">
        <v-tabs>
          <v-tab key="upstream-released-by-player">您開出的</v-tab>

          <v-tab-item key="upstream-released-by-player">
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12 sm6 xl4 v-for="i in 3" :key="i">
                  <v-card tile>
                    <div :class="`order-media list-${i}`">
                      <div :class="`order-media-item ${i === 1 ? 'car' : 'wheel'}`" v-for="k in i" :key="k">
                        <div class="box">
                          <span>x12</span>
                        </div>
                      </div>
                    </div>
                    <v-card-text class="px-3 py-2">
                      <v-layout v-for="i in 3" :key="i">
                        <v-flex xs6>引擎</v-flex>
                        <v-flex xs3 class="px-1 py-1 text-xs-right">4個</v-flex>
                        <v-flex xs3 class="px-1 py-1 text-xs-right">$10/個</v-flex>
                      </v-layout>
                    </v-card-text>
                    <v-card-actions class="py-1">
                      <v-menu nudge-top top>
                        <v-btn slot="activator" icon>
                          <v-icon>more_vert</v-icon>
                        </v-btn>
                        <v-list two-line ripple>
                          <v-list-tile @click="">
                            <v-list-tile-content>
                              <v-list-tile-title>取消訂單</v-list-tile-title>
                              <v-list-tile-sub-title>不需要手續費</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-list-tile @click="">
                            <v-list-tile-content>
                              <v-list-tile-title>訂單解約</v-list-tile-title>
                              <v-list-tile-sub-title>需支付1.2倍訂單價格的違約金</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                      <span class="mx-0 grey--text">第二天 4:32 上架</span>
                      <v-spacer />
                      <v-btn flat color="primary">$120 成交</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>

          <v-tab key="upstream-signed">您購買的</v-tab>
          <v-tab key="upstream-completed">已完成</v-tab>
          <v-tab key="upstream-released">可供選購</v-tab>
          <v-tab key="exp">實驗</v-tab>

          <v-tab-item key="exp">
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12 sm6 v-for="i in 3" :key="i">
                  <v-card tile>
                    <v-card-media :src="`https://unsplash.it/150/300?image=${Math.floor(Math.random() * 100) + 1}`" height="75px">
                    </v-card-media>
                    <v-card-text class="px-3 py-2">
                      <v-layout v-for="i in 3" :key="i">
                        <v-flex xs6>引擎</v-flex>
                        <v-flex xs3 class="px-1 py-1 text-xs-right">4個</v-flex>
                        <v-flex xs3 class="px-1 py-1 text-xs-right">$10/個</v-flex>
                      </v-layout>
                    </v-card-text>
                    <v-card-actions class="py-1">
                      <v-menu offset-y>
                        <v-btn slot="activator" icon>
                          <v-icon>more_vert</v-icon>
                        </v-btn>
                        <v-list>
                          <v-list-tile>
                            <v-list-tile-title>取消訂單（不需要手續費）</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile>
                            <v-list-tile-title>訂單解約（需支付1.2倍的違約金）</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-menu>
                      <span class="mx-0 grey--text">第二天 4:32 上架</span>
                      <v-spacer />
                      <v-btn flat color="primary">$120 購買</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-tab-item>

      <v-tab key="downstream" ripple>汽車競標市場</v-tab>
      <v-tab-item key="downstream">
        <v-card flat>
          <v-card-text>
            <v-data-table :headers="headers" :items="$store.state.io.exportJournal" hide-actions>
              <template slot="items" slot-scope="props">
                <td>{{ toReadableGameTime(props.item.gameTime) }}</td>
                <td>
                  <v-layout wrap>
                    <template v-for="item in props.item.list">
                      <v-flex xs8 :key="item.good">
                        {{item.good}}
                      </v-flex>
                      <v-flex xs4 :key="item.good + '-unit'">
                        {{item.unit}}
                      </v-flex>
                    </template>
                  </v-layout>
                </td>
                <td class="text-xs-right">{{ props.item.price }}</td>
                <td class="text-xs-right">{{ props.item.transportationStatus === 'COMPLETED' ? '已送達' : toReadableGameTime(gameTimeAdd(props.item.gameTime, props.item.transportationTime)) + '送達' }}</td>
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
                <v-text-field v-model="memo" label="備註"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 :pr-2="!$vuetify.breakpoint.xsOnly">
                <v-select :items="nodesNameList" v-model="from" label="輸出方" :disabled="way === '1'" autocomplete required :rules="requiredRule"></v-select>
              </v-flex>
              <v-flex xs12 sm6 :pl-2="!$vuetify.breakpoint.xsOnly">
                <v-select :items="nodesNameList" v-model="to" label="輸入方" :disabled="way === '0'" autocomplete required :rules="requiredRule"></v-select>
              </v-flex>
              <v-flex xs12 sm4 pt-3 :pr-2="!$vuetify.breakpoint.xsOnly">
                <v-checkbox label="有物流延遲" v-model="hasTransportationDelay"></v-checkbox>
              </v-flex>
              <v-flex xs12 sm4 :px-2="!$vuetify.breakpoint.xsOnly">
                <v-text-field label="物流延遲時間" type="number" suffix="秒" :disabled="!hasTransportationDelay" v-model="transportationTime"></v-text-field>
              </v-flex>
              <v-flex xs12 sm4 :pl-2="!$vuetify.breakpoint.xsOnly">
                <v-text-field label="物流成本" type="number" prefix="$" v-model="transportationCost"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <h3>項目</h3>
            <v-layout wrap>
              <template v-for="(item, index) in list">
                <v-flex xs12 sm5 :pr-2="!$vuetify.breakpoint.xsOnly" :key="index + '-good'">
                  <v-select :items="goods" v-model="item.good" label="種類" autocomplete required :rules="requiredRule" hide-details></v-select>
                </v-flex>
                <v-flex xs12 sm3 :px-2="!$vuetify.breakpoint.xsOnly" :key="index + '-unit'">
                  <v-text-field v-model="item.unit" label="數量" type="number" required :rules="requiredRule" hide-details></v-text-field>
                </v-flex>
                <v-flex xs8 sm3 :px-2="!$vuetify.breakpoint.xsOnly" :key="index + '-unitPirce'">
                  <v-text-field v-model="item.unitPrice" label="單價" type="number" hide-details></v-text-field>
                </v-flex>
                <v-flex xs4 sm1 :key="index + '-close'">
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
            <v-btn flat @click="clear(), dialog = false">關閉</v-btn>
            <v-spacer></v-spacer>
            <v-btn flat @click="clear">清除</v-btn>
            <v-btn flat :disabled="!valid || loading" @click="submit">登記</v-btn>
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
      return this.$store.state.engine.nodes.find(node => node.name === this.nodeName) || {}
    },
    price() {
      let sum = 0
      for (let item of this.list) {
        sum += parseInt(item.unit ? item.unit : 0) * parseFloat(item.unitPrice ? item.unitPrice : 0)
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
    // this.load()
  }
}
</script>

<style lang="scss">
.game-biddingmarketreceiverpanel {
  .order-media {
    $h: 64px;
    text-align: center;
    height: $h;

    .order-media-item {
      display: inline-block;
      position: absolute;
      width: 64px;
      height: $h;

      .box {
        position: absolute;
        width: 64px;
        height: $h;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;

        span {
          position: absolute;
          bottom: 0px;
          right: 5px;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }

    .order-media-item.car {
      background-color: #a5f9e1;
      .box {
        background-image: url('/static/img/car64x64.png');
      }
    }

    .order-media-item.wheel {
      background-color: #c9c3ff;
      .box {
        background-image: url('/static/img/wheel.png');
      }
    }
  }

  .order-media.list-1 {
    .order-media-item {
      width: 100%;
      left: 0;
      .box {
        right: calc(50% - 32px);
      }
    }
  }

  .order-media.list-2 {
    .order-media-item:first-child {
      width: 50%;
      left: 0;
      .box {
        right: 0;
      }
    }
    .order-media-item:last-child {
      width: 50%;
      right: 0;
      .box {
        left: 0;
      }
    }
  }

  .order-media.list-3 {
    .order-media-item:first-child {
      width: calc(50% - 32px);
      left: 0;

      .box {
        right: 0;
      }
    }
    .order-media-item:nth-child(2) {
      width: 64px;
      right: calc(50% - 32px);

      .box {
        left: 0;
      }
    }
    .order-media-item:last-child {
      width: calc(50% - 32px);
      right: 0;
      .box {
        left: 0;
      }
    }
  }
}
</style>
