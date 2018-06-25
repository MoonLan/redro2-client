<template>
  <v-tabs>
    <template v-for="tab in tabs">
      <v-tab :key="tab.key">{{tab.header}}</v-tab>
      <v-tab-item :key="tab.key">
        <bidding-list :chain="chain"
                      :filter="tab.key" />
        <v-btn @click="dialog = true"
               fixed
               fab
               bottom
               right>
          <v-icon>launch</v-icon>
        </v-btn>
      </v-tab-item>
    </template>
    <bidding-release-dialog v-model="dialog"
                            :chain="chain" />
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
        { header: '您釋出', key: 'selfReleased', newComing: 1 },
        { header: '已締約', key: 'selfSigned' },
        { header: '已完成', key: 'selfCompleted' }
      ]
    }
  }
}
</script>

<style>
</style>
