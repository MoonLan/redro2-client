<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
            max-width="500px"
            persistent
            :value="value"
            @input="(val) => {$emit('input', val)}">
    <v-card>
      <v-card-title>
        <v-btn icon
               flat
               v-if="active === '1'"
               @click="active = '0'">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <span class="headline">掃描QR CODE</span>
        <v-spacer></v-spacer>
        <v-btn icon
               flat
               @click="$emit('input', false)">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>

      <v-tabs v-model="active"
              centered>
        <v-tab disabled
               key="reader">1. 掃描</v-tab>
        <v-tab disabled
               key="info">2. 確認</v-tab>

        <v-tab-item key="reader">
          <v-card-text class="text-xs-center pt-5">
            <div>
              <qrcode-reader @decode="onDecode"
                             @init="onInit"></qrcode-reader>
            </div>
            <div v-if="error">
              {{error.name}} {{error.message}}
            </div>
            <div>
              <v-text-field name="biddingId"
                            label="訂單ID"
                            v-model="biddingId"></v-text-field>
              <v-btn @click="getBidding(biddingId)"
                     :disabled="!biddingId">查詢訂單</v-btn>
            </div>
            <div class="pt-3">
              想要運送這張訂單，請準備正確數量的貨品，並把這一頁打開給物流士掃描。掃描QR Code時，請將螢幕亮度調到最大。
            </div>
          </v-card-text>
        </v-tab-item>

        <v-tab-item key="info">
          <v-card-text v-if="!bidding">
            找不到訂單 {{biddingId}}。
          </v-card-text>
          <v-card-text v-else>
            <v-layout wrap
                      class="labeled-list">
              <v-flex xs6>
                <span class="label">上架者</span>
                {{bidding.publisher}}
              </v-flex>
              <v-flex xs6>
                <span class="label">簽署者</span>
                {{bidding.signer}}
              </v-flex>
              <v-flex xs6>
                <span class="label">總金額</span>
                {{bidding.price}}
              </v-flex>
              <v-flex xs6>
                <span class="label">締約後時限</span>
              </v-flex>
              <v-flex xs12>
                <span class="label">訂單ID</span>
                {{bidding._id}}
              </v-flex>
            </v-layout>
            <div class="pt-3">
              請確定1.貨品數量，2.找你的人是不是簽屬者。
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="active = '0', biddingId = null"
                   flat>取消</v-btn>
            <v-spacer />
            <v-btn @click="deliver(biddingId, bidding.signer)"
                   :disabled="!bidding"
                   flat
                   outline>運輸</v-btn>
          </v-card-actions>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(VueQrcodeReader)

export default {
  props: {
    value: Boolean
  },
  data() {
    return {
      active: '0',
      error: null,
      biddingId: null,
      bidding: null
    }
  },
  computed: {
    ...mapState('biddingmarket', [
      'nodeName',
      'upstreams',
      'downstreams',
      'biddings'
    ])
  },
  methods: {
    onInit(promise) {
      promise
        .then(msg => {
          console.log(msg)
        })
        .catch(error => {
          console.log(error)
          this.error = error
          if (error.name === 'NotAllowedError') {
            // user denied camera access permisson
          } else if (error.name === 'NotFoundError') {
            // no suitable camera device installed
          } else if (error.name === 'NotSupportedError') {
            // page is not served over HTTPS (or localhost)
          } else if (error.name === 'NotReadableError') {
            // maybe camera is already in use
          } else if (error.name === 'OverconstrainedError') {
            // passed constraints don't match any camera. Did you requested the front camera although there is none?
          } else {
            // browser is probably lacking features (WebRTC, Canvas)
          }
        })
    },
    onDecode(biddingId) {
      console.log(biddingId)
      this.getBidding(biddingId)
    },
    getBidding(id) {
      this.active = '1'
      this.bidding = this.biddings.find(item => item._id === id)
    },
    deliver(id) {
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch('biddingmarket/deliver', {
          id: id
        })
        .then(() => {
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          console.error(err)
          this.$store.commit('ui/STOP_LOADING')
        })
    }
  }
}
</script>

<style lang="scss">
.qrcode {
  display: inline-block;
}
</style>
