<template>
  <v-tabs>
    <template v-for="tab in tabs">
      <v-tab :key="tab.key">{{tab.header}}</v-tab>
      <v-tab-item :key="tab.key">
        <bidding-list :chain="chain" />
        <v-btn @click="dialog = true" fixed fab bottom right>
          <v-icon>launch</v-icon>
        </v-btn>
        <bidding-release-dialog v-model="dialog" :chain="chain" />
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
      dialog: null,
      tabs: [
        { header: '可供選購', key: 'released', description: '' },
        { header: '您釋出', key: 'selfReleased', newComing: 1 },
        { header: '已締約', key: 'signed' },
        { header: '已完成', key: 'completed' }
      ]
    }
  }
}
</script>

<style>
</style>
