<template>
  <v-container ma-0 pa-0 class="game-biddingmarketreceiverpanel">
    <v-tabs v-model="active">
      <v-tab key="overview" ripple>概覽</v-tab>
      <v-tab-item key="overview">
        <v-card flat>
          <template v-for="chain in ['upstream', 'downstream']" v-if="$store.state.biddingmarketreceiver[chain].enable">
            <v-subheader :key="chain">{{chain}} {{$store.state.biddingmarketreceiver[chain].name}}</v-subheader>

            <v-card-text :key="chain + '-card-text'">
              <v-layout wrap class="labeled-list">
                <v-flex xs6 md3>
                  <span class="label">物流時間</span>
                  {{$store.state.biddingmarketreceiver[chain].transportationTime}}秒
                </v-flex>
                <v-flex xs6 md3>
                  <span class="label">解約罰金比例</span>
                  {{$store.state.biddingmarketreceiver[chain].breakoffPaneltyRatio}}倍訂單價格
                </v-flex>
                <v-flex xs6 md3>
                  <span class="label">解約賠償比例</span>
                  {{$store.state.biddingmarketreceiver[chain].breakoffCompensationRatio}}倍訂單價格
                </v-flex>
              </v-layout>
            </v-card-text>
          </template>

          <template v-if="$store.getters['user/isStaffOrAdmin']">
            <v-divider />
            <v-subheader>工作人員用控制項</v-subheader>
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12>
                  <v-btn @click="dialog = true" outline>
                    <v-icon>launch</v-icon>釋出競標
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </template>
        </v-card>
      </v-tab-item>

      <template v-for="chain in ['upstream', 'downstream']" v-if="$store.state.biddingmarketreceiver[chain].enable">
        <v-tab :key="chain" ripple>{{$store.state.biddingmarketreceiver[chain].name}}</v-tab>
        <v-tab-item :key="chain">
          <bidding-tabs :chain="chain" />
        </v-tab-item>
      </template>
    </v-tabs>

    <bidding-release-dialog v-model="dialog" />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
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
    dialog: null
  }),
  watch: {
    nodeName(newVal) {
      this.load()
    }
  },
  computed: {
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime'])
  },
  methods: {
    load() {
      this.$store.dispatch('biddingmarketreceiver/load', {
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
