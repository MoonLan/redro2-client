<template>
  <v-tabs centered
          show-arrows>
    <template v-for="tab in tabs">
      <v-tab :key="tab.key">{{tab.header}}</v-tab>
      <v-tab-item :key="tab.key">
        <v-card class="transparent elevation-0">
          <v-card-text class="grey--text">{{tab.description}}</v-card-text>
        </v-card>
        <bidding-list :chain="chain"
                      :filter="tab.key" />
      </v-tab-item>
    </template>
  </v-tabs>
</template>

<script>
import BiddingReleaseDialog from './BiddingReleaseDialog'
import BiddingList from './BiddingList'

export default {
  components: {
    BiddingList,
    BiddingReleaseDialog
  },
  props: {
    chain: String
  },
  data() {
    return {
      dialog: false,
      tabs: [
        {
          header: '可供選購',
          key: 'released',
          description:
            '目前競標市場上還沒被任何人簽約的訂單，其他人或您可以選購。'
        },
        {
          header: '你釋出',
          key: 'selfReleased',
          description: '您釋出的訂單，但還沒辦任何人簽約，其他人可以選購。'
        },
        {
          header: '已締約',
          key: 'selfSigned',
          description:
            '您已經和他人簽約成功的訂單，您或是對方要在締約期限內找競標市場運送，否則會自動解約。'
        },
        {
          header: '已完成',
          key: 'selfCompleted',
          description:
            '您已經完成的訂單，如果還沒送貨完成，可能是還在運送途中。'
        },
        {
          header: '解約訂單',
          key: 'selfBreakoff',
          description:
            '您已經解約的訂單，可能是對方解約的，也可能是您自己解約的，或是超過締約期限自動解約。'
        }
      ]
    }
  }
}
</script>

<style>
</style>
