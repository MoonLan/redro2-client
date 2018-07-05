<template>
  <v-container ma-0
               pa-0
               fluid
               class="game-biddingmarketreceiverpanel">
    <v-tabs v-model="active"
            centered
            show-arrows>
      <v-tab v-if="isAdmin"
             href="#tab-overview"
             ripple>概覽</v-tab>
      <v-tab-item v-if="isAdmin"
                  id="tab-overview">
        <v-card flat>
          <template v-for="chain in ['upstream', 'downstream']"
                    v-if="$store.state.biddingmarketreceiver[chain].enable">
            <v-subheader :key="chain">{{chain}} {{$store.state.biddingmarketreceiver[chain].name}}</v-subheader>

            <v-card-text :key="chain + '-card-text'">
              <v-layout wrap
                        class="labeled-list">
                <v-flex xs6
                        md3>
                  <span class="label">物流時間</span>
                  {{$store.state.biddingmarketreceiver[chain].transportationTime}}秒
                </v-flex>
                <v-flex xs6
                        md3>
                  <span class="label">違約金比率</span>
                  {{$store.state.biddingmarketreceiver[chain].breakoffPaneltyRatio}}倍訂單價格
                </v-flex>
                <v-flex xs6
                        md3>
                  <span class="label">被解約者可以收到的賠償比例</span>
                  {{$store.state.biddingmarketreceiver[chain].breakoffCompensationRatio}}倍訂單價格
                </v-flex>
              </v-layout>
            </v-card-text>
          </template>
        </v-card>
      </v-tab-item>

      <template v-for="chain in ['downstream', 'upstream']"
                v-if="$store.state.biddingmarketreceiver[chain].enable">
        <v-tab :key="chain"
               :href="`#tab-${chain}`"
               ripple>{{$t('BiddingMarketReceiver.' + ($store.state.biddingmarketreceiver[chain].name))}}</v-tab>
        <v-tab-item :key="chain"
                    :id="`tab-${chain}`">
          <bidding-tabs :chain="chain" />
        </v-tab-item>
      </template>
    </v-tabs>
    <v-fab-transition>
      <v-btn v-if="$store.state.biddingmarketreceiver.upstream.enable"
             :disabled="isBankrupt"
             v-show="active === 'tab-upstream'"
             @click="dialog.upstream = true"
             fixed
             fab
             bottom
             right
             :key="'upstream-btn'">
        <v-icon>launch</v-icon>
      </v-btn>
    </v-fab-transition>
    <bidding-release-dialog v-if="$store.state.biddingmarketreceiver.upstream.enable && !isBankrupt"
                            v-model="dialog.upstream"
                            :chain="'upstream'"
                            :key="'upstream-dialog'" />

    <!--
    <v-btn v-if="$store.state.biddingmarketreceiver.downstream.enable"
           :hidden="active === 'downstream'"
           @click="dialog.downstream = true"
           fixed
           fab
           bottom
           right
           :key="'downstream-btn'">
      <v-icon>launch</v-icon>
    </v-btn>
    <bidding-release-dialog v-if="$store.state.biddingmarketreceiver.downstream.enable"
                            v-model="dialog.downstream"
                            :chain="'downstream'"
                            :key="'downstream-dialog'" />
    -->
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import api from '@/api'
import { TRANSPORTATION_STATUS } from '@/lib/schema'
import BiddingTabs from './BiddingTabs'
import BiddingReleaseDialog from './BiddingReleaseDialog'

export default {
  components: {
    BiddingTabs,
    BiddingReleaseDialog
  },
  props: {
    engineId: String,
    nodeName: String
  },
  data: () => ({
    active: null,
    dialog: {
      upstream: null,
      downstream: null
    }
  }),
  computed: {
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime']),
    ...mapGetters('user', ['isAdmin']),
    ...mapState('account', ['isBankrupt'])
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
