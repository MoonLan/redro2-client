<template>
  <v-tabs centered
          show-arrows>
    <template v-for="tab in tabs">
      <v-tab :key="tab.key">{{tab.header}}</v-tab>
      <v-tab-item :key="tab.key">
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
        { header: '可供選購', key: 'released', description: '' },
        { header: '你釋出', key: 'selfReleased', newComing: 1 },
        { header: '已締約', key: 'selfSigned' },
        { header: '已完成', key: 'selfCompleted' },
        { header: '解約訂單', key: 'selfBreakoff' }
      ]
    }
  }
}
</script>

<style>
</style>
