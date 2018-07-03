<template>
  <v-dialog :fullscreen="$vuetify.breakpoint.xsOnly"
            max-width="500px"
            persistent
            :value="value"
            @input="(val) => {$emit('input', val)}">
    <v-card v-if="biddingItem">
      <v-card-title>
        <span class="headline">訂單的詳細資訊</span>
        <v-spacer></v-spacer>
        <v-btn icon
               flat
               @click="$emit('input', false)">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="text-xs-center">
        <div v-if="biddingItem !== 'SIGNED'"
             class="red--text pb-3">此單目前不可運輸，可能還沒締約，或已經解約了，或過期了。</div>
        <div>
          <qrcode class="qrcode"
                  :text="biddingItem._id"></qrcode>
        </div>
        <div class="pt-3">
          想要運送這張訂單，請準備正確數量的貨品，並把這一頁打開給物流士掃描。掃描QR Code時，請將螢幕亮度調到最大。
        </div>
      </v-card-text>
      <v-card-text>
        <v-layout wrap
                  class="labeled-list">
          <v-flex xs4>
            <span class="label">總金額</span>
            {{biddingItem.price}}
          </v-flex>
          <v-flex xs4>
            <span class="label">訂單階段</span>
            {{biddingItem.stage}}
          </v-flex>
          <v-flex xs4>
            <span class="label">締約後時限</span>
            {{biddingItem.timeLimit}}秒
          </v-flex>
          <v-flex xs12>
            <span class="label">訂單ID</span>
            {{biddingItem._id}}
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import VueQRCodeComponent from 'vue-qrcode-component'

export default {
  components: {
    qrcode: VueQRCodeComponent
  },
  props: {
    value: Boolean,
    biddingItem: null
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('biddingmarketreceiver', ['nodeName', 'upstream', 'downstream'])
  },
  methods: {}
}
</script>

<style lang="scss">
.qrcode {
  display: inline-block;
}
</style>
