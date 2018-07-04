<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-biddingmarketpanel">
    <v-tabs v-model="active"
            centered
            show-arrows>
      <v-tab key="overview"
             ripple>概覽</v-tab>
      <v-tab-item key="overview">
        <v-card flat>
          <template v-if="$store.getters['user/isStaffOrAdmin']">
            <v-subheader>工作人員用控制項</v-subheader>
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12>
                  <v-btn @click="dialog = true"
                         outline>
                    <v-icon>photo_camera</v-icon>掃描QR CODE
                  </v-btn>
                  <v-btn @click="dialog = true"
                         outline>
                    <v-icon>import_export</v-icon>輸入ID
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider />
          </template>

          <v-card-text>
            <v-layout wrap
                      class="labeled-list">
              <v-flex xs6
                      md3>
                <span class="label">解約罰金比例</span>
                {{breakoffPaneltyRatio}}倍訂單價格
              </v-flex>
              <v-flex xs6
                      md3>
                <span class="label">解約賠償比例</span>
                {{breakoffCompensationRatio}}倍訂單價格
              </v-flex>
              <v-flex xs6
                      md3>
                <span class="label">運輸時間</span>
                {{transportationTime}}秒
              </v-flex>
            </v-layout>
          </v-card-text>

          <v-divider />
          <v-subheader>upstream</v-subheader>
          <v-list>
            <v-list-tile v-for="node in upstreams"
                         :key="node">{{node}}</v-list-tile>
          </v-list>

          <v-subheader>downstream</v-subheader>
          <v-list>
            <v-list-tile v-for="node in downstreams"
                         :key="node">{{node}}</v-list-tile>
          </v-list>
        </v-card>
      </v-tab-item>

      <template v-for="tab in tabs">
        <v-tab :key="tab.key"
               ripple>{{tab.header}}</v-tab>
        <v-tab-item :key="tab.key">
          <v-container grid-list-md>
            <v-layout row
                      wrap>
              <v-flex xs12
                      sm6
                      xl4
                      v-for="item in $store.getters[`biddingmarket/${tab.key}`]"
                      :key="item._id">
                <v-card tile>
                  <div :class="`order-media list-${item.goods.length}`">
                    <div :class="`order-media-item ${good.good.toLowerCase()}`"
                         v-for="good in item.goods"
                         :key="good.good">
                      <div class="box">
                        <span>x{{good.unit}}</span>
                      </div>
                    </div>
                  </div>
                  <v-card-title>
                    <span class="headline">{{item.publisher}}</span>
                  </v-card-title>
                  <v-card-text class="px-3 py-2">
                    <v-layout v-for="good in item.goods"
                              :key="good.good">
                      <v-flex xs4>{{good.good}}</v-flex>
                      <v-flex xs4
                              class="px-1 py-1 text-xs-right">{{good.unit}}個</v-flex>
                      <v-flex xs4
                              class="px-1 py-1 text-xs-right">${{good.unitPrice}}/個</v-flex>
                    </v-layout>
                  </v-card-text>
                  <v-card-actions class="py-1">
                    <span v-if="item.stage === 'BIDDING'"
                          class="mx-0 grey--text">{{toReadableGameTime(item.gameTime)}} 上架</span>
                    <span v-if="item.stage === 'SIGNED' && item.signedGameTime"
                          class="mx-0 grey--text">{{toReadableGameTime(gameTimeAdd(item.signedGameTime, item.timeLimit))}} 到期</span>
                    <v-spacer />
                    <v-btn v-if="item.stage === 'SIGNED'"
                           @click="dialog = true; defaultBiddingId = item._id"
                           outline>運輸</v-btn>
                    <span v-else-if="item.stage === 'BIDDING'">已上架</span>
                    <span v-else-if="item.stage === 'COMPLETED'">已送出</span>
                    <span v-else-if="item.stage === 'BREAKOFF'">已解約</span>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-tab-item>
      </template>
    </v-tabs>

    <v-fab-transition>
      <v-btn @click="dialog = true"
             fixed
             fab
             bottom
             right>
        <v-icon>photo_camera</v-icon>
      </v-btn>
    </v-fab-transition>
    <bidding-deliver-dialog v-model="dialog"
                            :default-bidding-id="defaultBiddingId" />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import api from '@/api'
import BiddingDeliverDialog from './BiddingDeliverDialog'

export default {
  components: {
    BiddingDeliverDialog
  },
  props: {
    engineId: String,
    nodeName: String
  },
  data: () => ({
    active: null,
    tabs: [
      { header: '已釋出', key: 'released', newComing: 1 },
      { header: '已締約', key: 'signed' },
      { header: '已完成', key: 'completed' },
      { header: '已取消', key: 'canceled' },
      { header: '已解約', key: 'breakoff' }
    ],
    dialog: false,
    defaultBiddingId: null
  }),
  computed: {
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime']),
    ...mapState('biddingmarket', [
      'upstreams',
      'downstreams',
      'biddings',
      'breakoffPaneltyRatio',
      'breakoffCompensationRatio',
      'transportationTime',
      'transportationStatus',
      'released',
      'signed',
      'completed',
      'canceled',
      'breakoff'
    ])
  }
}
</script>

<style lang="scss">
.game-biddingmarketpanel {
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
        background-image: url('/static/img/goods/car64x64.png');
      }
    }

    .order-media-item.engine {
      background-color: #b7c284;
      .box {
        background-image: url('/static/img/goods/engine64x64.png');
      }
    }

    .order-media-item.body {
      background-color: #9de3ff;
      .box {
        background-image: url('/static/img/goods/body64x64.png');
      }
    }

    .order-media-item.wheel {
      background-color: #8a8a8a;
      color: #fff;
      .box {
        background-image: url('/static/img/goods/wheel64x64.png');
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
