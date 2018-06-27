<template>
  <v-container grid-list-md>
    <v-layout row
              wrap>
      <v-flex xs12
              sm6
              xl4
              v-for="item in list"
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
            <v-menu nudge-top
                    top>
              <v-btn slot="activator"
                     icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list two-line
                      ripple>
                <v-list-tile v-if="item.stage === 'BIDDING' && item.publisher === nodeName"
                             @click="cancel(item)">
                  <v-list-tile-content>
                    <v-list-tile-title>取消訂單</v-list-tile-title>
                    <v-list-tile-sub-title>不需要手續費</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if="item.stage === 'SIGNED' && (item.publisher === nodeName || item.signer === nodeName)"
                             @click="breakoff(item)">
                  <v-list-tile-content>
                    <v-list-tile-title>訂單解約</v-list-tile-title>
                    <v-list-tile-sub-title>需支付{{biddingMarket.breakoffPaneltyRatio}}倍訂單價格的違約金</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="biddingItemDialogBiddingItem = item; biddingItemDialog = true">
                  <v-list-tile-content>
                    <v-list-tile-title>競標資訊</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
            <span class="mx-0 grey--text">{{toReadableGameTime(item.gameTime)}} 上架</span>
            <v-spacer />
            <v-btn v-if="item.stage === 'BIDDING' && item.publisher !== nodeName && item.publishedFromChain === chain.toUpperCase()"
                   @click="sign(item)"
                   flat
                   color="primary">${{item.price}} 成交</v-btn>
            <v-btn v-else-if="item.stage === 'SIGNED' && item.signer === nodeName && chain === 'downstream'"
                   @click="biddingItemDialogBiddingItem = item; biddingItemDialog = true"
                   flat
                   color="primary">準備運輸</v-btn>
            <span v-else-if="item.publisher === nodeName && item.stage === 'BIDDING'">你上架的</span>
            <span v-else-if="item.publisher === nodeName && item.stage === 'SIGNED'">製造中</span>
            <span v-else-if="item.stage === 'COMPLETED'">已送出</span>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <bidding-item-dialog v-model="biddingItemDialog"
                         :bidding-item="biddingItemDialogBiddingItem" />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import BiddingItemDialog from './BiddingItemDialog'

export default {
  components: {
    BiddingItemDialog
  },
  props: {
    chain: String,
    filter: String
  },
  data() {
    return {
      biddingItemDialog: false,
      biddingItemDialogBiddingItem: null
    }
  },
  computed: {
    ...mapGetters('engine', ['gameTimeAdd', 'toReadableGameTime']),
    ...mapGetters('biddingmarketreceiver', [
      'upstreamReleased',
      'upstreamSelfReleased',
      'upstreamSelfSigned',
      'upstreamSelfCompleted',
      'downstreamReleased',
      'downstreamSelfReleased',
      'downstreamSelfSigned',
      'downstreamSelfCompleted'
    ]),
    ...mapState('biddingmarketreceiver', [
      'nodeName',
      'upstream',
      'downstream'
    ]),
    list() {
      const map = {
        upstream: {
          released: this.upstreamReleased,
          selfReleased: this.upstreamSelfReleased,
          selfSigned: this.upstreamSelfSigned,
          selfCompleted: this.upstreamSelfCompleted
        },
        downstream: {
          released: this.downstreamReleased,
          selfReleased: this.downstreamSelfReleased,
          selfSigned: this.downstreamSelfSigned,
          selfCompleted: this.downstreamSelfCompleted
        }
      }
      return map[this.chain][this.filter]
    },
    biddingMarket() {
      return this.chain === 'upstream' ? this.upstream : this.downstream
    }
  },
  methods: {
    sign(biddingItem) {
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch(
          `biddingmarketreceiver/signTo${
            this.chain === 'upstream' ? 'Upstream' : 'Downstream'
          }`,
          {
            id: biddingItem._id,
            operator: this.nodeName
          }
        )
        .then(data => {
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          this.$store.commit('ui/STOP_LOADING')
          console.error(err)
        })
    },
    cancel(biddingItem) {
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch(
          `biddingmarketreceiver/cancelTo${
            this.chain === 'upstream' ? 'Upstream' : 'Downstream'
          }`,
          {
            id: biddingItem._id,
            operator: this.nodeName
          }
        )
        .then(data => {
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          this.$store.commit('ui/STOP_LOADING')
          console.error(err)
        })
    },
    breakoff(biddingItem) {
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch(
          `biddingmarketreceiver/breakoffTo${
            this.chain === 'upstream' ? 'Upstream' : 'Downstream'
          }`,
          {
            id: biddingItem._id,
            operator: this.nodeName
          }
        )
        .then(data => {
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          this.$store.commit('ui/STOP_LOADING')
          console.error(err)
        })
    }
  }
}
</script>

<style>
</style>
